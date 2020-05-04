from flask import Flask,request,Response
import time
import sys
import json 

from flask_cors import CORS

app = Flask(__name__,static_folder='./build',static_url_path='/')
cors = CORS(app)


domains = ['http://www.publico.pt/', 'http://www.dn.pt/', 'http://www.rtp.pt/', 'http://www.cmjornal.xl.pt/', 'http://www.iol.pt/', 'http://www.tvi24.iol.pt/', 'http://noticias.sapo.pt/', 'http://expresso.sapo.pt/', 'http://sol.sapo.pt/', 'http://www.jornaldenegocios.pt/', 'http://abola.pt/', 'http://www.jn.pt/', 'http://sicnoticias.sapo.pt/', 'http://www.lux.iol.pt/', 'http://www.ionline.pt/', 'http://news.google.pt/', 'http://www.dinheirovivo.pt/', 'http://www.aeiou.pt/', 'http://www.tsf.pt/', 'http://meiosepublicidade.pt/', 'http://www.sabado.pt/', 'http://dnoticias.pt/', 'http://economico.sapo.pt/' ]


import random
import sqlalchemy as sa
import pymysql
import pandas as pd
import datetime
import multiprocessing
from multiprocessing import pool
from TemporalSummarizationFramework.contamehistorias.datasources.webarchive import ArquivoPT
from TemporalSummarizationFramework.contamehistorias.engine import TemporalSummarizationEngine
from TemporalSummarizationFramework.contamehistorias.datasources.utils import *

import credentials


class State(object):

    def __init__(self):
        self.con = pymysql.connect(credentials.server,credentials.user,credentials.pw, credentials.db)
        self.processesnumber = 4
        self.isrunning=False
        self.chunks=[]
        self.count=0
        self.initiallandstoget=20
        self.landstoget=self.initiallandstoget
        self.cursor=self.con.cursor(pymysql.cursors.DictCursor)

state = State()



    

@app.route('/api/time')
def get_time():
    return {'time': time.time()}


@app.route('/api/lugares/<up>/<right>/<left>/<down>/<landtype>')
@app.route('/api/lugares/<up>/<right>/<down>/<left>')
def get_landshere(up,right,left,down,landtype=None):

    if landtype==None:
        landtype=['A','C','D','I']

    q="SELECT * from territories WHERE lat < {} and lng < {} and  lat> {} and lng > {} and (".format(up,left,right,down)
    for l in landtype:
        q = q + " type like '{}' or".format(l)

    q = q[:-2] + ")"

    result = ExecuteQuery(state, q)

    return {'payload' : result}


@app.route('/api/lugar/<lugar>')
def get_land(lugar):
    #up down left right
    query = "SELECT * from territories WHERE name like '%{}%' ".format(lugar)
    placeinfo = ExecuteQuery(state,query)

    return {'payload' : placeinfo}



@app.route('/api/contamehistorias')
def contammehistoriasapi(params=None):
    '''
    params must include, q, siteSearch, from and to
    http://localhost:5000/contamehistorias?q=lisboa&siteSearch=https://www.publico.pt
    '''

    if params is None:
        params={}
        for k in request.args:
            print(k); 
            params[k]=request.args[k]
            
        
        params['siteSearch']=params['siteSearch'].split(',')

    print(params)

    if 'to' not in params:
        params['to']=datetime.datetime(year=2020, month=1, day=10)

    if 'from' not in params:
        params['from']= datetime.datetime(year=1996, month=1, day=1)
        
    apt =  ArquivoPT()
    search_result = apt.getResult(**params)
    cont = TemporalSummarizationEngine()
    intervals = cont.build_intervals(search_result, 'pt')
    #print(intervals['results'])
    
    serializedintervals = cont.serialize(intervals)

    #THIS DOES NOTHIN YOU CANT CHANGE STATES IN THREAD VARIABLES
    #state.chunks[params['q']]=1
    #state.isrunning=True
    serializedintervals['land']=params['land']
    #print('GOT RESUTLS FOR',params['q'],len(state.chunks) , file=sys.stderr)
    return serializedintervals

def Rewritelandstr(land):
    return True

