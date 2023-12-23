import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-update-modal',
    templateUrl: './update-modal.component.html',
    styleUrls: ['./update-modal.component.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class UpdateModalComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
