import { Component, OnInit } from '@angular/core';
import { ContactEjsComponent } from './components/contact-ejs/contact-ejs.component';
import { ContactCasComponent } from './components/contact-cas/contact-cas.component';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-student-organizations',
    templateUrl: './student-organizations.page.html',
    styleUrls: ['./student-organizations.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        ContactCasComponent,
        ContactEjsComponent,
    ],
})
export class StudentOrganizationsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
