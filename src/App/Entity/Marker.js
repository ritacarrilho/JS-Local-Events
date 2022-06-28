import mapboxgl from 'mapbox-gl';

export class Marker {
    marker;

    constructor(){
        this.marker = new mapboxgl.Marker();
    }

    getMarker(evt, map) {
        // Popup
        const popUp = new mapboxgl.Popup({ closeOnMove: true, className: 'pop-up' });
        // PopUp html 
        popUp.setHTML(this.popUpRender(locEvt));

        // add pin 
        this.marker = new mapboxgl.Marker({
            color: 'red'
        }).setLngLat({ lon: evt.lon,lat: evt.lat,}).addTo(map);

        // title on mouse hover
        const markerDiv = marker.getElement();
        markerDiv.title = `${evt.title} - from ${this.formatDate(evt.beginDate)} to ${this.formatDate(evt.endDate)}`;
        // locEvt.title + ' - from ' + this.formatDate(locEvt.beginDate) + ' to ' + this.formatDate(locEvt.endDate);
    }
}
