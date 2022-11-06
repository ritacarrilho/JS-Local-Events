export class Form {
    title = null;
    description = null;
    beginDate = null;
    endDate = null;
    lat = null;
    lon = null;

    submitBtn = null;

    constructor() {}

    getForm() {
        let sidePanel = document.querySelector('.side-panel');
        let form = document.createElement('form');

        form.innerHTML = `
            <div class="form-group mb-2">
              <label for="title">Event Name</label>
              <input type="text" class="form-control" id="title">
            </div>
            <div class="form-group mb-2">
              <label for="description">Description</label>
              <textarea class="form-control" id="description" rows="5"></textarea>
            </div>
            <div class="form-group mb-2">
              <label for="begin-date">Begin Date</label>
              <input type="datetime-local" class="form-control" name="begin-date" id="begin">
            </div>
            <div class="form-group mb-2">
              <label for="end-date">End Date</label>
              <input type="datetime-local" class="form-control"name="end-date" id="end">
            </div>
            <div class="form-group mb-2">
              <label for="lat">Latitude</label>
              <input type="number" class="form-control" id="lat">
            </div>
            <div class="form-group mb-2">
              <label for="lon">Longitude</label>
              <input type="number" class="form-control br-5" id="lon">
            </div>
            
            <button type="submit" id="submit" class="btn btn-dark mt-3">Create</button>`;

            sidePanel.appendChild(form);
            this.beginDate = document.querySelector('#begin');
            this.endDate = document.querySelector('#end');
            this.title = document.querySelector('#title');
            this.description = document.querySelector('#description');
            this.lat = document.querySelector('#lat');
            this.lon = document.querySelector('#lon');
    }

    clearInputs() {
      this.title.value = '';
      this.description.value = '';
      this.beginDate.value = '';
      this.endDate.value = '';
      this.lat.value = '';
      this.lon.value = '';
    }
}
