import { LightningElement, api, wire } from 'lwc';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';
import { NavigationMixin } from 'lightning/navigation';

// imports
export default class SimilarBoats extends NavigationMixin(LightningElement) {
    // Private
    currentBoat;
    relatedBoats;
    boatId;
    error;

    // public
    get recordId() {
        // returns the boatId
        return this.boatId;
    }
    @api set recordId(value) {
        // sets the boatId value
        this.boatId = value;
        // sets the boatId attribute
    }

    // public
    @api similarBy;

    // Wire custom Apex call, using the import named getSimilarBoats
    // Populates the relatedBoats list
    @wire(getSimilarBoats, {
        boatId: '$boatId', 
        similarBy: '$similarBy'})
    similarBoats({ error, data }) { 
        console.log(this.boatId + ' : ' + this.similarBy);
        if(data) {
            console.log('similar boats : ' + JSON.stringify(data, null, 2));
            this.relatedBoats = data;
        }
        if(error) {
            this.error = error;
        }
    }
    get getTitle() {
        return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
        return !(this.relatedBoats && this.relatedBoats.length > 0);
    }

    // Navigate to record page
    openBoatDetailPage(event) { 
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.boatId,
                objectApiName: 'Boat__c',
                actionName: 'view'
            }
        });
    }
}