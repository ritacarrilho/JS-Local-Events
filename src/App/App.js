import { LocalStorageService } from './Service/LocalStorageService';
import { Form } from './Entity/Form';
import { LocalEvent } from './Entity/LocalEvent';
import { Map } from './Entity/Map';
import { Modal } from './Entity/Modal';


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
    modal;

    constructor() {
        // MAP initialize
        this.map = new Map();
        this.mainMap = this.map.mainMap;
        this.modal = new Modal();
        //TODO: make Marker class

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
            color: this.setMarkerColor(locEvt)
        }).setLngLat({ lon: locEvt.lon,lat: locEvt.lat,}).setPopup(popUp).addTo(this.mainMap);

        // title on mouse hover
        const markerDiv = marker.getElement();
        markerDiv.title = `${locEvt.title}
from ${this.formatDate(locEvt.beginDate)} 
to ${this.formatDate(locEvt.endDate)}`;
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

        // success modal
        this.modal.render(this.form);

        document.dispatchEvent(new CustomEvent('displayMarker'));

        // close modal
        let closeBtn = document.querySelector('#message-close-btn');
        closeBtn.addEventListener('click', this.handlerModal);

        // clean input values after form submition
        this.form.clearInputs();
    }

    /**
     * PopUp HTML template
     */
    popUpRender(localEvt) {
        return `<h2>${localEvt.title}</h2>
            <p><span>Description: </span>${localEvt.description}</p>
            <p><span>Begin Date: </span>${this.formatDate(localEvt.beginDate)}</p>
            <p><span>End Date: </span>${this.formatDate(localEvt.endDate)}</p>
            <p><span>Latitude: </span>${localEvt.lat}</p>
            <p><span>Longitude: </span>${localEvt.lon}</p>
            <p>${this.setDaysMessage(localEvt)}</p>`;
    }

    /**
     * Marker color according to Local Event date
     */
    setMarkerColor(date) {
        let threeDays = new Date(date.beginDate).getTime() - ( 3 * 24 * 60 * 60 * 1000 );
        let currDate = Date.now();
        let dateEnd = new Date(date.endDate).getTime();

        if (currDate < threeDays) { // green
            return '#91CC5A'
        }
        else if (dateEnd < currDate){ //red
            return '#CC5959'
        }
        else { // orange
            return '#D49C42';
        }
    }

    /**
     * display message according to Local Event date
     */
    setDaysMessage(date) {
        let currDate = Date.now();
        let evtBegDate = new Date(date.beginDate).getTime();
        let evtEndDate = new Date(date.endDate).getTime();
        let threeDays =  3 * 24 * 60 * 60 * 1000 ;

        const dateResult = this.formatMessageTime(evtBegDate, currDate);
        const passedDateResult = this.formatMessageTime(evtEndDate, currDate);

        if(evtBegDate < currDate && evtEndDate > currDate) { 
            return `<p style= "color: #D49C42; font-weight: 400;">Attention, this event ends in ${passedDateResult[0]} days, ${passedDateResult[1]} hours and ${passedDateResult[2]} minutes</p>`;
        } else if(evtBegDate - currDate <= threeDays && evtBegDate > currDate) {
            return `<p style= "color: #D49C42; font-weight: 400;">Attention, this event starts in ${dateResult[0]} days, ${dateResult[1]} hours and ${dateResult[2]} minutes</p>`;
        }else if(evtBegDate < currDate && evtEndDate < currDate) {
            return '<p style= "color: #CC5959; font-weight: 400;">What a pity ! You missed this event !</p>';
        } else if(evtBegDate - currDate > threeDays) {
            return `<p style= "color: #91CC5A; font-weight: 400;">Attention, this event starts in ${dateResult[0]} days, ${dateResult[1]} hours and ${dateResult[2]} minutes</p>`;
            // return '';
        }
    }

    formatMessageTime(date1, date2) {
        const dateResult = date1 - date2;

        const days = Math.floor(dateResult / (24*60*60*1000));
        const daysMs = dateResult % (24*60*60*1000);
        const hours = Math.floor(daysMs / (60*60*1000));
        const hoursMs = dateResult % (60*60*1000);
        const minutes = Math.floor(hoursMs / (60*1000));

        const time = [ days, hours, minutes ];
        return time;
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
        return date.replace('T', ' at ');
    }

    /**
     * Handler to close Modal
     */
    handlerModal() {
        let modalDiv = document.querySelector('.success-message');
        modalDiv.classList.add('hidden');
    }
}

const instance = new App();

export default instance; // allows to import this class into another file only one instance of App - like a singleton (imports allways the same instance)