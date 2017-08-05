import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { GroupNewPage } from '../pages/group-new/group-new';
import { AccountPage } from '../pages/account/account';
import { Settings } from '../providers/settings';

@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>`,
    providers: [StatusBar, SplashScreen]
})
export class MyApp {
    rootPage: any;

    constructor(platform: Platform, settings: Settings, private statusBar: StatusBar,
        private splashScreen: SplashScreen) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            settings.load().then(() => {
                let options = settings.allSettings;
                console.log(options);
                if (options.id && options.token) {
                    this.rootPage = MainPage;
                } else {
                    this.rootPage = LoginPage;
                }
            });
            
        });
    }
}
