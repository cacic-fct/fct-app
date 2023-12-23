import { Component } from '@angular/core';
import { ServiceWorkerService } from 'src/app/shared/services/service-worker/service-worker.service';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class AppComponent {
  constructor(private swService: ServiceWorkerService) {}
}
