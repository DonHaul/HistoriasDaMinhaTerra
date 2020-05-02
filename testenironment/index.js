const fs = require('fs')
const path = require('path')
const axios = require('axios')
const fetch = require("node-fetch");

async function download() {


    //const url = 'http://localhost:5000/artigosaqui?bounds=39.071611;-8.882339;38.604698;-9.691292'

    // Step 1: start the fetch and obtain a reader
    let response = await fetch('https://histmyterra.herokuapp.com/api/stream');

    const reader = response.body.getReader();

    // Step 2: get total length
    const contentLength = +response.headers.get('Content-Length');

    // Step 3: read the data
    let receivedLength = 0; // received that many bytes at the moment
    let chunks = []; // array of received binary chunks (comprises the body)
    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
        receivedLength += value.length;

        console.log(`Received ${receivedLength} of ${contentLength}`)
    }

    console.log(`Received ${value.length} bytes`)

    /*
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
    
            });*/

}

download()