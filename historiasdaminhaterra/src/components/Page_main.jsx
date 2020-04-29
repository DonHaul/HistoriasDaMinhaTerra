import React, { useState, useEffect, useRef, useContext } from 'react';



import { AppContext } from "./state"
import GoogleMaps from './GoogleMaps'

const fs = require('fs')
const path = require('path')
const axios = require('axios')

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

function Page_main() {

    const myRef = useRef(null)
    const executeScroll = () => scrollToRef(myRef)

    const context = useContext(AppContext);

    const [currentTime, setCurrentTime] = useState(0);

    let state = context.state;


    //used to update state
    useEffect(() => {
        console.log("Ocurred");

        fetch('/time').then(res => {
            console.log(res);
            console.log("RES IS");


            return res.json()
        }).then(data => {
            console.log("DATA IS");

            console.log(data);

            setCurrentTime(data.time);
        });

    }, []);


    return (
        <React.Fragment>
            <div id="map"></div>
            {/*<GoogleMaps />*/}

            <button type="button" className="btn btn-primary gradient maplook">Procurar Notícias nesta região</button>
            <div className="container newscont" >
                <h4>Histórias encontradas nesta zona</h4>
                <div className="row">
                    <div className='col-4'>
                        <h5>Terras</h5>

                        <div className='Lands'>
                            {state.lands.map((item, id) => {
                                console.log("yp")
                                return (<div className='land' onClick={() => { context.dispatch({ type: 'SEE_LAND_NEWS', payload: id }) }
                                }> <p>{item.name}</p></div>)
                            })}

                        </div>

                    </div>
                    <div className="col-8">
                        <h5>Histórias</h5>
                        {state.lands[state.selectedLand].news.map((item, id) => {
                            console.log("yp")
                            return (<div className='land row' onClick={() => {
                                context.dispatch({ type: 'SWITCH_STORY', payload: id });
                                scrollToRef(myRef);

                            }
                            }> <div className='col-3'> <p>{item.date}</p></div>
                                <div className='col-5'> <div >{item.name}</div></div>
                            </div>)



                        })}

                    </div>

                    <div className="col-6"></div>

                </div>

            </div>
            <div>
                <h5>História Escolhida</h5>
                <div className="exsitediv" ref={myRef}>
                    <a className="secret" href={state.lands[state.selectedLand].news[state.selectedStory].url} target="_blank"></a>
                    <iframe className="extSite" scrolling="no" src={state.lands[state.selectedLand].news[state.selectedStory].url}></iframe></div>


            </div>
        </React.Fragment >

    );

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
                    console.log("Exit")
                });
                response.data.on('data', data => {
                    console.log(data.toString());


                });

            });



    }
}

export default Page_main