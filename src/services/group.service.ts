import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { User } from '../classes/user';
import './rxjs-operators';

@Injectable()
export class GroupService {

    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: Http, @Inject('URLS') private URLS: any) {
    }


    public getCloseGroups(latitude:number, longitude:number, radius:number, page?:number): any {

        return this.http.post(this.URLS.serviceUrl + this.URLS.restApiGroupPath + 'list',
            JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                radius: radius,
                page: page
            }),
            { headers: this.headers }
        )
            .map(response => response.json());
    }
    
    public getMyGroups(id:number, token:string, page?:number): any {

        return this.http.post(this.URLS.serviceUrl + this.URLS.restApiGroupPath + 'created',
            JSON.stringify({
                user: id,
                token: token,
                page: page
            }),
            { headers: this.headers }
        )
            .map(response => response.json());
    }
    
    public getFavouriteGroups(id:number, token:string, page?:number): any {

        return this.http.post(this.URLS.serviceUrl + this.URLS.restApiGroupPath + 'favourite',
            JSON.stringify({
                user: id,
                token: token,
                page: page
            }),
            { headers: this.headers }
        )
            .map(response => response.json());
    }
    
    public create(user:number, token:string, latitude:number, longitude:number, 
        radius:number, name:string, access, password:string): any {

        return this.http.post(this.URLS.serviceUrl + this.URLS.restApiGroupPath + 'new',
            JSON.stringify({
                user: user,
                token: token,
                latitude: latitude,
                longitude: longitude,
                radius: radius,
                name: name,
                access: access,
                password: password
            }),
            { headers: this.headers }
        )
            .map(response => response.json());
    }

}
