import { ToastController, AlertController } from '@ionic/angular/standalone';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { take, map, Observable } from 'rxjs';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { EventItem } from 'src/app/shared/services/event';
import { User } from 'src/app/shared/services/user';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Timestamp } from '@angular/fire/firestore';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DateService } from 'src/app/shared/services/date.service';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonProgressBar,
  IonIcon,
} from '@ionic/angular/standalone';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { filterNullish } from 'src/app/shared/services/rxjs.service';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';

interface Attendance {
  user: Observable<User>;
  time: Timestamp;
  source?: 'online' | 'scanner' | 'manual';
  id?: string;
}

@UntilDestroy()
@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonText,
    IonProgressBar,
    IonIcon,
    SweetAlert2Module,
    DatePipe,
    DecimalPipe,
    AsyncPipe,
  ],
})
export class ListPage {
  @ViewChild('mySwal')
  private mySwal!: SwalComponent;

  attendanceCollection$: Observable<Attendance[]>;
  eventID: string;
  event$: Observable<EventItem | undefined>;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    public courses: CoursesService,
    private toastController: ToastController,
    private alertController: AlertController,
    public dateService: DateService,
  ) {
    this.eventID = this.route.snapshot.params['eventID'];
    this.afs
      .collection('events')
      .doc(this.eventID)
      .get()
      .pipe(untilDestroyed(this), trace('firestore'))
      .subscribe((document) => {
        if (!document.exists) {
          this.mySwal.fire();
          setTimeout(() => {
            this.router.navigate(['area-restrita/gerenciar-eventos']);
            this.mySwal.close();
          }, 1000);
        }
      });

    this.event$ = this.afs.collection('events').doc<EventItem>(this.eventID).valueChanges();

    this.attendanceCollection$ = this.afs
      .collection<Attendance>(`events/${this.eventID}/attendance`, (ref) => {
        return ref.orderBy('time', 'desc');
      })
      .valueChanges({ idField: 'id' })
      .pipe(
        untilDestroyed(this),
        trace('firestore'),
        map((attendance) => {
          return attendance.map((item) => {
            return {
              ...item,
              user: this.afs.collection('users').doc<User>(item.id).valueChanges().pipe(filterNullish(), take(1)),
            };
          });
        }),
      );

    addIcons({
      checkmarkCircleOutline,
    });
  }

  deleteAttendance(attendanceID: string) {
    this.afs
      .collection(`events/${this.eventID}/attendance`)
      .doc(attendanceID)
      .delete()
      .then(() => {
        this.deletedToast();
      });
  }

  async deleteAlert(attendanceID: string, username: string) {
    const alert = await this.alertController.create({
      header: 'Tem certeza que deseja remover essa presença?',
      message: username,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sim',
          role: 'confirm',
          handler: () => {
            this.deleteAttendance(attendanceID);
          },
        },
      ],
    });

    alert.present();
  }

  async deletedToast() {
    const toast = await this.toastController.create({
      message: 'Presença removida',
      duration: 2000,
      icon: 'checkmark-circle-outline',
      buttons: [
        {
          side: 'end',
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  generateCSV() {
    this.afs
      .collection<User>('users')
      .valueChanges({ idfield: 'id' })
      .pipe(take(1), trace('firestore'))
      .subscribe((users) => {
        const csv: (string | undefined)[][] = [];
        const headers = [
          'UID',
          'Nome da conta Google',
          'Nome completo',
          'Vínculo com a Unesp',
          'RA',
          'Email',
          'Data_locale',
          'Data_iso',
        ];
        csv.push(headers);
        this.attendanceCollection$.pipe(take(1)).subscribe((attendanceCol) => {
          attendanceCol.forEach((attendance) => {
            const user = users.find((user) => user.uid === attendance.id);

            if (!user) {
              const row = [attendance.id, 'Usuário não encontrado'];
              csv.push(row);
              return;
            }

            const row = [
              user.uid,
              user.displayName,
              user.fullName || '',
              user.associateStatus || '',
              user.academicID || 'Sem RA cadastrado',
              user.email,

              this.dateService
                .getDateFromTimestamp(attendance.time)
                .toLocaleString('pt-BR', {
                  timeZone: 'America/Sao_Paulo',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
                .replace(/[",;]/g, ''),
              this.dateService.getDateFromTimestamp(attendance.time).toISOString(),
            ];
            csv.push(row);
          });

          this.event$.pipe(take(1)).subscribe((event) => {
            if (!event) {
              return;
            }
            const csvString = csv.map((row) => row.join(',')).join('\n');
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(new Blob([csvString], { type: 'text/csv' }));
            a.download = `${event.name}_${this.dateService
              .getDateFromTimestamp(event.eventStartDate)
              .toISOString()}.csv`;
            a.click();
          });
        });
      });
  }
}
