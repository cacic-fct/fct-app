import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoogleButtonComponent } from './components/google-button/google-button.component';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        GoogleButtonComponent,
        RouterLink,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonGrid,
        IonRow,
        IonCol
    ],
})
export class LoginPage implements OnInit {
    constructor() { }

    ngOnInit() { }
}
