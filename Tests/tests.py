from TemporalSummarizationFramework.contamehistorias.datasources.webarchive import ArquivoPT
from TemporalSummarizationFramework.contamehistorias.engine import TemporalSummarizationEngine
from datetime import datetime
from urllib.parse import urlparse
import requests
from TemporalSummarizationFramework.contamehistorias.datasources.utils import *

def main():
            
        # Specify website and time frame to restrict your query
        domains = [ 'http://publico.pt/', 'http://www.rtp.pt/',
                'http://www.dn.pt/']

        params = { 'domains':domains, 
                'from':datetime(year=2016, month=3, day=1), 
                'to':datetime(year=2018, month=1, day=10) }

        query = 'braga'

        apt =  ArquivoPT()
        search_result = getResultsByDomain(query=query, **params)

        print(search_result)




def getResultsByDomain(  query, **kwargs):

        domains=kwargs['domains']

        max_items_per_site=500
        docs_per_query=1000

        itemsPerSite = min( max_items_per_site , int(2000/len(domains)))

        

        siteSearch = ','.join([urlparse(d).netloc for d in domains])


        interval = ( kwargs['from'].strftime(ArquivoPT.DATETIME_FORMAT), kwargs['to'].strftime(ArquivoPT.DATETIME_FORMAT) )

        params = {
                'q':query,
                'from':interval[0],
                'to':interval[1],
                'siteSearch':siteSearch,
                'maxItems':docs_per_query,
                'itemsPerSite':itemsPerSite,
                'type':'html',
                'fields': 'originalURL,title,tstamp,encoding,linkToArchive'
        }

        print(params)

        #try:
        response = requests.get(ArquivoPT.URL_REQUEST, params=params, timeout=45)
                
        #except:
        #        print('Timeout domains =', domains)
        #        return
        print("HAAAAAAAAAAAAAAAAA")
        print(response.url)
        if response.status_code != 200:
                return

        json_obj = response.json()
       
     
                
        return json_obj


if __name__ == "__main__":
        main()