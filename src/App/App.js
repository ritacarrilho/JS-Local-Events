// import config from '../../app.config';
import { LocalStorageService } from './Service/LocalStorageService';
import { Form } from './Entity/Form';
import { LocalEvent } from './Entity/LocalEvent';
import { Map } from './Entity/Map';
import { Marker } from './Entity/Marker';


import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { Popup } from 'mapbox-gl';

import '../../assets/styles/reset.css';
import '../../assets/styles/style.css';

const STORAGE_KEY = 'local-events';

class App {
    evtStorage = null;
    arrEvt = [];
   
    mainMap = null;
    map = null;
    locEvent = null;
    form = null;
    formEls = null;

    submitBtn;

    constructor() {
        // MAP initialize
        this.map = new Map();
        this.mainMap = this.map.mainMap;
        //TODO: make Marker class
        // this.marker = new Marker();
        // this.pin = this.marker.

        this.form = new Form();
        this.evtStorage = new LocalStorageService( STORAGE_KEY );
    }

    /**
     * Start App
     */
    start() {
        // initialize map
        this.map.start(this.form);
    // initialize form DOM
        this.form.getForm();
  
        //form elements
        this.formEls = [ this.form.title, this.form.description, this.form.beginDate, this.form.endDate, this.form.lat, this.form.lon ];

        // Submit form event
        this.submitBtn = document.querySelector('#submit');
        this.submitBtn.addEventListener('click', this.handlerCreateLocEvt.bind(this));

        this.getMarkers();

        // personalized event
        document.addEventListener("displayMarker", this.getMarkers.bind(this));

        //remove error class on click
        this.formEls.forEach(element => {
            element.addEventListener( 'click', this.handlerRemoveError.bind(this) );
        });

    }

    /**
     * Display markers in map according to data in local storage
     */
    getMarkers() {
        // get data from local storage
        let itemStorage = this.evtStorage.getJSON();

        // Si le stockage n'est pas encore crée on ne pass à la suite
        if( itemStorage === null ) return;

        // store each local event into local storage
        for( let eventJSON of itemStorage ) this.arrEvt.push( new LocalEvent( eventJSON ) );
        console.log('loaded from local storage');

        // MARKERS
        this.arrEvt.forEach(locEvt => {
            this.createMarkers(locEvt);
        });
    }

    /**
     * Create markers and popups
     * @param {array element} locEvt 
     */
    createMarkers(locEvt) {
        // Popup
        const popUp = new mapboxgl.Popup({ closeOnMove: true, className: 'pop-up' });
        // PopUp html 
        popUp.setHTML(this.popUpRender(locEvt));
        popUp.closeOnMove(true);

        // add pin 
        let marker = new mapboxgl.Marker({
            color: 'red'
        }).setLngLat({ lon: locEvt.lon,lat: locEvt.lat,}).addTo(this.mainMap);

        // title on mouse hover
        const markerDiv = marker.getElement();
        markerDiv.title = `${locEvt.title} - from ${this.formatDate(locEvt.beginDate)} to ${this.formatDate(locEvt.endDate)}`;
        // locEvt.title + ' - from ' + this.formatDate(locEvt.beginDate) + ' to ' + this.formatDate(locEvt.endDate);
    }

    /**
     * Creation of Local Events
     * @param {*} evt 
     */
    handlerCreateLocEvt(evt) {
        evt.preventDefault();

        let regAlphaNum = new RegExp('^[A-Za-z0-9 ]+$'),
            hasError = false;

        // Errors control
        if( !regAlphaNum.test( this.form.title.value ) ) {
            hasError = true;
            this.form.title.value  = '';
            this.form.title.classList.add( 'error' );
        }

        this.formEls.forEach(element => {
            if( element.value == '') {
                hasError = true;
        
                element.value = '';
                element.classList.add('error');
            }
        });

        //TODO: send error message(then)
        if( hasError ) return;
        
        // Data treatment
        const newEvt = {};
        // event obj properties creation
        newEvt.title = this.form.title.value;
        newEvt.description = this.form.description.value;
        newEvt.beginDate = this.form.beginDate.value;
        newEvt.endDate = this.form.endDate.value;
        newEvt.lat = this.form.lat.value;
        newEvt.lon = this.form.lon.value;

        // add new event obj into array of Local Events
        this.arrEvt.push( new LocalEvent( newEvt ) );
        console.log(this.arrEvt);
        console.log(newEvt);

        // Persistance des données
        this.evtStorage.setJSON( this.arrEvt );
        console.log('added to local storage from event creation');

        //TODO: change alert for modal
        // success message
        alert(this.successMessage(newEvt.title));

        // clean input values after form submition
        this.form.clearInputs();

        document.dispatchEvent(new CustomEvent('displayMarker'));
    }

    /**
     * PopUp HTML template
     * @param {*} localEvt 
     */
    popUpRender(localEvt) {
        return `<h2>${localEvt.title}</h2>
            <p><strong>Description: </strong>${localEvt.description}</p>
            <p><strong>Begin Date: </strong>${this.formatDate(localEvt.beginDate)}</p>
            <p><strong>End Date: </strong>${this.formatDate(localEvt.endDate)}</p>
            <p><strong>Latitude: </strong>${localEvt.lat} lat</p>
            <p><strong>Longitude: </strong>${localEvt.lon} lon</p>`;
    }

    /**
     * Marker color according to Local Event date
     * @param {*} eventDate 
     * @returns string
     */
    markerColorHandler(eventDate) {
        let today = new Date()
        let currDate = today.getTime();
        let parsedToday = parseInt(currDate);
        let parsedeventDate = parseInt(eventDate);
        let daysNumber = 86400000 * 3;

// evento em mais de tres dias 
// evento em 3 dias ou menos
// envento ja passado

        // console.log('today: ' + currDate);
        // console.log('evtDate: ' + Date.parse(eventDate));
        // console.log('days: ' + (daysNumber));

        // console.log(` result: ${parsedToday /  parsedeventDate}`);

        if(parsedToday / parsedeventDate > daysNumber) {
            return '#69b53b';
        } else if (parsedToday / parsedeventDate <= daysNumber && parsedToday - parsedeventDate == 0) {
            return '#f0d108';
        } else if(parsedToday / parsedeventDate < 0) {
            return '#cd470d';
        }
    }

    /**
     * Success message Html
     * @param {*} title 
     * @returns string
     */
    successMessage(title) {
        const msg = `The local Event ${title} was successfully created !`;

        return msg;
    }

    /**
     * Error message Html
     * @returns string
     */
    errorMessage() {
        const msg = `Please fill all fields`;

        return msg;
    }
    
    /**
     * Remove error class from inputs
     * @param {evt.target} evt 
     */
    handlerRemoveError( evt ) {
        evt.target.classList.remove( 'error' );
    }

    /**
     * Format Date to display in html
     * @param {*} date 
     */
    formatDate(date) {
        return date.replace('T', ' ');
    }
}


const instance = new App();

export default instance; // allows to import this class into another file only one instance of App - like a singleton (imports allways the same instance)