import { Component, OnInit, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/shared/services/user';

import { CoursesService } from 'src/app/shared/services/courses.service';
import { fromUnixTime } from 'date-fns';
import { trace } from '@angular/fire/compat/performance';
import { EventItem } from 'src/app/shared/services/event';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Timestamp } from '@firebase/firestore-types';
@UntilDestroy()
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  @ViewChild('mySwal')
  private mySwal: SwalComponent;

  // QR Code scanner
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  allowedFormats = [BarcodeFormat.QR_CODE];
  torchEnabled = false;
  torchAvailable = new BehaviorSubject<boolean>(false);
  hasDevices: boolean;
  hasPermission: boolean;
  qrResultString: string;
  deviceIndex: number = -1;
  showScanner = true;

  attendanceCollection: attendance[];
  eventID: string;
  event: EventItem;

  _backdropVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  backdropVisible$: Observable<boolean> = this._backdropVisibleSubject.asObservable();

  attendanceSessionScans: number = 0;

  audioSuccess: HTMLAudioElement;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    public courses: CoursesService,
    private toastController: ToastController
  ) {
    this.eventID = this.router.url.split('/')[4];

    this.afs
      .collection('events')
      .doc(this.eventID)
      .get()
      .pipe(untilDestroyed(this), trace('firestore'))
      .subscribe((document) => {
        if (!document.exists) {
          this.router.navigate(['area-restrita/coletar-presenca']);
          this.mySwal.fire();
          setTimeout(() => {
            this.mySwal.close();
          }, 1000);
        }
      });

    this.afs
      .collection('events')
      .doc<EventItem>(this.eventID)
      .valueChanges()
      .pipe(untilDestroyed(this), trace('firestore'))
      .subscribe((event) => {
        this.event = event;
      });

    this.afs
      .collection<any>(`events/${this.eventID}/attendance`, (ref) => {
        return ref.orderBy('time', 'desc');
      })
      .valueChanges({ idField: 'id' })
      .pipe(untilDestroyed(this), trace('firestore'))
      .subscribe((items: any[]) => {
        this.attendanceCollection = items.map((item) => {
          return {
            ...item,
            user: this.afs.collection('users').doc<User>(item.id).valueChanges().pipe(trace('firestore')),
          };
        });
      });

    this.audioSuccess = new Audio();
    this.audioSuccess.src = 'assets/sounds/scanner-beep.mp3';
    this.audioSuccess.load();
  }

  ngOnInit() {}

  changeCamera(): void {
    this.deviceIndex++;
    if (this.deviceIndex === this.availableDevices.length) {
      this.deviceIndex = 0;
    }
    this.currentDevice = this.availableDevices[this.deviceIndex];
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    if (resultString.startsWith('uid:') && resultString.length === 32) {
      resultString = resultString.substring(4);
      console.log(resultString);
      this.afs
        .collection<attendance>(`events/${this.eventID}/attendance`)
        .doc(resultString)
        .get()
        .pipe(first(), trace('firestore'))
        .subscribe((document) => {
          // If document with user uid already exists
          if (document.exists) {
            this.backdropColor('duplicate');
            this.toastDuplicate();
            return false;
          } else {
            // Check if user uid exists
            this.afs
              .collection('users')
              .doc(resultString)
              .get()
              .pipe(first(), trace('firestore'))
              .subscribe((user) => {
                if (user.exists) {
                  this.afs.collection(`events/${this.eventID}/attendance`).doc(resultString).set({
                    time: new Date(),
                  });
                  this.audioSuccess.play();
                  this.toastSucess();
                  this.backdropColor('success');
                  this.attendanceSessionScans++;
                  return true;
                } else {
                  this.backdropColor('invalid');
                  this.toastInvalid();
                  return false;
                }
              });
          }
        });
    } else {
      this.backdropColor('invalid');
      this.toastInvalid();
      return false;
    }
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  async toastSucess() {
    const toast = await this.toastController.create({
      header: 'Escaneado com sucesso',
      icon: 'checkmark-circle',
      position: 'top',
      duration: 3000,
    });
    toast.present();
  }

  async toastDuplicate() {
    const toast = await this.toastController.create({
      header: 'J?? escaneado',
      message:
        'Confira se o nome do usu??rio est?? na lista. Se n??o estiver, confira a sua conex??o com a internet e recarregue a p??gina.',
      icon: 'copy',
      position: 'top',
      duration: 5000,
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

  async toastInvalid() {
    const toast = await this.toastController.create({
      header: 'QR Code incompat??vel ou perfil n??o encontrado no banco de dados',
      message: 'Solicite que o usu??rio fa??a logoff e login novamente ou insira os dados manualmente.',
      icon: 'close-circle',
      position: 'top',
      duration: 5000,
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

  async backdropColor(color: string) {
    // Add class to ion-backdrop
    document.querySelector('ion-backdrop').classList.add(color);

    // Change backdrop class to color
    this._backdropVisibleSubject.next(true);

    // Wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this._backdropVisibleSubject.next(false);
    // Remove backdrop class
    document.querySelector('ion-backdrop').classList.remove(color);
  }
}

interface attendance {
  user: Observable<User>;
  time: Timestamp;
  id?: string;
}
