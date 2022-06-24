import config from '../../app.config';
import { LocalStorageService } from './Service/LocalStorageService';
import { Form } from './Entity/Form';


import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { Popup } from 'mapbox-gl';

import '../../assets/styles/reset.css';
import '../../assets/styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DummyControl } from './Mapbox/Control/DummyControl';

class App {
    // currentGeoLocation = {
    //     lat: 0,
    //     lon: 0
    // }; 
    
    form = null;
    mainMap = null;

    lonInput;
    latInput;

    lat;
    long;

    constructor() {

        mapboxgl.accessToken = config.mapbox.token; // api token
        this.form = new Form(); 
    }

    /**
     * Start App
     */
    start() {
        console.info('App started');
    // FORM initialize
        this.form.getForm();
        
    // MAP initialize
        this.mainMap = new mapboxgl.Map({
            container: 'main-map',
            style: 'mapbox://styles/mapbox/dark-v10',
        });
    // get inputs from form
        this.lonInput = document.querySelector('#lon');
        this.latInput = document.querySelector('#lat');

    // Set event listener - find coordinates from click and put it in input value
        this.mainMap.on('click', (e) => {
            // console.log(`A click event has occurred at ${e.lngLat}`);
            console.log(e);
            // console.log(this.latInput);
            // console.log(this.lonInput);

            this.lonInput.value = e.lngLat.lat;
            this.latInput.value = e.lngLat.lng;
        });

        // add navigation controls (zoom, inclinaison, etc)
        const navControl = new mapboxgl.NavigationControl( {visualizePitch: true} );
        this.mainMap.addControl(navControl, 'bottom-right');
    
        // add geolocation control
        const geoControl = new mapboxgl.GeolocateControl({
            fitBoundsOptions: {
                zoom: 17.5,
                padding: 20
            },
            positionOptions: {
                enableHighAccuracy: true,
                showUserHeading: true,
            },

        });

        // Refresh button
        this.mainMap.addControl(geoControl, 'top-right');

        // Full Screen button
        this.mainMap.addControl(new mapboxgl.FullscreenControl({body: document.querySelector('body')}));

        // Add a personalized control "DummyControl"
        const dummyControl = new DummyControl();
        this.mainMap.addControl(dummyControl, 'top-right');

        // add pin without popup, title only
        const marker = new mapboxgl.Marker({
            color: '#fc0'
        });
        // set marker coordinates
        marker.setLngLat({
            lon: 3.454649789,
            lat: 43.4564897468
        });

        // add marker to map
        marker.addTo(this.mainMap);
        // set marker title when mouse hover 
        const markerDiv = marker.getElement();
        markerDiv.title = 'First Pin';

        // add pin with popup
        const markerWPop = new mapboxgl.Marker({
            color: '#e1c'
        });
        // set marker coordinates
        markerWPop.setLngLat({
            lon: 2.8948,
            lat: 42.6887
        });
        // Popup
        const popUp = new mapboxgl.Popup();
        // PopUp html 
        popUp.setHTML('<h2>Pop-up title!</h2><p>This is the pop up content</p>');
        // set popup coordinates (equal to marker)
        markerWPop.setPopup(popUp);
        // add marker with popup to map
        markerWPop.addTo(this.mainMap);

        // get marker
        const markerPointerDiv = marker.getElement();
        // set marker title
        markerPointerDiv.title = 'Hello friend!';
    }

    /**
     * create HTML with data
     * @param data {Object}
     */
    render(data) {
        console.info(data);
        const
            current = data.current,
            weather = current.weather[0];
        /*
        "current": {
            "dt": 1655468313,
            "sunrise": 1655438752,
            "sunset": 1655494577,
            "temp": 30.62,
            "feels_like": 29.27,
            "pressure": 1023,
            "humidity": 29,
            "dew_point": 10.57,
            "uvi": 9.62,
            "clouds": 35,
            "visibility": 10000,
            "wind_speed": 1.54,
            "wind_deg": 0,
            "weather": [
                {
                    "id": 802,
                    "main": "Clouds",
                    "description": "scattered clouds",
                    "icon": "03d"
                }
            ]
        }
         */
    }
}

const instance = new App();

export default instance; // allows to import this class into another file only one instance of App - like a singleton (imports allways the same instance)