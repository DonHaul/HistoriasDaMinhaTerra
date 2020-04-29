from contamehistorias.datasources.webarchive import ArquivoPT
from datetime import datetime

# Specify website and time frame to restrict your query
domains = [ 'http://publico.pt/']

params = { 'domains':domains, 
        'from':datetime(year=2018, month=1, day=1), 
        'to':datetime(year=2018, month=1, day=10) }

query = 'Dilma Rousseff'

apt =  ArquivoPT()
search_result = apt.getResult(query=query, **params)