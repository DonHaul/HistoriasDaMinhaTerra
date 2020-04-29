const fs = require('fs')
const path = require('path')
const axios = require('axios')

async function download() {
    const url = 'http://localhost:5000/artigosaqui?bounds=39.071611;-8.882339;38.604698;-9.691292'

    axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    }).then(
        response => {
            response.data.on('end', () => {
                console.log("NO MORE DATA")
            });
            response.data.on('error', error => {
                reject(error);
            });
            response.data.on('data', data => {
                console.log(data.toString());


            });

        });



}

download()