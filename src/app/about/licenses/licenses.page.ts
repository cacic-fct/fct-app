import { Component, OnInit } from '@angular/core';
import { DisplayLicensesComponent } from './display-licenses/display-licenses.component';
import { MarkdownModule } from 'ngx-markdown';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-licenses',
    templateUrl: './licenses.html',
    styleUrls: ['./licenses.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        MarkdownModule,
        DisplayLicensesComponent,
    ],
})
export class LicensesPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
