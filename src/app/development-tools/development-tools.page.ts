import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-development-tools',
    templateUrl: './development-tools.page.html',
    styleUrls: ['./development-tools.page.scss'],
    standalone: true,
    imports: [IonicModule, RouterLink],
})
export class DevelopmentToolsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
