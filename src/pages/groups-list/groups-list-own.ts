import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GroupService } from '../../services/group.service';
import { Settings } from '../../providers/settings';
import { GroupNewPage } from '../group-new/group-new';

@Component({
    selector: 'page-groups-list',
    styleUrls: ['/pages/groups-list/groups-list.scss'],
    templateUrl: 'groups-list.html',
    providers: [GroupService]
})

export class GroupsListOwnPage {
    public groups: any = [];
    public showCreateButton: boolean = true;
    public newGroupPage: any;
    private page: number = 0;
    private maxResults: number = 10;
    public shouldInfiniteScroll: boolean = false;

    constructor(public navCtrl: NavController,
        private groupService: GroupService,
        navParams: NavParams,
        public settings: Settings) {
        this.newGroupPage = GroupNewPage;
    }

    ionViewWillEnter() {
        let settings = this.settings.allSettings;
        this.page = 0;
        this.groupService.getMyGroups(settings.id, settings.token, this.page)
            .subscribe(response => {
                console.log(response);
                this.groups = response;
                if (this.groups < this.maxResults){
                    this.shouldInfiniteScroll = false;
                }else{
                    this.shouldInfiniteScroll = true;
                }
            },
            error => {
                console.log(error);
            });
    }
    
    doInfinite(infiniteScroll) {
        let settings = this.settings.allSettings;
        this.page++;
        this.groupService.getMyGroups(settings.id, settings.token, this.page)
            .subscribe(response => {
                for (let group of response) {
                    this.groups.push(group);
                }
                console.log(this.groups);
                if (response.lenght === 0 || response.length < this.maxResults) {
                    infiniteScroll.enable(false);
                }
                infiniteScroll.complete();
            },
            error => {
                console.log(error);
            });
       

    }

}
