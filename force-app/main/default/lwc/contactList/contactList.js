import { LightningElement, wire } from 'lwc';
import FNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import { reduceErrors } from 'c/ldsUtils';

const COLUMNS = [
    { label: 'First Name', fieldName: FNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Last Name', fieldName: LNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Email', fieldName: EMAIL_FIELD.fieldApiName, type: 'text' }
];

export default class ContactList extends LightningElement {
    columns = COLUMNS;
    //errors;

    @wire(getContacts) 
    contactsList;
    
    get errors() {
        //alert(JSON.stringify(this.errors));
        return reduceErrors(this.contactsList.error);
    }
}