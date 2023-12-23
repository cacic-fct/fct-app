// @ts-strict-ignore
import { Component, inject, OnInit } from '@angular/core';

import { CoursesService } from '../../../shared/services/courses.service';

import { ToastController } from '@ionic/angular/standalone';

import { ActivatedRoute, Router } from '@angular/router';

import { EventItem } from '../../../shared/services/event';
import { take, Observable, map } from 'rxjs';
import { trace } from '@angular/fire/compat/performance';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Analytics, logEvent } from '@angular/fire/analytics';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonProgressBar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-event-info-display',
  templateUrl: './event-info-display.page.html',
  styleUrls: ['./event-info-display.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonIcon, IonContent, IonProgressBar],
})
export class EventInfoDisplayPage implements OnInit {
  private analytics: Analytics = inject(Analytics);
  courses = CoursesService.courses;
  item: EventItem;
  item$: Observable<EventItem>;
  eventID: string;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.eventID = this.route.snapshot.params.eventID;
    this.item$ = this.afs
      .doc<EventItem>(`events/${this.eventID}`)
      .valueChanges({ idField: 'id' })
      .pipe(trace('firestore'));
  }

  async presentToastShare() {
    const toast = await this.toastController.create({
      header: 'Compartilhar evento',
      message: 'Link copiado para a área de transferência.',
      icon: 'copy',
      position: 'bottom',
      duration: 2000,
      buttons: [
        {
          side: 'end',
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    navigator.clipboard.writeText('https://fct-pp.web.app' + this.router.url);
    toast.present();

    logEvent(this.analytics, 'share', {
      content_type: 'event',
      item_id: this.eventID,
    });
  }
}
