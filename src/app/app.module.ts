import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ForgotPage } from '../pages/forgot/forgot';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { HomePage } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
import { GroupsPage } from '../pages/groups/groups';
import { GroupChatPage } from '../pages/group-chat/group-chat';
import { GroupsListFavouritePage } from '../pages/groups-list/groups-list-favourite';
import { GroupNewPage } from '../pages/group-new/group-new';
import { GroupsListClosePage } from '../pages/groups-list/groups-list-close';
import { GroupsListOwnPage } from '../pages/groups-list/groups-list-own';
import { ContactPage } from '../pages/contact/contact';
import { AboutPage } from '../pages/about/about';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { DataService } from '../services/data.service';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationTracker } from '../providers/location-tracker';
import { Settings } from '../providers/settings';
import { ChatService } from '../services/chat.service';

let pages = [
    MyApp,
    LoginPage,
    RegisterPage,
    ForgotPage,
    MainPage,
    HomePage,
    AboutPage,
    ContactPage,
    AccountPage,
    GroupsPage, GroupsListFavouritePage, GroupsListClosePage, GroupsListOwnPage, GroupNewPage, GroupChatPage,
];

export function declarations() {
    return pages;
}

export function entryComponents() {
    return pages;
}

export function provideSettings(storage: Storage) {
    /**
     * The Settings provider takes a set of default settings for your app.
     *
     * You can add new settings options at any time. Once the settings are saved,
     * these values will not overwrite the saved values (this can be done manually if desired).
     */
    return new Settings(storage, {
        option1: true,
        option2: 'Ionitron J. Framework',
        option3: '3',
        option4: 'Hello'
    });
}

export function providers() {
    return [
        LocationTracker,
        DataService,
        BackgroundGeolocation,
        Geolocation,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        { provide: Settings, useFactory: provideSettings, deps: [Storage] },
        {
            provide: 'URLS', useValue: {
                serviceUrl: 'http://localhost:5000/',
                wsUrl: "ws://192.168.1.109:8080",
                restApiPostPath: 'post/',
                restApiUserPath: 'user/',
                restApiGroupPath: 'group/'
            }
        },
        {
            provide: 'AUTH', useValue: {
                restApiCredentials: 'cmVzdGFwaTpNb2JpbGUh'
            }
        },
        {
            provide: 'ANALYTICS', useValue: {
                enable: true,
                analyticsCode: 'UA-3777777-59',
                domain: 'geochat.com'
            }
        },
    ];
}

@NgModule({
    declarations: declarations(),
    imports: [
        IonicModule.forRoot(MyApp, {
            tabsPlacement: 'top',
            ios: {
                tabsPlacement: 'top',
            },
            android: {
                tabsPlacement: 'top',
            },
            windows: {
                tabsPlacement: 'top',
            }
        },
//        {
//            links: [
//                { component: MainPage, name:'Tabs', segment:'main'},
//                { component: AccountPage, name:'Settings', segment:''},
//                { component: HomePage, name:'Main Chat', segment:''},
//                { component: GroupsPage, name:'Groups', segment:'groups'},
//                { component: GroupsListClosePage, name:'Close Groups', segment:''},
//                { component: GroupsListFavouritePage, name:'Favourite Groups', segment:''},
//                { component: GroupChatPage, name:'Group Chat', segment:'group/:id', defaultHistory:[GroupsListClosePage]},
//            ]
//        }
        ),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: entryComponents(),
    providers: providers()
})
export class AppModule { }
