import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoogleButtonComponent } from './components/google-button/google-button.component';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        GoogleButtonComponent,
        RouterLink,
    ],
})
export class LoginPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
