import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab-info.page.html',
  styleUrls: ['tab-info.page.scss'],
})
export class TabInfoPage {
  constructor() {}

  userData: any; // Save logged in user data
  firstName: string;

  ngOnInit() {}
}