def AddLandtoParam(params,land):
    #creates copy so that original stays the same
    par = params.copy()
    par['q']='"{}"'.format(land['name'])
    par['land']=land

    return par

#pools cant call other pools if they are daemonic
class NoDaemonProcess(multiprocessing.Process):
    # make 'daemon' attribute always return False
    def _get_daemon(self):
        return False
    def _set_daemon(self, value):
        pass
    daemon = property(_get_daemon, _set_daemon)

# We sub-class multiprocessing.pool.Pool instead of multiprocessing.Pool
# because the latter is only a wrapper function, not a proper class.
class MyPool(pool.Pool):
    Process = NoDaemonProcess


@app.route('/api/artigosstream')
def get_articlesstream(params=None):

    state.chunks=[]
    state.count=0

    #http://localhost:5000/artigosaqui?bounds=39.071611;-8.882339;38.604698;-9.691292
    if params is None:
        params={}
        for k in request.args:
            print(k); 
            params[k]=request.args[k]
    
    if 'siteSearch' not in params:
        params['siteSearch'] = domains

    up, left, right, down =params['bounds'].split(';')

    lands = get_landshere(up,right,left,down)

    print(lands, file=sys.stderr)
    print(len(lands), file=sys.stderr)

    if len(lands['payload'])<state.initiallandstoget:
        state.landstoget=len(lands['payload'])
    else:
         state.landstoget=state.initiallandstoget

    lands = random.sample(lands['payload'],state.landstoget)       
    
    lands = [land for land in lands if Rewritelandstr(land)]
    #return({'you':lands})
    
    #DOENST WORK CAUSE ITS REWRITING PARAMS B4 CLOSING
    paramlist = [AddLandtoParam(params,land) for land in lands] 

    def chunk_sequence(lands):

        
        #print('DUMPING CHUNK',file=sys.stderr)
        #print('DUMPING CHUNK',lands,file=sys.stderr)
        yield  json.dumps(lands) 
        print('DUMPING CHUNKED',file=sys.stderr)


        while state.count< state.landstoget or len(state.chunks)==0:
            print('CHUNKS',state.count,'/',state.landstoget, file=sys.stderr)
            if(len(state.chunks)>0):
                #print("CHUNKIN")
                #print(state.chunks)
                yield  json.dumps(state.chunks)
                state.chunks=[]
            #if results available  yield
            time.sleep(0.5)

        print('CLOSIGN',len(state.chunks), file=sys.stderr)
    def EndSignal(result):
        #set as running
        state.chunks.append(result)
        state.count=state.count+1
        #state.isrunning=False
        #print('FINISSHED, RESULTS ARE ', result , file=sys.stderr)
        #print('FINISSHED, RESULTS ARE ', state.chunks.append(1) , file=sys.stderr)
        #print('Finished All Processes')

    #run requests in parallel
    #set as running
    state.isrunning=True
    #state.chunks=[]
    multiprocessing.Pool()
    pool =  MyPool(processes=state.processesnumber)

    for x in range(0,state.landstoget):
        print(paramlist[x])
        pool.apply_async(
                contammehistoriasapi,args=(paramlist[x],),callback=EndSignal,error_callback=errorhandler)  
    pool.close()


    print('DUMPING READY',file=sys.stderr)

    #yield({'payload':results})
    return Response(chunk_sequence(lands), mimetype='text/plain')




@app.route('/api/artigosaqui')
def get_articleshere(params=None):

    state.chunks=[]
    state.count=0

    #http://localhost:5000/artigosaqui?bounds=39.071611;-8.882339;38.604698;-9.691292
    if params is None:
        params={}
        for k in request.args:
            print(k); 
            params[k]=request.args[k]
    
    if 'siteSearch' not in params:
        params['siteSearch'] = domains

    up, left, right, down =params['bounds'].split(';')

    lands = get_landshere(up,right,left,down)

    if len(lands['payload'])>30:
        pays = random.sample(lands['payload'],30)  
        lands['payload']=pays

    def myconverter(o):
        if isinstance(o, datetime.datetime):
            return o.__str__()
    
    def chunk_sequence(lands):
        
        #print('DUMPING CHUNK',file=sys.stderr)
        #print('DUMPING CHUNK',lands,file=sys.stderr)
        yield  json.dumps(lands) 
        print('DUMPING CHUNKED',file=sys.stderr)

        #print(lands,file=sys.stderr)
        for l in lands['payload']:

            res = ExecuteQuery(state,"SELECT headline,link,date FROM has_news m  CROSS JOIN news n ON n.newsID = news_id WHERE territories_id={} ORDER BY n.date ASC".format(l['id']))
       
            yield json.dumps({'payload':{'land_id':l['id'],'articles':res}},default=myconverter)

            #time.sleep(0.5)
   
    #yield({'payload':results})
    return Response(chunk_sequence(lands), mimetype='text/plain')


