export class Form {
        /**
     * <input type=”text”>
     * <textarea>
     * <input type=”datetime-locasl”>
     * <input type=”number”>
     *  */ 
    title;
    description;
    beginDate;
    endDate;
    lat;
    long;

    getForm() {
        //     <form  class="m-3">
        //     <div class="form-group">
        //       <label for="title">Event Name</label>
        //       <input type="text" class="form-control" id="title" aria-describedby="emailHelp">
        //     </div>
        //     <div class="form-group">
        //       <label for="description">Description</label>
        //       <textarea class="form-control" id="description" rows="3"></textarea>
        //     </div>
        //     <div class="form-group">
        //       <label for="begin-date">Begin Date</label>
        //       <input type="date" class="form-control" id="begin-date">
        //     </div>
        //     <div class="form-group">
        //       <label for="end-date">End Date</label>
        //       <input type="date" class="form-control" id="end-date">
        //     </div>
        //     <div class="form-group">
        //       <label for="lat">Latitude</label>
        //       <input type="number" class="form-control" id="lat">
        //     </div>
        //     <div class="form-group">
        //       <label for="lon">Longitude</label>
        //       <input type="number" class="form-control" id="lon">
        //     </div>
            
        //     <button type="submit" class="btn btn-primary mt-3">Create</button>
        //   </form>

        let sidePanel = document.querySelector('.side-panel');
        let form = document.createElement('form');

        form.innerHTML = `
            <div class="form-group mb-2">
              <label for="title">Event Name</label>
              <input type="text" class="form-control" id="title" aria-describedby="emailHelp">
            </div>
            <div class="form-group mb-2">
              <label for="description">Description</label>
              <textarea class="form-control" id="description" rows="3"></textarea>
            </div>
            <div class="form-group mb-2">
              <label for="begin-date">Begin Date</label>
              <input type="date" class="form-control" id="begin-date">
            </div>
            <div class="form-group mb-2">
              <label for="end-date">End Date</label>
              <input type="date" class="form-control" id="end-date">
            </div>
            <div class="form-group mb-2">
              <label for="lat">Latitude</label>
              <input type="number" class="form-control" id="lat">
            </div>
            <div class="form-group mb-2">
              <label for="lon">Longitude</label>
              <input type="number" class="form-control br-5" id="lon">
            </div>
            
            <button type="submit" class="btn btn-dark mt-3">Create</button>`;

            //form.classList.add('m-3'); give padding to form 
            sidePanel.appendChild(form);
            console.log(sidePanel);
    }
}