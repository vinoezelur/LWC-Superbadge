import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import { getFieldValue } from 'lightning/uiRecordApi';
// Custom Labels Imports
import labelDetails from '@salesforce/label/c.Details'; 
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';

import BOATMC from '@salesforce/messageChannel/boatMessageChannel__c';
import { MessageContext, subscribe, unsubscribe, APPLICATION_SCOPE } from 'lightning/messageService';

// Boat__c Schema Imports
// import BOAT_ID_FIELD for the Boat Id
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id'
// import BOAT_NAME_FIELD for the boat Name
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name'

const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];
const DETAILS_TAB_ICON = 'utility:anchor';

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
    boatId;

    @wire(getRecord, {recordId: "$boatId", fields: BOAT_FIELDS})
    wiredRecord;
    label = {
        labelDetails,
        labelReviews,
        labelAddReview,
        labelFullDetails,
        labelPleaseSelectABoat,
    };

    // Decide when to show or hide the icon
    // returns 'utility:anchor' or null
    get detailsTabIconName() { 
        return this.wiredRecord.data ? DETAILS_TAB_ICON : null;
    }

    // Utilize getFieldValue to extract the boat name from the record wire
    get boatName() { 
        return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
    }

    // Private
    subscription = null;
    // Initialize messageContext for Message Service
    @wire(MessageContext)
    messageContext;
    // Subscribe to the message channel
    subscribeMC() {
        // local boatId must receive the recordId from the message
        if (this.subscription) {
            return;
        }
        // Subscribe to the message channel to retrieve the recordId and explicitly assign it to boatId.
        this.subscription = subscribe(this.messageContext, BOATMC, (message) => {
            this.boatId = message.recordId;
        }, { scope: APPLICATION_SCOPE });
    }

    // Calls subscribeMC()
    connectedCallback() { 
        this.subscribeMC();
    }

    // Navigates to record page
    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.boatId,
                actionName: 'view',
            },
        });
    }

    // Navigates back to the review list, and refreshes reviews component
    handleReviewCreated() { 
        this.template.querySelector('lightning-tabset').activeTabValue = this.label.labelReviews;
        this.template.querySelector('c-boat-reviews').refresh();
    }
}