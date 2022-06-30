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
    zoomBtn = document.getElementById('zoom');
    
    constructor() {
        mapboxgl.accessToken = config.mapbox.token; // api token

        // MAP initialize
        this.mainMap = new mapboxgl.Map({
            container: 'main-map',
            style: 'mapbox://styles/mapbox/dark-v10', //pre-defined style
            // style: 'mapbox://styles/carrilhorita/cl510btk4002y14mo53ptnn9t',
            zoom: 2,
            // center: [54.535315, 16,7498],
            center: [30, 25],
        });
    } 

    start(form) {
        // Set event listener - find coordinates from click and put it in input valuehandlerCreateLocEvt
        this.mainMap.on('click', (e) => {
            // console.log(e);
            form.lat.value = e.lngLat.lat;
            form.lon.value = e.lngLat.lng;

            // remove input error
            form.lat.classList.remove('error');
            form.lon.classList.remove('error');
        });

        // Change buildings color when zoom (pre-defined style only)
        this.mainMap.on('load', () => {
            this.mainMap.setPaintProperty('building', 'fill-color', [
                'interpolate',
                // Set the exponential rate of change to 0.5
                ['exponential', 0.9],
                ['zoom'],
                // When zoom is 15, buildings will be light grey.
                12,
                '#ededed',
                // When zoom is 18 or higher, buildings will be black.
                18,
                '#000000'
            ]);
             
            this.mainMap.setPaintProperty('building', 'fill-opacity', [
                'interpolate',
                // Set the exponential rate of change to 0.5
                ['exponential', 0.9],
                ['zoom'],
                // When zoom is 10, buildings will be 100% transparent.
                10,
                0,
                // When zoom is 18 or higher, buildings will be 100% opaque.
                18,
                1
            ]);
        });

        // When the button is clicked, zoom in to zoom level 19.
        this.zoomBtn.addEventListener('click', this.zoomInHandler.bind(this));

        // Navigation controls (zoom, inclinaison, etc)
        const navControl = new mapboxgl.NavigationControl( {visualizePitch: true} );
        this.mainMap.addControl(navControl, 'bottom-right');
    
        // Geolocation control
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

        // Refresh button control
        this.mainMap.addControl(geoControl, 'top-right');

        // Full Screen button control
        this.mainMap.addControl(new mapboxgl.FullscreenControl({body: document.querySelector('body')}));

        // Adjust map scroll
        this.mainMap.scrollZoom.setWheelZoomRate(1 / 100);

        // Personalized "DummyControl" control
        const dummyControl = new DummyControl();
        this.mainMap.addControl(dummyControl, 'top-right');

        const geoCoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken, 
            mapboxgl: mapboxgl,
            marker: true,
            placeholder: 'Search',
            language: 'en-EN',
            // addressAccuracy: 'city',
        });

        // Search bar control
        this.mainMap.addControl(geoCoder, 'top-left');

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

    zoomInHandler() {
        this.mainMap.zoomTo(18, { duration: 10000 });
        // this.zoomBtn.innerHTML = 'Remove Color';
    }
}




    

            
    



        