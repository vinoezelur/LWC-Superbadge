import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
export default class contactCreator extends LightningElement {
    objectApiName = CONTACT_OBJECT;
    fields = [FNAME_FIELD, LNAME_FIELD, EMAIL_FIELD];
    handleSuccess(event) {
        const toastEvent = new ShowToastEvent({
            title: "Contact created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }
}