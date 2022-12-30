import { LightningElement, wire, api } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
    @api boatTypeId;
    mapMarkers = [];
    isLoading = true;
    isRendered;
    latitude;
    longitude;

    // Add the wired method from the Apex Class
    // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
    // Handle the result and calls createMapMarkers
    @wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId' })
    wiredBoatsJSON({ error, data }) {

        if (data) {
            this.isLoading = true;
            this.createMapMarkers(JSON.parse(data));

        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: ERROR_TITLE,
                    message: error.body.message,
                    variant: ERROR_VARIANT
                })
            );
            // this.isLoading = false;
        }
    }

    // Controls the isRendered property
    // Calls getLocationFromBrowser()
    renderedCallback() { 
        if (!this.isRendered){
            this.getLocationFromBrowser();
            this.isRendered = true;
        }
    }

    // Gets the location from the Browser
    // position => {latitude and longitude}
    getLocationFromBrowser() { 
        navigator.geolocation.getCurrentPosition(
            position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            },
            (error) => { }
        );
        // navigator.geolocation.getCurrentPosition((position) => {
        //     console.log(' browser geo : ' + position + ' -- ' + JSON.stringify(position, null, 2));
        //     this.latitude = position.coords.latitude;
        //     this.longitude = position.coords.longitude;
        //     this.isLoading = false;
        // }, () => {
        //     console.log(ERROR_TITLE);
        // })
        console.log('lat = ' + this.latitude + ' long = ' + this.longitude);
        this.latitude = 50.92399;
        this.longitude = 33.91518;
        console.log('lat = ' + this.latitude + ' long = ' + this.longitude);
    }

    // Creates the map markers
    createMapMarkers(boatData) {
        const newMarkers = boatData.map(boat => ({
            location: {
                Latitude: boat.Geolocation__Latitude__s,
                Longitude: boat.Geolocation__Longitude__s
            },
            title: boat.Name,
        }));
        newMarkers.unshift({
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude
            },
            title: LABEL_YOU_ARE_HERE,
            icon: ICON_STANDARD_USER
        });
        // console.log(' mapmarkers ' + JSON.stringify(newMarkers, null, 2));
        this.mapMarkers = newMarkers;
        this.isLoading = false;
    }
}