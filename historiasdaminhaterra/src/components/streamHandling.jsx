
function bin2String(uintArray) {
    //var encodedString = String.fromCharCode.apply(null, uintArray),
    //    decodedString = decodeURIComponent(escape(encodedString));
    return new TextDecoder("utf-8").decode(uintArray);
}

//https://stackoverflow.com/questions/60044205/download-response-data-as-stream-w-axios-in-react-app
//https://github.com/axios/axios/issues/2159
//https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
async function downloadAndUpdate(url, context) {

    let cumString = "";


    fetch(url).then(function (response) {
        var reader = response.body.getReader();
        var bytesReceived = 0;
        var first = true;

        console.log("ENTERED");

        reader.read().then(function processResult(result) {
            if (result.done) {
                console.log("Fetch complete");
                return;
            }

            let str = bin2String(result.value)

            console.log(str);


            if (first === true) {

                let payload = JSON.parse(str);
                console.log("STILL FIRST");


                let markers = []
                /*
                for (var i = 0; i < draft.markers.length; i++) {
                    draft.markers[i].setMap(null);
                    draft.markers[i] = null;
                }
                draft.markers = []*/

                for (var i = 0; i < payload.payload.length; i++) {
                    let marker = createMarker(payload.payload[i].lat, payload.payload[i].lng, context.state, payload.payload[i].name, i);

                    marker.addListener('click', function () {
                        console.log("id is");
                        console.log(this);
                        context.dispatch({ type: 'SEE_LAND_NEWS', payload: this.id })
                        window.scrollTo(0, 550);
                    });

                    markers.push(marker);
                    console.log("CREATE MARKER");
                }



                context.dispatch({ type: 'RECEIVED_LANDS', payload: { lands: payload, markers: markers } });
                first = false;
            } else {

                cumString += str;


                console.log("FETCHING SOTRUES");

                let idx = cumString.indexOf('{"payload', 0);
                console.log(idx);


                let first2 = 0
                while (idx !== -1) {

                    console.log("LOOP");
                    console.log(idx);



                    if (idx !== 0) {


                        console.log("WHOOP");

                        console.log(cumString[first2])

                        console.log(cumString[idx])
                        try {
                            let a = JSON.parse(cumString.substr(first2, idx));
                            context.dispatch({ type: 'LOAD_STORIES', payload: JSON.parse(a) });
                            cumString = "";
                        } catch (e) {
                            console.log(cumString);
                            //alert(e); // error in the above string (in this case, yes)!
                        }


                        console.log(str.substr(first2, idx));
                    }


                    first2 = idx
                    idx = str.indexOf('{"payload', idx + 1);

                }
                console.log("FIRST2 is");

                console.log(first2);

                try {
                    let a = JSON.parse(cumString.substr(first2, cumString.length));
                    context.dispatch({ type: 'LOAD_STORIES', payload: a });
                    cumString = "";
                } catch (e) {
                    console.log(cumString);
                    //alert(e); // error in the above string (in this case, yes)!
                }




            }
            bytesReceived += result.value.length;
            //console.log(`Received ${bytesReceived} bytes of data so far`);

            return reader.read().then(processResult);
        });

    });


    const createMarker = (latitutde, longitude, state, title, id) => {

        return new window.google.maps.Marker({
            position: { lat: latitutde, lng: longitude },
            map: state.map.current,
            title: title,
            id: id
        });
    }



}


export default downloadAndUpdate