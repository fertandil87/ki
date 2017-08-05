import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { User } from '../classes/user';
import './rxjs-operators';

@Injectable()
export class UserService {

    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: Http, @Inject('URLS') private URLS: any) {
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    public login(user: string, pass: string): any {

        return this.http.post(this.URLS.serviceUrl + this.URLS.restApiUserPath + 'login',
            JSON.stringify({
                username: user,
                password: pass
            }),
            { headers: this.headers }
        )
            .map(response => response.json());

        //            .catch(this.handleError);
    }

    public getUserData(id: string, token: string): any {

        return this.http.post(this.URLS.serviceUrl + this.URLS.restApiUserPath + 'get',
            JSON.stringify({
                id: id,
                token: token
            }),
            { headers: this.headers }
        )
            .map(response => response.json());
    }

    public getMessages(latitude: number, longitude: number): any {

        return this.http.post(this.URLS.serviceUrl + this.URLS.restApiPostPath + 'fetch',
            JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                radius: 500,
                joingroups: true
            }),
            { headers: this.headers }
        )
            .map(response => response.json());
    }
    
    public getGroupMessages(id:number): any {

        return this.http.post(this.URLS.serviceUrl + this.URLS.restApiPostPath + 'fetch',
            JSON.stringify({
                id: id,
                radius: 500,
                joingroups: true
            }),
            { headers: this.headers }
        )
            .map(response => response.json());
    }

    public register(username: string, email: string, password: string): Promise<User> {
        return this.http.post(this.URLS.serviceUrl + this.URLS.restApiUserPath + 'register',
            JSON.stringify({
                latitude: window.localStorage["latitude"],
                longitude: window.localStorage["longitude"],
                username: username,
                email: email,
                password: password,
                repassword: password
            }), { headers: this.headers })
            .toPromise()
            .then(response => {
                let data = response.json()
                if (data.success) {
                    return data.user;
                }
            })
            .catch(this.handleError);
    }

    public update(id: number, token: string, name: string, radius: number,
        joingroups: boolean, email: string, password: string): any {
        return this.http.post(this.URLS.serviceUrl + this.URLS.restApiUserPath + 'update',
            JSON.stringify({
                id: id,
                token: token,
                name: name,
                email: email,
                radius: radius,
                password: password,
                joingroups: joingroups
            }), { headers: this.headers })
            .map(response => response.json());
    }
}
