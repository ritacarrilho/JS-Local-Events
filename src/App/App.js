import config from '../../app.config';
import { LocalStorageService } from './Service/LocalStorageService';
import { Form } from './Entity/Form';
import { LocalEvent } from './Entity/LocalEvent'


import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { Popup } from 'mapbox-gl';

import '../../assets/styles/reset.css';
import '../../assets/styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DummyControl } from './Mapbox/Control/DummyControl';

const STORAGE_KEY = 'local-events';

class App {
    evtStorage = null;
    arrEvt = [];

    form = null;
    mainMap = null;
    locEvent = null;

    lat;
    long;
    submitBtn;

    constructor() {
        mapboxgl.accessToken = config.mapbox.token; // api token
        this.form = new Form();

        this.evtStorage = new LocalStorageService( STORAGE_KEY );

        // MAP initialize
        this.mainMap = new mapboxgl.Map({
            container: 'main-map',
            style: 'mapbox://styles/mapbox/dark-v10',
        });

        // Local Event initialize
        // this.locEvent = new LocalEvent();
    }

    /**
     * Start App
     */
    start() {
        // console.info('App started');
    // initialize form DOM
        this.form.getForm();

    // Set event listener - find coordinates from click and put it in input value
        this.mainMap.on('click', (e) => {
            console.log(e);
            // console.log(this.latInput);
            // console.log(this.lonInput);
            this.form.lat.value = e.lngLat.lat;
            this.form.lon.value = e.lngLat.lng;
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
        // popUp.setHTML(this.locEvent.render());
        // set popup coordinates (equal to marker)
        markerWPop.setPopup(popUp);
        // add marker with popup to map
        markerWPop.addTo(this.mainMap);

        // get marker
        const markerPointerDiv = marker.getElement();
        // set marker title
        // markerPointerDiv.title = `${this.locEvent.title}`;

        this.submitBtn = document.querySelector('#submit');
        this.submitBtn.addEventListener('click', this.handlerCreateLocEvt.bind(this));

        let itemStorage = this.evtStorage.getJSON();

        // Si le stockage n'est pas encore crée on ne pass à la suite
        if( itemStorage === null ) return;

        // store
        for( let eventJSON of itemStorage ) this.arrEvt.push( new LocalEvent( eventJSON ) );
        
    }

    /**
     * create HTML with data
     * @param data {Object}
     */
    render(data) {

    }

    handlerCreateLocEvt(evt) {
        // console.log(this.form);
        evt.preventDefault();
        // console.log(evt)

        // Traitement des données
        const newEvt = {};

        // console.log(formtitle.value);
        // console.log(this.form.title.value);
        newEvt.title = this.form.title.value;
        newEvt.description = this.form.description.value;
        newEvt.beginDate = this.form.beginDate.value;
        newEvt.endDate = this.form.endDate.value;
        newEvt.lat = this.form.lat.value;
        newEvt.lon = this.form.lon.value;

        // add new event obj into array of Local Events
        this.arrEvt.push( new LocalEvent( newEvt ) );
        console.log(newEvt);
        console.log(this.arrEvt);
 
         // Persistance des données
         this.evtStorage.setJSON( this.arrEvt );

        //TODO: call clear method from Form class
    }
}

const instance = new App();

export default instance; // allows to import this class into another file only one instance of App - like a singleton (imports allways the same instance)