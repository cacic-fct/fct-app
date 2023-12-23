import { Component, OnInit } from '@angular/core';
import { GlobalConstantsService } from '../shared/services/global-constants.service';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
    standalone: true,
    imports: [IonicModule, RouterLink],
})
export class AboutPage implements OnInit {
  globalConstants = GlobalConstantsService;

  constructor() {}

  ngOnInit() {}
}
