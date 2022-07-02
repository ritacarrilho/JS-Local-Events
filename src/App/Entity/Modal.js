/**
 * Success Message modal
 */
export class Modal {
    modalDiv = document.querySelector('.success-message');

    render(data) {
        this.modalDiv.innerHTML = `<span>
            <p>The Event "${data.title.value}" as been successfully added</p>
        </span>

        <div class="modal-info">
            <h5>Recap:</h5>
            <p><span>Begin date: </span>${this.formatDate(data.beginDate.value)}</p>
            <p><span>End date: </span>${this.formatDate(data.endDate.value)}</p>
            <p><span>Latitude: </span>${data.lat.value}</p>
            <p><span>Longitude: </span>${data.lon.value}</p>
        </div>

        <button type="button" class="btn-close" id="message-close-btn">
            <i class="fa-regular fa-circle-check"></i>
            Close
        </button>`;

    this.modalDiv.classList.remove('hidden');

    return this.modalDiv;
    }

    /**
     * Format Date to display in html
     */
    formatDate(date) {
        return date.replace('T', ' at ');
    }
    
}