public with sharing class ContactController {
    public ContactController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        // List<Contact> lstContacts;
        // try {
        //     lstContacts = [SELECT FirstName, LastName, Email FROM Contact LIMIT 100];
        // } catch (Exception e) {
        //     throw new AuraHandledException(e.getMessage());
        // }
        // return lstContacts;
        throw new AuraHandledException('Forced error');
    }
}
