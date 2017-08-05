import { Component } from '@angular/core';

import { LoginPage } from '../login/login';

import { NavController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { Storage } from '@ionic/storage';
import { App } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Settings } from '../../providers/settings';

@Component({
    selector: 'page-account',
    templateUrl: 'account.html',
    providers: [UserService, DataService]
})
export class AccountPage {
    private result: any = {};
    private config: any = {};
    private loader: any;
    public passwordFormat = '[a-zA-Z0-9]+$';

    constructor(public navCtrl: NavController, private userService: UserService,
        private dataService: DataService, private storage: Storage, private app: App,
        public loadingCtrl: LoadingController, private settings: Settings) {
        this.config.distanceType = 'km';
        this.config.radius = 1000;
    }

    ionViewWillEnter() {
        let settings = this.settings.allSettings;

        this.userService.getUserData(settings.id, settings.token)
            .subscribe(response => {
                console.log(response);
                if (!response.success) {
                    //                            this.logout();
                } else {
                    this.config = {
                        name: response.user.name,
                        username: response.user.username,
                        radius: response.user.radius,
                        email: response.user.email,
                        joingroups: response.user.join_groups,
                        password: '',
                        repassword: ''
                    }
                }
            },
            error => {
                console.log(error);
            });

    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Espere por favor..."
        });
        this.loader.present();
    }

    updateData(form: NgForm, config: any) {
        let settings = this.settings.allSettings;
        if (form.valid && config.password === config.repassword) {

            this.presentLoading();
            this.userService.update(
                settings.id,
                settings.token,
                config.name,
                config.radius,
                config.joingroups,
                config.email,
                config.password)
                .subscribe(response => {
                    console.log('esta es la respuesta');
                    console.log(response);
                    if (!response.success) {
                        console.log('Your update failed');
                    } else {
                        this.loader.setContent('Actualizado.');
                        for (let i in response.user) {
                            this.dataService.setValue(i, response.user[i]);
                        }
                        this.config.password = this.config.repassword = "";
                        setTimeout(() => {
                            this.loader.dismissAll();
                        }, 2000);
                        console.log('updated');
                        //                    $location.path('autologin');
                    }
                    this.loader.dismissAll();
                },
                error => {
                    console.log(error);
                });


        } else {
            console.log("invalid update form");
        }

    };

    logout() {
        this.storage.clear();
        this.app.getRootNav().setRoot(LoginPage);
    };

}
