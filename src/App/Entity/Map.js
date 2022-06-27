import mapboxgl, { Popup } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export class Map {
    map = null;; 

    constructor() {
        mapboxgl.accessToken = config.mapbox.token; // api token

    } 

    start() {
        // MAP initialize
        this.mainMap = new mapboxgl.Map({
            container: 'main-map',
            style: 'mapbox://styles/mapbox/dark-v10',
        });
    }

}