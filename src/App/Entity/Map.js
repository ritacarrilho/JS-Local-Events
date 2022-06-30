import config from '../../../app.config'

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

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

            // style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
            // zoom: 13.1,
            // center: [-114.34411, 32.6141],
            // pitch: 85,
            // bearing: 80,
        });
    } 

    start(form) {
        // Set event listener - find coordinates from click and put it in input valuehandlerCreateLocEvt
        this.mainMap.on('click', (e) => {
            console.log(e);
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

        // Adjust map scroll
        this.mainMap.scrollZoom.setWheelZoomRate(1 / 100);

        // Personalized control "DummyControl"
        const dummyControl = new DummyControl();
        this.mainMap.addControl(dummyControl, 'top-right');

        // Search bar
        this.mainMap.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken, 
            mapboxgl: mapboxgl,
            marker: false,
            placeholder: 'Search',
            language: 'en-EN',
            // addressAccuracy: 'city',
        }), 'top-left');

        // Map style switch
        const layerList = document.getElementById('menu');
        const inputs = layerList.getElementsByTagName('input');
        
        for (const input of inputs) {
            input.onclick = (layer) => {
                const layerId = layer.target.id;
                this.mainMap.setStyle('mapbox://styles/mapbox/' + layerId);
            };
        }
            
    }

}




    

            
    



        