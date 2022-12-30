import { LightningElement, wire, api } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Import message service features required for publishing and the message channel
import { publish, subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/boatMessageChannel__c';
import recordSelected from '@salesforce/messageChannel/boatMessageChannel__c';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

const COLS = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
    { label: 'Description', fieldName: 'Description__c', editable: true },
];
export default class BoatSearchResults extends LightningElement {
    selectedBoatId;
    columns = COLS;
    boatTypeId = '';
    boats = [];
    isLoading = false;
    draftValues = [];

    // wired message context
    @wire(MessageContext) 
    messageContext;
    // wired getBoats method 
    @wire(getBoats, {
        boatTypeId: '$boatTypeId'})
    wiredBoats(result) { 
        this.boats = result;
    }

    // public function that updates the existing boatTypeId property
    // uses notifyLoading
    @api searchBoats(boatTypeId) { 
        this.notifyLoading(true);
        this.boatTypeId = boatTypeId;
        this.notifyLoading(false);
    }

    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    async refresh() { 
        this.notifyLoading(true);
        await refreshApex(this.boats);
        this.notifyLoading(false);
    }

    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
        // console.log('selected boat == ' + event.detail.boatId);
    }

    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {
        // explicitly pass boatId to the parameter recordId
        console.log(' pub : ' + boatId);
        const payload = { recordId: boatId };
        publish(this.messageContext, recordSelected, payload);
    }

    // The handleSave method must save the changes in the Boat Editor
    // passing the updated fields from draftValues to the 
    // Apex method updateBoatList(Object data).
    // Show a toast message with the title
    // clear lightning-datatable draft values
    async handleSave(event) {
        // notify loading
        this.notifyLoading(true);
        const updatedFields = event.detail.draftValues;
        // Update the records via Apex
        updateBoatList({ data: updatedFields })
            .then(() => {
                // Report success with a toast
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: SUCCESS_TITLE,
                        message: MESSAGE_SHIP_IT,
                        variant: SUCCESS_VARIANT
                    })
                );
             })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: ERROR_TITLE,
                        message: error.body.message,
                        variant: ERROR_VARIANT
                    })
                );
             })
            .finally(() => { 
                this.refresh();
            });

        // Clear all draft values in the datatable
        this.draftValues = [];
        this.notifyLoading(false);
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
        if(isLoading) {
            const loadEvent = new CustomEvent('loading');
            this.dispatchEvent(loadEvent);
        } else {
            const loadEvent = new CustomEvent('doneloading');
            this.dispatchEvent(loadEvent);
        }
    }
}