@app.route("/api/downloaddetails")
def getPlotCSV(params=None):

    #http://localhost:5000/artigosaqui?bounds=39.071611;-8.882339;38.604698;-9.691292
    if params is None:
        params={}
        for k in request.args:
            print(k); 
            params[k]=request.args[k]    

    up, left, right, down =params['bounds'].split(';')

    lands = get_landshere(up,right,left,down)

    ids=[]
    for l in lands['payload']:
        ids.append(l['id'])

    idsstr = str(ids)[1:]
    idsstr = idsstr[:-1]

    
    res = ExecuteQueryFetch(state,"SELECT * FROM has_news m  INNER JOIN news n ON n.newsID = news_id INNER JOIN territories t ON t.id =m.territories_id  WHERE t.id IN ({}) ORDER BY t.name, n.date ASC".format(idsstr),dicty=True)

    csvstr = "Nome do Concelho;Data;Manchete;Link\n"

    while True:
        row = res.fetchone()
        if row==None:
            break
        if row == None:
            break
        print(row['headline'])
        csvstr = csvstr +"{};{};{};https://arquivo.pt/wayback/{}\n".format(row['name'],row['date'],row['headline'],row['link'])
    
    return Response(
        csvstr.encode('utf-8-sig'),
        mimetype="text/csv",
        headers={"Content-disposition":
                 "attachment; filename=area_articles.csv"})

 

def errorhandler(exc):
    state.count=state.count+1 
    print("WHOOPSIE",state.count)
    print('Exception:', exc)


@app.route('/api/paginas')
def mainsearch(lands,
    fromm=datetime.datetime(year=1996, month=1, day=1),
    to=datetime.datetime(year=2020, month=1, day=10),
    domains=domains,q=None):

    params = { 'domains':domains, 
        'from':fromm, 
        'to': to}

    print("yyesss")
    for k in request.args:
        print(k);
        params[k]=request.args[k]

    print(params)
     
    

    #query = d 

    apt =  ArquivoPT()
    #search_result = apt.getResult(query=query, **params)

    
    #print(len(search_result))
    return "bro"

def ExecuteQuery(state,query,more=None,dicty=True):

    if state.con.open==False:
        state.con = pymysql.connect(credentials.server,credentials.user,credentials.pw, credentials.db)

        if dicty == True:
            state.cursor=state.con.cursor(pymysql.cursors.DictCursor)
        else:
            state.cursor=state.con.cursor(pymysql.cursors.Cursor)

    

    
    #print(state.con.open,file=sys.stderr)
    #print(cursor,file=sys.stderr)
    #print(state.con.cursor,file=sys.stderr)

    if more is not None:
        state.cursor.execute(query, more)
    else:
        state.cursor.execute(query)
                 
    state.con.commit()
    return state.cursor.fetchall()

def ExecuteQueryFetch(state,query,more=None,dicty=True):

    if state.con.open==False:
        state.con = pymysql.connect(credentials.server,credentials.user,credentials.pw, credentials.db)

    if dicty:
        state.cursor=state.con.cursor(pymysql.cursors.DictCursor)
    else:
        state.cursor=state.con.cursor(pymysql.cursors.Cursor)

    

    
    #print(state.con.open,file=sys.stderr)
    #print(cursor,file=sys.stderr)
    #print(state.con.cursor,file=sys.stderr)

    if more is not None:
        state.cursor.execute(query, more)
    else:
        state.cursor.execute(query)
                    
    state.con.commit()
    return state.cursor
    


@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def catch_all(path):
    print("YEESS")
    return app.send_static_file('index.html')
