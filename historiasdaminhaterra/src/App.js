import React, { useState, useEffect, useReducer, } from 'react';
import './App.css';
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom"; // Redirect was also being fetched

import Page_api from './components/Page_api'
import Page_contacto from './components/Page_contacto'
import Page_main from './components/Page_main'
import Page_sobre from './components/Page_sobre'

import { AppContext } from "./components/state"
import { useImmerReducer } from "use-immer";

import Header from "./components/Header"

const fs = require('fs')
const path = require('path')
const axios = require('axios')

//context + reducer based on https://medium.com/datadriveninvestor/usereducer-hook-in-reactjs-1225aecd7d43

// Set up Initial State
const initialState = {

  bounds: '',
  lands: [{
    name: 'Torres Vedras',
    lat: '39.071611',
    lng: '-8.882339',
    news: [{ name: 'tv1', date: '12-12-12', url: 'https://www.google.com' }, { name: 'tv2', date: '12-12-12', url: 'https://www.w3schools.com/css/css_positioning.asp' }, { name: 'tv3', date: '12-12-12', url: 'https://www.w3schools.com/css/css_positioning.asp' }]
  },
  {
    name: 'Sobral',
    lat: '38.604698',
    lng: '-9.691292',
    news: [{ name: 'newsobral', date: '12-12-12', url: 'https://www.w3schools.com/css/css_positioning.asp' }, { name: 'sobralnews2', date: '12-12-12', url: 'https://www.w3schools.com/css/css_positioning.asp' }, { name: 'sobrnews3', date: '12-12-12', url: 'https://www.w3schools.com/css/css_positioning.asp' }]
  }],
  selectedLand: 0,
  selectedStory: 0

};

//it returns the new state
function reducer(draft, action) {
  const { payload } = action
  switch (action.type) {
    case 'BOUNDS_CHANGED':
      console.log(payload);
      draft.bounds = payload;
      return draft;

    case 'SEE_LAND_NEWS':
      console.log("CHANGED LAND");

      draft.selectedLand = payload;
      return draft;
    case 'SWITCH_STORY':
      draft.selectedStory = payload
      return draft


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
