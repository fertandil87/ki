import { Component, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { Settings } from '../providers/settings';

@Injectable()
export class ChatService {
    private url = 'http://localhost:5000';
    private socket:any;
    private id: number;
    private token: string;
    private latitude: number;
    private longitude: number;

    constructor(public settings: Settings) {
        this.settings.load().then(() => {
            let user_data = this.settings.allSettings;
            console.log(this.settings);
            this.id = parseInt(user_data.id);
            this.token = user_data.token;
            this.latitude = parseFloat(user_data.latitude);
            this.longitude = parseFloat(user_data.longitude);
        });
    }

    private deg2rad(angle: number): number {
        return angle * .017453292519943295; // (angle / 180) * Math.PI;
    }

    private rad2deg(angle: number): number {
        return angle * 57.29577951308232; // angle / Math.PI * 180
    }

    public distance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string): any {
        var theta = lon1 - lon2;
        var dist = Math.sin(this.deg2rad(lat1)) * Math.sin(this.deg2rad(lat2)) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.cos(this.deg2rad(theta));
        dist = Math.acos(dist);
        dist = this.rad2deg(dist);
        var miles = dist * 60 * 1.1515;
        unit = unit.toUpperCase();
        if (miles < 1) {
            return {
                'distance': Math.round(miles * 1609.344),
                'unit': 'mts'
            };
        }
        if (unit == "K") {
            return {
                'distance': Math.round(miles * 1.609344 * 100) / 100,
                'unit': 'kms.'
            };
        } else {
            return {
                'distance': Math.round(miles * 100) / 100,
                'unit': 'mil.'
            };
        }
    }
    public getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
        var deg2Rad = deg => {
            return deg * Math.PI / 180;
        }

        var r = 6371; // Radius of the earth in km
        var dLat = deg2Rad(lat2 - lat1);
        var dLon = deg2Rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2Rad(lat1)) * Math.cos(deg2Rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = r * c; // Distance in km
        return d;
    }
    
    sendMessage(message:string, group?:string) {
        var data = {
            user: this.id,
            token: this.token,
            message: message,
            latitude: this.latitude,
            longitude: this.longitude
        }
        this.socket.emit('add-message', data);
    }

    getMessages(user_id:number, user_name:string, latitude: number, longitude: number):any {
        let observable = new Observable(observer => {
            this.socket = io(this.url);
            this.socket.emit('adduser', {id:user_id, name:user_name,group: 'general'});
            this.socket.on('message', (data) => {
                console.log(data);
                observer.next(data);
            });
            
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }
    
    getGroupMessages(user_id:number, user_name:string, group_id: string):any {
        let observable = new Observable(observer => {
            this.socket = io(this.url);
            this.socket.emit('adduser', {id:user_id, name:user_name,group: group_id});
            this.socket.on('message', (data) => {
                console.log(data);
                observer.next(data);
            });
            
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }
    
    joinGroup(id:string):any {
        this.socket.emit('switchRoom', id);
    }
}