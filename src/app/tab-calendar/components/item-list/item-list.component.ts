import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstantsService } from 'src/app/shared/services/global-constants.service';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {
  courses = GlobalConstantsService.courses;
  @Input() items: Observable<any[]>;

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  public openItem(item: any): void {
    this.navCtrl.navigateForward(['calendario/evento', item.id], {
      state: { item: item },
    });
  }

  // Unix timestamp to date
  unixToDate(unix: number): Date {
    return new Date(unix * 1000);
  }
}
