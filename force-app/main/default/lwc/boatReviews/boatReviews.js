import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
export default class BoatReviews extends NavigationMixin(LightningElement) {
    // Private
    boatId;
    error;
    boatReviews = [];
    isLoading;

    // Getter and Setter to allow for logic to run on recordId change
    get recordId() { 
        return this.boatId;
    }
    @api set recordId(value) {
        //sets boatId attribute
        this.boatId = value;
        //sets boatId assignment
        //get reviews associated with boatId
        this.getReviews();
    }

    // Getter to determine if there are reviews to display
    get reviewsToShow() {
        if (this.boatReviews.length === 0 ) {
            return false;
        }
        return true;
    }

    // Public method to force a refresh of the reviews invoking getReviews
    @api refresh() { 
        this.getReviews();
    }

    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() {
        console.log('1');
        if(!this.boatId) {
            return;
        }
        console.log('2');
        this.isLoading = true;
        getAllReviews({
            boatId: this.boatId
        }).then(result => {
            console.log('3' + JSON.stringify(result, null, 2));
            if(result){
                this.boatReviews = result;
            }
        }).catch(error => {
            console.log('Error : ' + error.message);
            this.error = error;
        });
        this.isLoading = false;
    }

    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) { 
        // Stop the event's default behavior (don't follow the HREF link) and prevent click bubbling up in the DOM...
        event.preventDefault();
        event.stopPropagation();
        // Navigate as requested...        
        console.log(' rec id == ' + event.target.dataset.recordId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.recordId,
                objectApiName: 'User',
                actionName: 'view'
            }
        });
    }
}