
function bin2String(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
}

//https://stackoverflow.com/questions/60044205/download-response-data-as-stream-w-axios-in-react-app
//https://github.com/axios/axios/issues/2159
//https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
async function downloadAndUpdate(url, context) {



    fetch(url).then(function (response) {
        var reader = response.body.getReader();
        var bytesReceived = 0;

        reader.read().then(function processResult(result) {
            if (result.done) {
                console.log("Fetch complete");
                return;
            }
            let str = bin2String(result.value)
            //console.log(str);


            if (bytesReceived === 0) {
                context.dispatch({ type: 'RECEIVED_LANDS', payload: JSON.parse(str) });
            } else {

                context.dispatch({ type: 'LOAD_STORIES', payload: JSON.parse(str) });
            }
            bytesReceived += result.value.length;
            //console.log(`Received ${bytesReceived} bytes of data so far`);

            return reader.read().then(processResult);
        });

    });





}


export default downloadAndUpdate