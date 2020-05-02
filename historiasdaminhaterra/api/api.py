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
@app.route('/api/lugares/<up>/<right>/<left>/<down>')
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


    #if len(lands['payload'])<state.initiallandstoget:
    #    state.landstoget=len(lands['payload'])
    #else:
    #     state.landstoget=state.initiallandstoget
    #lands = random.sample(lands['payload'],state.landstoget)       
    
    #lands = [land for land in lands if Rewritelandstr(land)]
    
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
   
    #yield({'payload':results})
    return Response(chunk_sequence(lands), mimetype='text/plain')


@app.route('/api/stream')
def get_stream(params=None):
 
    print('CALLED STREAM',file=sys.stderr)
    def chunk_sequence2():
        count = 0
        while count<100:
            print(count,file=sys.stderr)
            yield "[{'id': 1405, 'name': 'Loures', 'type': 'C', 'parent_id': -1, 'lat': 38.833333, 'lng': -9.166667}, {'id': 1787, 'name': 'Montijo', 'type': 'C', 'parent_id': -1, 'lat': 38.683333, 'lng': -8.9}, {'id': 82, 'name': 'Alcochete', 'type': 'C', 'parent_id': -1, 'lat': 38.75, 'lng': -8.966667}, {'id': 1874, 'name': 'Odivelas', 'type': 'C', 'parent_id': -1, 'lat': 38.8, 'lng': -9.183333}, {'id': 361, 'name': 'Arruda dos Vinhos', 'type': 'C', 'parent_id': -1, 'lat': 38.983333, 'lng': -9.083333}, {'id': 2601, 'name': 'Seixal', 'type': 'C', 'parent_id': -1, 'lat': 38.65, 'lng': -9.1}, {'id': 137, 'name': 'Almada','type': 'C', 'parent_id': -1, 'lat': 38.666667, 'lng': -9.15}, {'id': 467, 'name': 'Barreiro', 'type': 'C', 'parent_id': -1, 'lat': 38.666667, 'lng': -9.1}, {'id': 2661, 'name': 'Sintra', 'type': 'C', 'parent_id': -1, 'lat': 38.783333, 'lng': -9.416667}, {'id': 90, 'name': 'Alenquer', 'type': 'C', 'parent_id': -1, 'lat': 39.056111, 'lng': -9.008056}, {'id': 2673, 'name': 'Sobral de Monte Agra�o', 'type': 'C', 'parent_id': -1, 'lat': 39.019722, 'lng': -9.148889}, {'id': 710, 'name': 'Cascais', 'type': 'C', 'parent_id': -1, 'lat': 38.683333, 'lng': -9.416667}, {'id': 1698, 'name': 'Moita', 'type': 'C', 'parent_id': -1, 'lat': 38.65, 'lng': -9.0}, {'id': 3010, 'name': 'Vila Franca de Xira', 'type': 'C', 'parent_id': -1, 'lat': 38.95, 'lng': -8.983333}, {'id': 1493, 'name': 'Mafra', 'type': 'C', 'parent_id': -1, 'lat': 38.933333, 'lng': -9.333333}, {'id': 182, 'name': 'Amadora', 'type': 'C', 'parent_id': -1, 'lat': 38.75, 'lng': -9.233333}, {'id': 1878, 'name': 'Oeiras', 'type': 'C', 'parent_id': -1, 'lat': 38.695833, 'lng': -9.309167}, {'id': 1370, 'name': 'Lisboa', 'type': 'D', 'parent_id': -1, 'lat': 38.716667, 'lng': -9.133333}]\n"
            
            time.sleep(.1)
            count=count+1        
    return Response(chunk_sequence2(), mimetype='text/plain')






def generate():
    yield 'Hello '
    time.sleep(1)
    yield 'Hello '
    time.sleep(1) 
    yield 'Hello '
    time.sleep(1)
    yield 'Hello '
    time.sleep(1)
 

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

def ExecuteQuery(state,query,more=None):

    if state.con.open==False:
        state.con = pymysql.connect(credentials.server,credentials.user,credentials.pw, credentials.db)

        state.cursor=state.con.cursor(pymysql.cursors.DictCursor)

    

    
    #print(state.con.open,file=sys.stderr)
    #print(cursor,file=sys.stderr)
    #print(state.con.cursor,file=sys.stderr)

    if more is not None:
        state.cursor.execute(query, more)
    else:
        state.cursor.execute(query)
                 
    state.con.commit()
    return state.cursor.fetchall()
    


@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def catch_all(path):
    print("YEESS")
    return app.send_static_file('index.html')
