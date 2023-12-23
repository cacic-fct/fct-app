import { Component } from '@angular/core';
import { ServiceWorkerService } from 'src/app/shared/services/service-worker/service-worker.service';
import { IonApp, IonRouterOutlet } from "@ionic/angular/standalone";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
    constructor(private swService: ServiceWorkerService) { }
}
