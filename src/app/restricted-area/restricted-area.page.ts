import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-restricted-area',
    templateUrl: './restricted-area.page.html',
    styleUrls: ['./restricted-area.page.scss'],
    standalone: true,
    imports: [IonicModule, RouterLink],
})
export class RestrictedAreaPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
