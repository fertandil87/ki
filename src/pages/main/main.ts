import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AccountPage } from '../account/account';
import { GroupsPage } from '../groups/groups';

@Component({
    selector: 'main-page',
    templateUrl: 'main.html'
})
export class MainPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    general: any = HomePage;
    groups: any = GroupsPage;
    account: any = AccountPage;

    constructor() {

    }
}
