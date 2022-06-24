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

    longInput;
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
    // FORM
        this.form.getForm();
        
        this.mainMap = new mapboxgl.Map({
            container: 'main-map',
            style: 'mapbox://styles/mapbox/streets-v11',
        });

        this.longInput = document.querySelector('#long');
        this.latInput = document.querySelector('#lat');

        // console.info(this.mainMap);

        // Set an event listener
        this.mainMap.on('click', (e) => {
            console.log(`A click event has occurred at ${e.lngLat}`);
            console.log(e);
            this.longInput.value = e.lngLat.lat;
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

        // const fullScreen = new FullscreenControl({});

        this.mainMap.addControl(geoControl, 'top-right');
        this.mainMap.addControl(new mapboxgl.FullscreenControl({body: document.querySelector('body')}));

        // Add a personalised control "DummyCOntrol"
        const dummyControl = new DummyControl();
        this.mainMap.addControl(dummyControl, 'top-right');

        // add pin without popup
        const marker = new mapboxgl.Marker({
            color: '#fc0'
        });

        marker.setLngLat({
            lon: 3.454649789,
            lat: 43.4564897468
        });

        marker.addTo(this.mainMap);

        const markerDiv = marker.getElement();
        markerDiv.title = 'First Pin';

        // add pin with popup
        const markerWPop = new mapboxgl.Marker({
            color: '#e1c'
        });

        markerWPop.setLngLat({
            lon: 2.8948,
            lat: 42.6887
        });
    // Pop up
        const popUp = new mapboxgl.Popup();
        popUp.setHTML('<h2>Pop-up title!</h2><p>This is the pop up content</p>');
        markerWPop.setPopup(popUp);

        markerWPop.addTo(this.mainMap);

        const markerPointerDiv = marker.getElement();
        markerPointerDiv.title = 'Hello friend!';

    }

    /**
     * Queries the current weather service for previously stored coordinates
     * TODO: change weather for events 
     */
    getCurrentConditionForDefault() {
        const storedData = this.weatherStorage.getJSON();

        let refreshData = storedData === null || storedData.current === undefined; // make refresh to the data, pre-defined to null

        // if data is good, we continue the rest of comparaisons 
        if(!refreshData) {
            let todayUnix = Math.round(Date.now() / 1000);

            refreshData = todayUnix > (storedData.current.dt + config.openweather.cacheTime);

            // if the data are good, we check if the location has changed
            if(!refreshData) {
                refreshData = this.currentGeoLocation.lat !== storedData.lat || this.currentGeoLocation.lon !== storedData.lon;
            }
        }

        // if update of data is necessary
        if(refreshData) {
            console.info('fetching data from service...');

            // API request for data according to geo location
            this.weatherService
                .getCurrentConditions(this.currentGeoLocation.lat, this.currentGeoLocation.lon)
                .then(this.handlerCurrentConditions.bind(this));
        return;
        }

        // else
        console.info('fetching data from cache...');
        this.render(storedData);
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

    /**
     * Current Weather Service Promise Response Handler
     * @param data {Object} Data obtained from meteo api
     */
    handlerCurrentConditions( data ) {
        this.weatherStorage.setJSON(data); // if the key is good, stores the data into local storage
        this.render( data ); // creates HTML
    }

    /**
     * Browser GeoLocation API successful response handler
     * @param position {GeolocationPosition} information of geolocation obtained  
     */
    handlerGeoSuccess(position) {
        // round values of geolocation to match the number of decimals in geolocation lat nd lon sent by API
        this.currentGeoLocation.lat = parseFloat(position.coords.latitude.toFixed(5).slice(0, -1));
        this.currentGeoLocation.lon = parseFloat(position.coords.longitude.toFixed(5).slice(0, -1));

        // console.log(this.currentGeoLocation);

        this.getCurrentConditionForDefault();
    }

    /**
     * Browser GeoLocation API failed response handler
     * @param error {GeolocationPositionError}  Get geolocation error information
     */
    handlerGeoError(error) {
        // values to lat and lon if the user does not allow geolocation
        this.currentGeoLocation.lat = 46.866290;
        this.currentGeoLocation.lon = 2.389138;

        this.getCurrentConditionForDefault();
    }
}

const instance = new App();

export default instance; // allows to import this class into another file only one instance of App - like a singleton (imports allways the same instance)