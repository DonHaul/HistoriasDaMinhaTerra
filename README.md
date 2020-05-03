# HistoriasDaMinhaTerra
O Histórias da miha terra é uma aplicação web que permite a qualquer um, pesquizar notícias preservadas de todo o Portugal de uma forma rápida e interativa.

O https://www.historiasdaminhaterra.pt/


## API pública
De momento existem 2 endpoints ativos:

### 1 Busca de concelhos numa região:

`http://historiasdaminhaterra.pt/api/api/lugares/<up>/<right>/<left>/<down>`
- up: limite de latitude a norte;
- rigth: limite de longitude a este;
- dows: limite de latitude a sul;
- rigth: limite de longitude a oeste;

Os valores de latitudes e longitudes apresentam-se em Decimal Degres.

Exemplo: `http://historiasdaminhaterra.pt/api/lugares/39.071611/-8.882339/38.604698/-9.691292`
Devolve: 
```
{
  "payload": [
    {
      "id": 38, 
      "lat": 38.7, 
      "lng": -7.4, 
      "name": "Alandroal", 
      "parent_id": -1, 
      "type": "C"
    }, 
    {
      "id": 50, 
      "lat": 37.083333, 
      "lng": -8.25, 
      "name": "Albufeira", 
      "parent_id": -1, 
      "type": "C"
    }, 
    {
      "id": 55, 
      "lat": 38.366667, 
      "lng": -8.5, 
      "name": "Alc\u00e1cer do Sal", 
      "parent_id": -1, 
      "type": "C"
    }, ...
```

### 1 Busca de artigos numa região numa região:

`http://historiasdaminhaterra.pt/api/artigosaqui?bounds=up;right;down;left`
- up: limite de latitude a norte;
- rigth: limite de longitude a este;
- dows: limite de latitude a sul;
- rigth: limite de longitude a oeste;

Os valores de latitudes e longitudes apresentam-se em Decimal Degres.

Exemplo: `http://historiasdaminhaterra.pt/api/artigosaqui?bounds=39.071611;-8.882339;38.604698;-9.691292`
Devolve: `todas os concelhos e artigos da regiao`

