import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers/settings';
import { GroupService } from '../../services/group.service';
import { AboutPage } from '../about/about';

@Component({
    selector: 'page-new-group',
    templateUrl: 'group-new.html',
    providers: [GroupService]
})
export class GroupNewPage {

    passwordFormat = '[a-zA-Z0-9]+$';
    public group: any = {
        position: 'actual',
        access: 'public',
        radius: 300
    };
    result: any = {};

    constructor(public groupService: GroupService, 
        public settings: Settings,
        public navCtrl: NavController) {
    }

    handleCreateGroup(form, group) {
        console.log(form);
        if (form.valid) {
            let settings = this.settings.allSettings;

            this.groupService.create(settings.id, settings.token, settings.latitude, settings.longitude, group.radius,
                group.name, group.access, group.password)
                .subscribe(response => {
                    console.log(response);
                    let data = response;
                    if (!data.success) {

                    } else {
                        this.navCtrl.pop();
                    }
                },
                error => {
                    console.log(error);
                });
        }
    };
}
