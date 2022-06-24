export class DummyControl {
    map;
    container; 
    /**
     * 
     * @param map {Object}
     * @returns 
     */
    onAdd(map) { // returns the container to display on the page
        this.map = map;

        /*
        <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
            <button type="button">
                <span class="mapboxgl-ctrl-icon">🌈</span>
            </button>
        </div>
        */

        this.container = document.createElement('div');
        // // this.container.className = 'mapboxgl-ctrl';

        this.container.classList.add( 'mapboxgl-ctrl', 'mapboxgl-ctrl-group');
        this.container.innerHTML = '<button type="button" class="map-control-clown"><span>🌈</span></button>';

        this.container.children[0].addEventListener( 'click', this.handlerDummyClick.bind(this) );

        return this.container;

    }
         
    onRemove() { 
        this.container.removeEventListener(this.handlerDummyClick); // remove listner

        // this._container.parentNode.removeChild(this._container); // remove element from DOM tree
        this.container.remove(); // remove element from DOM tree
        this.container = undefined; // remove reference (so the garbage collector can delete it from the memory)

        this.map = undefined;
    }

    /**
     * 
     */
    handlerDummyClick() {
        console.log(this.container.textContent);
    }
}