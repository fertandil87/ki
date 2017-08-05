import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { LoadingController } from 'ionic-angular';

@Component({
    selector: 'register',
    templateUrl: 'register.html',
    providers: [UserService, DataService]
})
export class RegisterPage {

    register = {
        email: 'fertandil872@gmail.com',
        username: 'fer2',
        password: '123456',
        repassword: '123456'

    }
    
    usernameFormat = '[a-zA-Z0-9]+$';
    result: any = {};
    loader:any;
        
    constructor(public navCtrl: NavController, private userService: UserService,
        public loadingCtrl: LoadingController) {
    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Espere por favor..."
        });
        this.loader.present();
    }

    handleRegister(form: NgForm, register: any) {
        if (form.valid && register.password === register.repassword) {
            this.presentLoading();
            this.userService.register(register.username, register.email, register.password)
                .then(response => {
                    console.log('esta es la respuesta');
                    console.log(response);
                    if (!response) {
                        console.log('Your login failed');
                    } else {
                        window.localStorage["username"] = register.username;
                        window.localStorage["password"] = register.password;
                        console.log('Your login success');
                        //                    $location.path('autologin');
                    }
                    this.loader.dismissAll();
                    
                });
        } else {
            console.log("invalid login form");
        }

    };


}
