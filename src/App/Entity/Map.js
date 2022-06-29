import config from '../../../app.config'

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { DummyControl } from '../Mapbox/Control/DummyControl';

export class Map {
    mainMap = null;
    lat = null;
    long = null;
    
    constructor() {
        mapboxgl.accessToken = config.mapbox.token; // api token

        // MAP initialize
        this.mainMap = new mapboxgl.Map({
            container: 'main-map',
            style: 'mapbox://styles/mapbox/dark-v10',
        });

    } 

    start(form) {
        // Set event listener - find coordinates from click and put it in input valuehandlerCreateLocEvt
        this.mainMap.on('click', (e) => {
            console.log(e);
            // console.log(this.latInput);
            // console.log(this.lonInput);
            form.lat.value = e.lngLat.lat;
            form.lon.value = e.lngLat.lng;

            // remove input error
            form.lat.classList.remove('error');
            form.lon.classList.remove('error');
        });

        // add navigation controls (zoom, inclinaison, etc)
        const navControl = new mapboxgl.NavigationControl( {visualizePitch: true} );
        this.mainMap.addControl(navControl, 'bottom-right');
    
    // add geolocation control
        const geoControl = new mapboxgl.GeolocateControl({
            fitBoundsOptions: {
                zoom: 15,
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

        this.mainMap.scrollZoom.setWheelZoomRate(1 / 100);

        // Add a personalized control "DummyControl"
        const dummyControl = new DummyControl();
        this.mainMap.addControl(dummyControl, 'top-right');
    }
}