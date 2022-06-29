import { LocalStorageService } from './Service/LocalStorageService';
import { Form } from './Entity/Form';
import { LocalEvent } from './Entity/LocalEvent';
import { Map } from './Entity/Map';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

import '../../assets/styles/reset.css';
import '../../assets/styles/style.css';

const STORAGE_KEY = 'local-events';

class App {
    evtStorage = [];
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
        // If the local storage is not yet created, ends method execution
        if( itemStorage === null ) return;

        // display markers created from Local Event stored in local storage
        itemStorage.forEach(eventJSON => {
            this.createMarkers(eventJSON);
        });
    }

    /**
     * Create markers and popups
     */
    createMarkers(locEvt) {
        // Popup
        const popUp = new mapboxgl.Popup({ closeOnMove: true, className: 'pop-up' });
        popUp.setHTML(this.popUpRender(locEvt));

        // Marker
        let marker = new mapboxgl.Marker({
            color: this.setMarkerColor(locEvt.beginDate)
        }).setLngLat({ lon: locEvt.lon,lat: locEvt.lat,}).setPopup(popUp).addTo(this.mainMap);

        // title on mouse hover
        const markerDiv = marker.getElement();
        markerDiv.title = `${locEvt.title} - from ${this.formatDate(locEvt.beginDate)} to ${this.formatDate(locEvt.endDate)}`;
        // locEvt.title + ' - from ' + this.formatDate(locEvt.beginDate) + ' to ' + this.formatDate(locEvt.endDate);
    }

    /**
     * Creation of Local Events
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

        //TODO: send error message(try catch)
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

        // if local storage is empty, array of local events is eqaul to an empty array, otherwise it gets the value of the local storage
        this.evtStorage.getJSON() === null ? this.arrEvt = [] : this.arrEvt = this.evtStorage.getJSON();
        // console.log(this.arrEvt);

        // add new event obj into array of Local Events
        this.arrEvt.push( new LocalEvent( newEvt ) );

        this.evtStorage.setJSON(this.arrEvt);

        //TODO: change alert for modal
        // success message
        alert(this.successMessage(newEvt.title));

        document.dispatchEvent(new CustomEvent('displayMarker'));

        // clean input values after form submition
        this.form.clearInputs();
    }

    /**
     * PopUp HTML template
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
     */
    setMarkerColor(eventDate) {
        let msg = '';

        let today = new Date()
        let currDate = today.getTime();
        let parsedToday = parseInt(currDate);
        let parsedeventDate = parseInt(eventDate);
        let daysNumber = (60 * 60 * 24 * 1000) * 3;

        // console.log('today: ' + currDate);
        // console.log('evtDate: ' + Date.parse(eventDate));
        // console.log('days: ' + daysNumber);
        // console.log(typeof parsedToday);
        // console.log(typeof daysNumber);
        // console.log(typeof parsedeventDate);
        let result = parsedToday - parsedeventDate;
        // console.log(parsedToday - parsedeventDate);
        // console.log(result);

        if((parsedToday - daysNumber) < Date.parse(parsedeventDate)) {
            return '#69b53b';
        } else if ((parsedToday - daysNumber <= Date.parse(parsedeventDate))  && (parsedToday - daysNumber == 0)) {
            // msg = 'Attention, commence dans n jours et n heures';
            return '#f0d108';
        } else if(parsedToday > Date.parse(parsedeventDate)) {
            // msg = 'Quel dommage ! Vous avez raté cet événement !'
            return '#cd470d';
        }
    }

    /**
     * Success message Html
     */
    successMessage(title) {
        const msg = `The local Event ${title} was successfully created !`;

        return msg;
    }

    /**
     * Error message Html
     */
    errorMessage() {
        const msg = `Please fill all fields`;
        return msg;
    }
    
    /**
     * Remove error class from inputs
     */
    handlerRemoveError( evt ) {
        evt.target.classList.remove( 'error' );
    }

    /**
     * Format Date to display in html
     */
    formatDate(date) {
        return date.replace('T', ' ');
    }
}


const instance = new App();

export default instance; // allows to import this class into another file only one instance of App - like a singleton (imports allways the same instance)