import { Component, Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { Settings } from '../providers/settings';
import 'rxjs/add/operator/filter';
/*
  Generated class for the LocationTracker provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()

export class LocationTracker {
    public watch: any;
    public lat: number = 0;
    public lng: number = 0;

    constructor(public zone: NgZone, public platform: Platform, public settings: Settings,
        private backgroundGeolocation: BackgroundGeolocation, private geolocation: Geolocation) {

    }

    startTracking() {
        // Foreground Tracking

        let options = {
            frequency: 3000,
            enableHighAccuracy: true
        };

        this.watch = this.geolocation.watchPosition(options);
        this.watch.filter((p: any) => p.code === undefined)
            .subscribe((position: Geoposition) => {

                console.log(position);

                // Run update inside of Angular's zone
                this.zone.run(() => {
                    this.settings.setLatitude(position.coords.latitude);
                    this.settings.setLongitude(position.coords.longitude);
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;
                });

            });

        // Background Tracking
        if (this.platform.is('ios') || this.platform.is('android')) {
            let config = {
                desiredAccuracy: 0,
                stationaryRadius: 20,
                distanceFilter: 10,
                debug: true,
                interval: 2000
            };
            
            this.backgroundGeolocation.configure(config)
              .subscribe((location: BackgroundGeolocationResponse) => {

                console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

                // Run update inside of Angular's zone
                this.zone.run(() => {
//                    this.settings.setLatitude(location.latitude);
//                    this.settings.setLongitude(location.longitude);
                    this.lat = location.latitude;
                    this.lng = location.longitude;
                });

                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
//                this.backgroundGeolocation.finish(); // FOR IOS ONLY

              });
            

            // Turn ON the background-geolocation system.
            this.backgroundGeolocation.start();
        }

    }

    stopTracking() {
        console.log('stopTracking');
        this.watch.unsubscribe();
        if (this.platform.is('ios') || this.platform.is('android')) {
            this.backgroundGeolocation.finish();
        }

    }

}
