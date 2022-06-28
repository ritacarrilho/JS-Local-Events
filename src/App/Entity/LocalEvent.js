export class LocalEvent {
    title;
    description;
    beginDate = new Date();
    endDate = new Date();
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