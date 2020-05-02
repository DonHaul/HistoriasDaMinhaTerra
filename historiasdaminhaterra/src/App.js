import React from 'react';
import './App.css';
import { Switch, Route, BrowserRouter } from "react-router-dom"; // Redirect was also being fetched

import Page_api from './components/Page_api'
import Page_contacto from './components/Page_contacto'
import Page_main from './components/Page_main'
import Page_sobre from './components/Page_sobre'

import { AppContext } from "./components/state"
import { useImmerReducer } from "use-immer";

import Header from "./components/Header"

//context + reducer based on https://medium.com/datadriveninvestor/usereducer-hook-in-reactjs-1225aecd7d43

// Set up Initial State
const initialState = {

  bounds: [39.071611, -8.882339, 38.604698, -9.691292],
  lands: [],
  dates: [1996, 2020],
  /*
  lands: [{
    name: 'Torres Vedras',
    lat: '39.071611',
    lng: '-8.882339',
    news: [{ name: 'tv1', date: '12-12-12', url: 'https://www.facebook.com' }, { name: 'tv2', date: '12-12-12', url: 'https://www.w3schools.com/css/css_positioning.asp' }, { name: 'tv3', date: '12-12-12', url: 'https://www.w3schools.com/css/css_positioning.asp' }]
  },
  {
    name: 'Sobral',
    lat: '38.604698',
    lng: '-9.691292',
    news: [{ name: 'newsobral', date: '12-12-12', url: 'https://www.w3schools.com/css/css_positioning.asp' }, { name: 'sobralnews2', date: '12-12-12', url: 'https://www.w3schools.com/css/css_positioning.asp' }, { name: 'sobrnews3', date: '12-12-12', url: 'https://www.w3schools.com/css/css_positioning.asp' }]
  }],*/
  selectedLand: -1,
  selectedStory: -1,
  stories: []

};

//it returns the new state
function reducer(draft, action) {
  const { payload } = action
  switch (action.type) {
    case 'BOUNDS_CHANGED':


      draft.bounds = payload;

      //console.log(draft.bounds);
      return draft;

    case 'SEE_LAND_NEWS':
      console.log("CHANGED LAND");

      draft.selectedLand = payload;


      return draft;
    case 'SWITCH_STORY':
      draft.selectedStory = payload
      return draft;
    case 'RECEIVED_LANDS':
      console.log("NEW LANDS COMING IN");


      draft.lands = payload.payload

      //console.log(draft.lands);
      return draft;

    case 'LOAD_STORIES':
      //console.log("NEW STORIES COMING IN");
      //console.log("stories");

      const found_land_id = draft.lands.findIndex(element => element.id === payload.payload.land_id);

      draft.lands[found_land_id].news = payload.payload.articles
      return draft;

    case 'CHANGE_DATE':
      //slice makes clone on incoming array
      draft.dates = action.payload.slice();


    //draft.dates = payload;




    default:
      return draft;
  }
}

function App() {

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  return (

    <BrowserRouter>

      <div className="App">
        <div className="MainApp">
          <Header />
          <AppContext.Provider value={{ state, dispatch }}>
            <Switch>
              <Route path="/" component={Page_main} exact />
              <Route path="/contato" component={Page_contacto} />
              <Route path="/endpoints" component={Page_api} />
              <Route path="/sobre" component={Page_sobre} />
            </Switch>
          </AppContext.Provider>
        </div >
      </div>
    </BrowserRouter>
  )
}



export default App;
