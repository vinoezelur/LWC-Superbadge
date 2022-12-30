import { LightningElement, api } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c'
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name'
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c'

const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    boatId;
    rating;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField = NAME_FIELD;
    commentField = COMMENT_FIELD;
    labelSubject = 'Review Subject';
    labelRating = 'Rating';

    // Public Getter and Setter to allow for logic to run on recordId change
    get recordId() { 
        return this.boatId;
    }
    @api set recordId(value) {
        console.log(' set rec id == ' + value);
        //sets boatId attribute
        this.boatId = value;
        //sets boatId assignment
        console.log(' set rec id == ' + this.boatId);
    }

    // Gets user rating input from stars component
    handleRatingChanged(event) { 
        console.log('det : ' + JSON.stringify(event, null, 2));
        this.rating = event.detail.rating;

    }

    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) { 
        console.log('in save: ' + this.boatId + ' -');
        event.preventDefault();       // stop the form from submitting
        let fields = event.detail.fields;
        fields.Boat__c = this.boatId;
        fields.Rating__c = this.rating ? this.rating : 0;
        console.log(' form data : ' + JSON.stringify(fields, null, 2));
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
        console.log('in success save');

        // TODO: dispatch the custom event and show the success message
        this.dispatchEvent(new ShowToastEvent({
            title: SUCCESS_TITLE,
            variant: SUCCESS_VARIANT
        }));
        this.dispatchEvent(new CustomEvent('createreview'));
        this.handleReset();
    }

    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    handleReset() { 
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}