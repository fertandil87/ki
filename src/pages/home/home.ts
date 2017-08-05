import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NavController } from 'ionic-angular';
import { ChatService } from '../../services/chat.service'
import { UserService } from '../../services/user.service';
import { Settings } from '../../providers/settings';
import { LocationTracker } from '../../providers/location-tracker';

declare var io: any;

@Component({
    selector: 'page-chat',
    templateUrl: 'home.html',
    providers: [ChatService, UserService, DatePipe]
})
export class HomePage implements OnInit, OnDestroy {

    messages:any;
    chatBox: string;
    connection:any;
    missingLocation:boolean = true;

    ngOnInit() {
        this.locationTracker.startTracking();
        this.settings.load().then(() => {
            let settings = this.settings.allSettings;

            this.missingLocation = !(settings.latitude && settings.longitude);
            
//            Don't get old messages
//            this.userService.getMessages(settings.latitude, settings.longitude)
//                .subscribe(response => {
//                    console.log(response);
//                    this.messages = response;
//                },
//                error => {
//                    console.log(error);
//                });
            
            this.connection = this.chatService.getMessages(settings.id, settings.name || settings.email, settings.latitude, settings.longitude)
                .subscribe(response => {
                    let data = response.message;
                    let user = response.user;
                    console.log(data);
                    if (data.user && data.message) {
                        if (this.messages && this.messages.length && this.messages[this.messages.length - 1].id === data.user.id) {
                            //agrego mensaje al ultimo mensaje del usuario
                            this.messages[this.messages.length - 1].messages.push({
                                text: data.message.text,
                                date: data.message.date,
                                distance: this.chatService.getDistanceFromLatLonInKm(settings.latitude, settings.longitude, data.message.latitude, data.message.longitude),
                                latitude: data.message.latitude,
                                longitude: data.message.longitude,
                                id: data.message.id
                            });
                            console.log(this.messages);
                        } else {
                            //agrego nuevo usuario
                            let newUser = {
                                id: data.user.id,
                                name: data.user.name,
                                photo: null,
                                messages: [
                                    {
                                        text: data.message.text,
                                        date: data.message.date,
                                        distance: this.chatService.getDistanceFromLatLonInKm(settings.latitude, settings.longitude, data.message.latitude, data.message.longitude),
                                        latitude: data.message.latitude,
                                        longitude: data.message.longitude,
                                        id: data.message.id
                                    }
                                ]
                            };
                            let avatar = null //Avatar.getUpdatedAvatar(data.user.id, data.user.updated);
                            if (!avatar) {
                                //                                    $http({
                                //                                        method: 'POST',
                                //                                        url: URLS.serviceUrl + URLS.restApiUserPath + 'get-photo',
                                //                                        data: SerializeData({
                                //                                            user: data.user.id
                                //                                        }),
                                //                                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request data)
                                //                                    }).success(function(data) {
                                //                                        if (data.photo) {
                                //                                            Avatar.setProfileAvatar(data.user.id, data.photo, data.updated)
                                //                                            newUser.photo = avatar;
                                //                                        }
                                //
                                //                                        this.messages.push(newUser);
                                //                                    });
                            } else {
                                newUser.photo = avatar;
                            }
                            this.messages.push(newUser);
                            console.log(this.messages);
                        }
                        //                            $location.hash('theBottom');
                        //                            $ionicScrollDelegate.anchorScroll();
                    }
                })
        });
    }

    ngOnDestroy() {
//        this.connection.unsubscribe();
        console.log('unsuscribe');
//        this.locationTracker.stopTracking();
    }

    constructor(public navCtrl: NavController,
        private settings: Settings,
        private chatService: ChatService,
        private userService: UserService,
        private datePipe: DatePipe,
        public locationTracker: LocationTracker) {
        

        this.messages = [];
        this.chatBox = "";
    }

    sendMessage() {
        this.chatService.sendMessage(this.chatBox);
        this.chatBox = '';
    }

    timeAgo(date: number) {
        let time = new Date().getTime();
        let secondAgo = Math.floor((time - date) / 1000);
        if (secondAgo <= 60) {
            return "hace segundos";
        } else if (secondAgo <= 60 * 60) {
            return Math.round(secondAgo / 60) + " min.";
        } else if (secondAgo <= 60 * 60 * 24) {
            return Math.round(secondAgo / 60 / 60) + " horas";
        } else if (secondAgo <= 60 * 60 * 24 * 60) {
            return Math.round(secondAgo / 60 / 60 / 24) + " dias";
        } else {
            return this.datePipe.transform(date, 'd/M/yyyy');
        }
    };

}
