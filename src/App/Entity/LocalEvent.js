export class LocalEvent {
    title;
    description;
    beginDate;
    endDate;
    lat;
    lon;

    constructor(json) {
        this.title = json.title;
        this.description = json.description;
        this.beginDate = json.beginDate;
        this.endDate = json.endDate;
        this.lat = json.lat;
        this.lon = json.lon;
    }

    render() {
        let eventDOM = `<h2>${this.title}</h2>
        <p>${this.description}</p>
        <p>Begin Date: ${this.beginDate}</p>
        <p>End Date: ${this.endDate}</p>
        <p>Coordinates: ${this.lat} lat, ${this.lon} lon</p>`;

        return eventDOM;
    }


    // Cette méthode sera appelée automatiquement par JSON.stringify
    // Elle doit donc retournée la forme litérale souhaitée pour cet objet
    // On ne veut enregistrer que certaines propriétés
    toJSON() {
        return {
            title: this.title,
            description: this.description,
            beginDate: this.beginDate,
            endDate: this.endDate,
            lat: this.lat,
            lon: this.lon
        }
    }

}