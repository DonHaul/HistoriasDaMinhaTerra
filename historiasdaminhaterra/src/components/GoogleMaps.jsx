import React, { useEffect, useRef, useContext } from 'react';
import { AppContext } from "../components/state"


// Variables
const GOOGLE_MAP_API_KEY = 'AIzaSyAGpEsuzCwWOMF0hoMJTrD6r0YE5yUb8ds';
const myLocation = { // CN Tower Landmark

  //lat: 39.958648,
  //lng: -12.662424,
  lat: 38.736211,
  lng: -9.123981
};
// styles
const mapStyles = {
  width: '100%',
  height: '550px',
};

function GoogleMaps(props) {

  const { dispatch } = useContext(AppContext)
  // refs
  const googleMapRef = React.createRef();
  const googleMap = useRef(null);
  let marker = null;// = useRef(null);
  const firstUpdate = useRef(0);


  // useEffect Hook
  useEffect(() => {
    //console.log("state");
    //console.log(firstUpdate.current)

    firstUpdate.current++;
    if (firstUpdate.current !== 1) {


      return;


    }


    //console.log("go");
    //console.log(googleMapRef);



    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}`
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', () => {
      console.log("Script loaded twice");

      googleMap.current = createGoogleMap();
      //marker = createMarker(39.071611, -8.882339)


      dispatch({ type: 'GET_MAP', payload: googleMap });


    })



    // helper functions
    const createGoogleMap = () => {
      console.log("lol");
      console.log(googleMapRef.current);
      var map = new window.google.maps.Map(googleMapRef.current, {
        zoom: 10,
        center: {
          lat: myLocation.lat,
          lng: myLocation.lng
        },
        options: {
          gestureHandling: 'cooperative'
        },
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,

      });
      console.log("MAPPY BOY");

      console.log(map);
      //after load, set up listeners

      window.google.maps.event.addListener(map, 'bounds_changed', function () {
        //console.log(map.getBounds());
        const bounds = map.getBounds()
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        /*console.log(ne.lat());
        console.log(ne.lng());
        console.log(sw.lat());
        console.log(sw.lng());*/
        const viewportPoints = [ne.lat(), ne.lng(), sw.lat(), sw.lng()]
        dispatch({ type: 'BOUNDS_CHANGED', payload: viewportPoints });
        //this part runs when the mapobject shown for the first time
      });

      window.google.maps.event.addListener(map, 'zoom_changed', function () {
        //console.log(map.getBounds());
        //marker.setMap(null);
        console.log("zoomie")
        //this part runs when the mapobject shown for the first time
      });


      return map
    }






  }, [googleMapRef])

  const createMarker = (latitutde, longitude) => {

    return new window.google.maps.Marker({
      position: { lat: latitutde, lng: longitude },
      map: googleMap.current
    });
  }







  return (
    <React.Fragment>
      < div
        id="google-map"
        ref={googleMapRef}
        style={mapStyles}
      /></React.Fragment>
  )



}



export default GoogleMaps