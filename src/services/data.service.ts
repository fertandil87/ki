import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../classes/user';

@Injectable()
export class DataService {

    constructor(public storage: Storage) {
    }

    public setValue(field: string, value: any): void {
        this.storage.set(field, JSON.stringify(value));
    }

    /**
     * Devuelve una promisa para traer un valor de la base de datos local
     */
    public getValue(field: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.get(field).then((value) => {
                resolve(JSON.parse(value));
            });
        });

    }

    public getValues(keys: Array<string>): any {
        let promises: Array<Promise<any>> = [];
        for (let i = 0; i < keys.length; i++) {
            promises.push(this.getValue(keys[i]));
        }
        return Promise.all(promises);
    }

    public setToken(token): void {
        this.setValue('token', token)
    }
    
    public setLatitude(lat): void {
        this.setValue('latitude', lat)
    }
    
    public setLongitude(lon): void {
        this.setValue('longitude', lon)
    }
    
    public getToken(): Promise<string> {
        return this.getValue('token');
    }

//    public setSavedGroups(groups: Array<any>): void {
//        this.setValue('saved_groups', groups);
//    }
//
//    public getSavedGroups(): Array<any> {
//        return this.getValue('saved_groups');
//    }
//
//    public addSavedGroup(group: any): void {
//        var groups = this.getSavedGroups();
//        if (!groups.some(function(id) {
//            return id == group;
//        })) {
//            groups.push(group);
//        }
//        this.setSavedGroups(groups);
//    }

    //                removeSavedGroup: function (group) {
    //                    var groups = this.getSavedGroups();
    //                    if (groups.some(function (id) {
    //                        return id == group;
    //                    })) {
    //                        groups.splice(groups.indexOf(group), 1);
    //                    }
    //                    this.setSavedGroups(groups);
    //                },
//    public setOwnerGroups(groups: any): void {
//        this.setValue('owner_groups', groups);
//    }
//
//    public getOwnerGroups(): Promise<any> {
//        return this.getValue('owner_groups');
//    }

    //                addOwnerGroup: function (group) {
    //                    var groups = this.getOwnerGroups();
    //                    if (!groups.some(function (id) {
    //                        return id == group;
    //                    })) {
    //                        groups.push(group);
    //                    }
    //                    this.setOwnerGroups(groups);
    //                },
    //                removeOwnerGroup: function (group) {
    //                    var groups = this.getOwnerGroups();
    //                    if (groups.some(function (id) {
    //                        return id == group;
    //                    })) {
    //                        groups.splice(groups.indexOf(group), 1);
    //                    }
    //                    this.setOwnerGroups(groups);
    //                }
}