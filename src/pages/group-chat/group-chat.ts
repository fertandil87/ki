import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NavController, NavParams } from 'ionic-angular';
import { ChatService } from '../../services/chat.service'
import { UserService } from '../../services/user.service';
import { Settings } from '../../providers/settings';
import { LocationTracker } from '../../providers/location-tracker';

declare var io: any;

@Component({
    selector: 'page-group-chat',
    templateUrl: 'group-chat.html',
    providers: [ChatService, UserService, DatePipe]
})
export class GroupChatPage implements OnInit, OnDestroy {
    private group_id:string;
    messages:any;
    chatBox: string;
    connection;

    ngOnInit() {
        this.locationTracker.startTracking();
        let settings = this.settings.allSettings;

//        this.userService.getGroupMessages()
//            .subscribe(response => {
//                console.log(response);
//                this.messages = response;
//            },
//            error => {
//                console.log(error);
//            });
        this.connection = this.chatService.getGroupMessages(settings.id, settings.email, this.group_id)
            .subscribe(data => {
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

                        } else {
                            newUser.photo = avatar;
                        }
                        this.messages.push(newUser);
                        console.log(this.messages);
                    }
                   
                }
            })
        this.chatService.joinGroup(this.group_id);
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
        this.locationTracker.stopTracking();
    }

    constructor(public navCtrl: NavController,
        private chatService: ChatService,
        private settings: Settings,
        navParams: NavParams,
        private userService: UserService,
        private datePipe: DatePipe,
        public locationTracker: LocationTracker) {
        this.messages = [];
        this.group_id = navParams.get('id');

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
            return secondAgo + " seg.";
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
