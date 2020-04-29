from flask import Flask,request,Response
import time
import sys
import json 


app = Flask(__name__)

domains = ['http://www.publico.pt/']
#[, 'http://www.dn.pt/', 'http://www.rtp.pt/', 'http://www.cmjornal.xl.pt/', 'http://www.iol.pt/', 'http://www.tvi24.iol.pt/', 'http://noticias.sapo.pt/', 'http://expresso.sapo.pt/', 'http://sol.sapo.pt/', 'http://www.jornaldenegocios.pt/', 'http://abola.pt/', 'http://www.jn.pt/', 'http://sicnoticias.sapo.pt/', 'http://www.lux.iol.pt/', 'http://www.ionline.pt/', 'http://news.google.pt/', 'http://www.dinheirovivo.pt/', 'http://www.aeiou.pt/', 'http://www.tsf.pt/', 'http://meiosepublicidade.pt/', 'http://www.sabado.pt/', 'http://dnoticias.pt/', 'http://economico.sapo.pt/' ]


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
        self.landstoget=20
        self.count=0

state = State()



@app.route('/time')
def get_time():
    return {'time': time.time()}


@app.route('/lugares/<up>/<right>/<left>/<down>/<landtype>')
@app.route('/lugares/<up>/<right>/<left>/<down>')
def get_landshere(up,right,left,down,landtype=None):

    if landtype==None:
        landtype=['A','C','D','I']

    q="SELECT * from territories WHERE lat < {} and lng < {} and  lat> {} and lng > {} and (".format(up,left,right,down)
    for l in landtype:
        q = q + " type like '{}' or".format(l)

    q = q[:-2] + ")"

    result = ExecuteQuery(state.con, q)

    return {'payload' : result}


@app.route('/lugar/<lugar>')
def get_land(lugar):
    #up down left right
    query = "SELECT * from territories WHERE name like '%{}%' ".format(lugar)
    placeinfo = ExecuteQuery(state.con,query)

    return {'payload' : placeinfo}



@app.route('/contamehistorias')
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


@app.route('/artigosaqui')
def get_articleshere(params=None):

    state.chunks=[]

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
    
    lands = random.sample(lands['payload'],state.landstoget)       
    
    lands = [land for land in lands if Rewritelandstr(land)]
    #return({'you':lands})
    
    #DOENST WORK CAUSE ITS REWRITING PARAMS B4 CLOSING
    paramlist = [AddLandtoParam(params,land) for land in lands] 

    def chunk_sequence():
        while state.count< state.landstoget or len(state.chunks)==0:
            print('CHUNKS',state.count,'/',state.landstoget, file=sys.stderr)
            if(len(state.chunks)>0):

                yield json.dumps(state.chunks) 
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



    #yield({'payload':results})
    return Response(chunk_sequence(), mimetype='text/plain')






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


@app.route('/paginas')
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

def ExecuteQuery(con,query,more=None):
                 
    cursor = con.cursor(pymysql.cursors.DictCursor)
    print(con.open,file=sys.stderr)
    print(cursor,file=sys.stderr)
    print(con.cursor,file=sys.stderr)

    if more is not None:
        cursor.execute(query, more)
    else:
        cursor.execute(query)
                 
    con.commit()
    return cursor.fetchall()
    