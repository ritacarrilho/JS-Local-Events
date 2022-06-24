/**
 * Browser's Local Storage managment 
 */
export class LocalStorageService {
    storageKey; // property to store local storage's key

    constructor(key) {
        this.storageKey = key;
    }

    set(value) {
        localStorage.setItem(this.storageKey, value);
    }

    get() {
        return localStorage.getItem(this.storageKey);
    }

    clear() {
        localStorage.removeItem(this.storageKey);
    }

    setJSON(json) {
        this.set(JSON.stringify(json));
    }

    getJSON() {
        try{
            return JSON.parse(this.get());
        }
        catch(e) {
            // if the data is not good, clears from local storage
            this.clear();
            return null;
        }
    }
}