import config from '../../app.config';
import { LocalStorageService } from './Service/LocalStorageService';
import { Form } from './Entity/Form';
import { LocalEvent } from './Entity/LocalEvent';
// import { Map } from './Entity/Map';


import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { Popup } from 'mapbox-gl';

import '../../assets/styles/reset.css';
import '../../assets/styles/style.css';
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

        // this.mainMap = new Map(); 
        //TODO: make Map class

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
    // initialize form DOM
        this.form.getForm();
        // this.mainMap.start();

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

        // Submit form event
        this.submitBtn = document.querySelector('#submit');
        this.submitBtn.addEventListener('click', this.handlerCreateLocEvt.bind(this));

        // get data from local storage
        let itemStorage = this.evtStorage.getJSON();

        // Si le stockage n'est pas encore crée on ne pass à la suite
        if( itemStorage === null ) return;

        // store each local event into local storage
        for( let eventJSON of itemStorage ) this.arrEvt.push( new LocalEvent( eventJSON ) );

    // MARKERS
        this.arrEvt.forEach(locEvt => {
        // Popup
        const popUp = new mapboxgl.Popup();
        // PopUp html 
        popUp.setHTML(this.popUpRender(locEvt));

        // add pin 
        const marker = new mapboxgl.Marker({
            color: '#fc0'
        }).setLngLat({
                lon: locEvt.lon,
                lat: locEvt.lat,
            }).setPopup(popUp)
                .addTo(this.mainMap);
        });

        // const markerTitle = marker.getElement();
        // markerTitle.title = 'First Pin';

        // all form inputs
        let formEls = [ this.form.title, this.form.description, this.form.beginDate, this.form.endDate, this.form.lat, this.form.lon ];
        //remove error class on click
        formEls.forEach(element => {
            element.addEventListener( 'click', this.handlerRemoveError.bind(this) );
        });
    }


    /**
     * create HTML with data
     * @param data {Object}
     */
    render(data) {

    }

    handlerCreateLocEvt(evt) {
        evt.preventDefault();
        evt.addEventListener( 'change', this.form.lat.handlerRemoveError);

        let regAlphaNum = new RegExp('^[A-Za-z0-9 ]+$'),
            hasError = false;

        // Errors control
        if( !regAlphaNum.test( this.form.title.value ) ) {
            hasError = true;
            this.form.title.value  = '';
            this.form.title.classList.add( 'error' );
        }

        if( this.form.description.value == '' ||     
            this.form.beginDate.value == '' ||
            this.form.endDate.value == '' ||
            this.form.lat.value == '' ||
            this.form.lon.value == '') 
        {
            hasError = true;
            this.form.description.value,     
            this.form.beginDate.value,
            this.form.endDate.value,
            this.form.lat.value,
            this.form.lon.value = '';

            this.form.description.classList.add( 'error' );
            this.form.beginDate.classList.add( 'error' );
            this.form.endDate.classList.add( 'error' );
            this.form.lat.classList.add( 'error' );
            this.form.lon.classList.add( 'error' );
        }

        //TODO: send error message(try, catch)
        if( hasError ) return;
        
        // Data treatment
        const newEvt = {};

        newEvt.title = this.form.title.value;
        newEvt.description = this.form.description.value;
        newEvt.beginDate = this.form.beginDate.value;
        newEvt.endDate = this.form.endDate.value;
        newEvt.lat = this.form.lat.value;
        newEvt.lon = this.form.lon.value;

        // add new event obj into array of Local Events
        this.arrEvt.push( new LocalEvent( newEvt ) );
        console.log(this.arrEvt);
 
        // Persistance des données
        this.evtStorage.setJSON( this.arrEvt );

        //TODO: change alert for modal
        // success message
        alert(this.successMessage(newEvt.title));

        // clean input values after form submition
        this.form.clearInputs();
    }

    // PopUp HTML template
    popUpRender(localEvt) {
        return `<h2>${localEvt.title}</h2>
            <p><strong>Description: </strong>${localEvt.description}</p>
            <p><strong>Begin Date: </strong>${localEvt.beginDate}</p>
            <p><strong>End Date: </strong>${localEvt.endDate}</p>
            <p><strong>Latitude: </strong>${localEvt.lat} lat</p>
            <p><strong>Longitude: </strong>${localEvt.lon} lon</p>`;
    }

    markerColorHandler(eventDate) {
        let today = Date.now();

        if (eventDate ) {
           
        }
    }

    successMessage(title) {
        const msg = `The local Event ${title} was successfully created !`;

        return msg;
    }

    errorMessage() {
        const msg = `Please fill all fields`;

        return msg;
    }
    
    handlerRemoveError( evt ) {
        evt.target.classList.remove( 'error' );
    }

}


const instance = new App();

export default instance; // allows to import this class into another file only one instance of App - like a singleton (imports allways the same instance)