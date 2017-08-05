import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { MainPage } from '../main/main';
import { ForgotPage } from '../forgot/forgot';
import { RegisterPage } from '../register/register';
import { NgForm }   from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Settings } from '../../providers/settings';

@Component({
    selector: 'login',
    templateUrl: 'login.html',
    providers: [UserService]
})
export class LoginPage {

    forgotPage:any;
    registerPage:any;
    login: {username: string, password: string} = {
        username: 'fertandil87@gmail.com',
        password: '123456'
    };
    loader:any;
    
    constructor(public navCtrl: NavController, 
    private userService: UserService,
       public loadingCtrl: LoadingController, 
       public settings: Settings,
       public toastCtrl: ToastController ) {
       this.forgotPage = ForgotPage;
       this.registerPage = RegisterPage;
    }
    
    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "Espere por favor..."
        });
        this.loader.present();
    }
    
    handleLogin (form:NgForm, login:any) {
        console.log("try to login");
        console.log(form);
        console.log(login);
        if (form.valid && login.username !== '' && login.password !== '') {
            this.presentLoading();
            this.userService.login(login.username, login.password)
            .subscribe(response => {
                console.log(response);
                let data = response;
                this.loader.dismissAll();
                if (!data.success) {
                    console.log('Your login failed');
                } else {
                    console.log(this.settings.setAll(data.user));
                    this.navCtrl.setRoot(MainPage);
                    let toast = this.toastCtrl.create({
                        message: 'Bienvenido ' + data.user.username,
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
//                    this.dataService.setSavedGroups(data.user.saved_groups);
//                    this.dataService.setOwnerGroups(data.user.owner_groups);
                }
            },
            error => {
                console.log(error);
                this.loader.dismissAll();
            });

        } else {
            console.log("invalid login form");
        }

    };


}
