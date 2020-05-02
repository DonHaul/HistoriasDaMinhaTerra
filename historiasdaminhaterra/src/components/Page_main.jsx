import React, { useRef, useContext, useEffect } from 'react';


import downloadAndUpdate from "./streamHandling"
import { AppContext } from "./state"
import GoogleMaps from './GoogleMaps'

import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/core';


const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop - 53)
const MySlider = withStyles({
    root: {
        color: '#3c82ea'

    }
})(Slider);

function Page_main() {

    const myRef = useRef(null)
    const myRef2 = useRef(null)

    const context = useContext(AppContext);

    let state = context.state;


    // useEffect Hook
    useEffect(() => {

        //ShowDate("2019-05-22 16:49:24");

        FetchSomeLands()

    }, []);

    function appendLeadingZeroes(n) {
        if (n <= 9) {
            return "0" + n;
        }
        return n
    }

    const displayStory = (item, id) => {

        console.log(new Date(item.date));

        let b4 = new Date(state.dates[0], 0, 1, 0, 0, 0, 0);
        let af = new Date(state.dates[1], 11, 21, 23, 59, 59, 0);




        if (new Date(item.date) > b4 && new Date(item.date) < af) {
            return (<div className={id == state.selectedStory ? 'landselected story row' : 'story row'} key={id}>

                <div className='col-2'>  <p className="date">{ShowDate(item.date)}</p></div>
                <div className='col-10' className="headline animated fadeInUp" onClick={() => {
                    context.dispatch({ type: 'SWITCH_STORY', payload: id });
                    scrollToRef(myRef);

                }
                } style={{ textAlign: "left" }}> <div >{item.headline}</div></div>
            </div>)
        }


        else {
            return null;
        }
    }

    function ShowDate(date) {

        let current_datetime = new Date(date)
        console.log(current_datetime.toString());
        let formatted_date = appendLeadingZeroes(current_datetime.getDate()) + "/" + appendLeadingZeroes(current_datetime.getMonth() + 1) + "/" + current_datetime.getFullYear()
        return formatted_date

    }

    /*const handleChange = (event, newValue) => {
        context.dispatch({ type: 'CHANGE_DATE', payload: newValue });
    };*/


    function ChangeStory(val) {

        let b4 = new Date(state.dates[0], 0, 1, 0, 0, 0, 0);
        let af = new Date(state.dates[1], 11, 21, 23, 59, 59, 0);

        let newid = state.selectedStory + val
        if (newid > state.lands[state.selectedLand].news.length - 1) {
            newid = state.lands[state.selectedLand].news.length - 1;
        } else if (newid < 0) {
            newid = 0
        }

        let newdate = new Date(state.lands[state.selectedLand].news[newid].date)
        if (newdate > b4 && newdate < af) {
            context.dispatch({ type: 'SWITCH_STORY', payload: newid });
        }




    }


    const handleChange = (event, newValue) => {
        //console.log(newValue);

        context.dispatch({ type: 'CHANGE_DATE', payload: newValue });
        //setValue(newValue);
    };

    const changesDatesButtons = (change) => {


        let arr = state.dates.slice();
        arr[0] = arr[0] + change;
        arr[1] = arr[1] + change;
        if (arr[0] < 1996) arr[0] = 1996;
        if (arr[1] > 2020) arr[1] = 2020;
        if (arr[1] < 1996) arr[0] = 1996;
        if (arr[0] > 2020) arr[1] = 2020;


        context.dispatch({ type: 'CHANGE_DATE', payload: arr });
    }




    return (
        <React.Fragment>

            <div className="container">


            </div>
            <div id='map'>
                <GoogleMaps />

                <button type="button" onClick={() => FetchSomeLands()} className="btn btn-primary gradient maplook">Procurar Notícias nesta região</button>
            </div>
            <div ref={myRef2} className="container newscont" >
                <h3>Histórias encontradas nesta zona</h3>
                <div className="row">
                    <div className='col-3'>
                        <h5 style={{ textAlign: "left" }} className="animated fadeInUp">Datas</h5>
                        <br /><br />
                        <div className="row">
                            <div className="col-8">
                                <MySlider
                                    defaultValue={[1996, 2020]}
                                    value={state.dates.slice()}
                                    min={1996}
                                    step={1}
                                    onChange={handleChange}
                                    max={2020}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                    valueLabelDisplay="on"
                                />
                            </div>
                            <div className="col-3"><div class="btn-group datebtns" role="group" aria-label="Basic example">
                                <button type="button" onClick={() => changesDatesButtons(-1)} class="btn btn-primary"><i class="material-icons">chevron_left</i></button>
                                <button type="button" onClick={() => changesDatesButtons(1)} class="btn btn-primary"><i class="material-icons">chevron_right</i></button>
                            </div></div>
                        </div>



                        <h5 style={{ textAlign: "left" }} className="animated fadeInUp">Terras</h5>

                        <div className='Lands'>
                            {state.lands.length == 0 && <p style={{ textAlign: "left", opacity: 0.4 }}>Procure Numa Região para ver terras</p>}
                            {state.lands.map((item, id) => {

                                return (<div className={id == state.selectedLand ? 'landselected land' : 'land'} key={id} onClick={() => { context.dispatch({ type: 'SEE_LAND_NEWS', payload: id }) }
                                }> <p style={{ textAlign: "left" }} className="animated fadeInUp">{item.name}</p></div>)
                            })}

                        </div>

                    </div>
                    <div className="col-9">

                        <div className="row">
                            <div className='col-2'></div>
                            <div className='col-10'>
                                <h5>Histórias</h5></div>
                        </div>
                        <div className="histcontainer">
                            {state.selectedLand != -1 && state.lands[state.selectedLand].news !== undefined && state.lands[state.selectedLand].news.map((item, id) => { return displayStory(item, id) })}
                        </div>
                    </div>

                    <div className="col-6"></div>

                </div>

            </div>
            <br />
            <br />
            <br />
            <div ref={myRef} className="exsitediv extSite">

                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            <h5>História Escolhida</h5>
                        </div><div className="col-2">
                        </div>
                        {state.selectedLand != -1 && state.selectedStory != -1 && state.lands[state.selectedLand].news !== undefined &&
                            <div className="col-6">
                                <div class="btn-group mr-2" role="group" aria-label="Basic example">

                                    <button type="button" onClick={() => ChangeStory(-1)} class="btn btn-primary"><i className="fas fa-chevron-left"></i> Anterior</button>
                                    <button type="button" onClick={() => ChangeStory(1)} class="btn btn-primary">Próxima <i className="fas fa-chevron-right"></i></button>
                                </div>

                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <a className="btn btn-primary mr-2" target="_blank" href={`https://arquivo.pt/wayback/${state.lands[state.selectedLand].news[state.selectedStory].link}`}>Abrir no arquivo.pt <i class="fas fa-globe"></i></a>
                                </div>

                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <button onClick={() => scrollToRef(myRef2)} className="btn btn-primary">Procurar outra <i class="fas fa-chevron-up"></i></button>
                                </div>
                            </div>}
                    </div>
                </div>
                <br />
                <div className="iframedivv">
                    {(state.selectedLand == -1 || state.selectedStory == -1) &&
                        <div className="big"><p>Selecione Uma História</p></div>}
                    {state.selectedLand != -1 && state.selectedStory != -1 && state.lands[state.selectedLand].news !== undefined &&
                        <div className="iframecontainer">


                            <iframe className="" scrolling="yes" src={`https://arquivo.pt/noFrame/replay/${state.lands[state.selectedLand].news[state.selectedStory].link}`}></iframe>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment >

    );

    function FetchSomeLands() {
        let boundstr = state.bounds.join(';')

        console.log(boundstr);

        let url = 'http://localhost:5000/api/artigosaqui?bounds=' + boundstr
        console.log(url);


        downloadAndUpdate(url, context)

    }





}
export default Page_main