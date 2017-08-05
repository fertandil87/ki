import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { GroupService } from '../../services/group.service';
import { Settings } from '../../providers/settings';
import { GroupChatPage } from '../group-chat/group-chat';

@Component({
    selector: 'page-groups-list',
    styleUrls: ['/pages/groups-list/groups-list.scss'],
    templateUrl: 'groups-list.html',
    providers: [GroupService]
})
export class GroupsListClosePage {
    public groupChatPage: any;
    public groups: any = [];
    private page: number = 0;
    private maxResults: number = 10;
    public showCreateButton: boolean = true;
    public shouldInfiniteScroll: boolean = false;

    constructor(public navCtrl: NavController,
        private groupService: GroupService,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        private settings: Settings) {
        this.groupChatPage = GroupChatPage;
        console.log(navParams.data.list)
    }

    ionViewWillEnter() {
        let settings = this.settings.allSettings;
        this.page = 0;
        this.groupService.getCloseGroups(settings.latitude, settings.longitude, settings.radius)
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
        this.groupService.getCloseGroups(settings.latitude, settings.longitude, settings.radius, this.page)
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
    
    openGroupOptions(group) {
        let actionSheet = this.actionSheetCtrl.create({
            title: group.name,
            buttons: [
                {
                    text: 'Entrar al grupo',
                    handler: () => {
                        this.navCtrl.push(this.groupChatPage, {id: group.id});
                    }
                }, {
                    text: 'Agregar a favoritos',
                    handler: () => {
//                        addFavourite(group);
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

}
