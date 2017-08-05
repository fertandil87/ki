import { Component } from '@angular/core';

import { GroupsListClosePage } from '../groups-list/groups-list-close';
import { GroupsListOwnPage } from '../groups-list/groups-list-own';
import { GroupsListFavouritePage } from '../groups-list/groups-list-favourite';

@Component({
  templateUrl: 'groups.html'
})
export class GroupsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  groupListTabClose: any = GroupsListClosePage;
  groupListTabFavourite: any = GroupsListFavouritePage;
  groupListTabOwn: any = GroupsListOwnPage;

  constructor() {

  }
}
