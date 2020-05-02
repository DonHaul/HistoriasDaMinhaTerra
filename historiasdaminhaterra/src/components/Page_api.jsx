
import React, { useEffect } from 'react';



function Page_api() {
    // useEffect Hook
    useEffect(() => {
        const url = "http://localhost:5000/api/stream";
        //http://localhost:5000/stream
        const consume = responseReader => {
            return responseReader.read().then(result => {
                if (result.done) {
                    return;
                }

                console.log("Received Chunk");

                return consume(responseReader);
            });
        };

        // Perform the request and consume response stream
        fetch(url)
            .then(response => {
                return consume(response.body.getReader());
            })
            .catch(console.log.bind(console));
    });
    return (
        <div>
            <p>API Testing Page</p>
        </div>
    );
}


export default Page_api



