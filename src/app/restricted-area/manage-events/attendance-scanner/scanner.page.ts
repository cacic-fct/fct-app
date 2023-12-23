import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject, take, map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { User } from 'src/app/shared/services/user';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { trace } from '@angular/fire/compat/performance';
import { EventItem } from 'src/app/shared/services/event';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Timestamp as TimestampType } from '@firebase/firestore-types';
import { AuthService } from 'src/app/shared/services/auth.service';
import { serverTimestamp } from '@angular/fire/firestore';
import { MajorEventItem } from 'src/app/shared/services/major-event.service';
import { DateService } from 'src/app/shared/services/date.service';
import { Auth, user } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgIf, NgFor, AsyncPipe, DecimalPipe, DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { sendOutline, flashOutline, cameraReverseOutline } from 'ionicons/icons';
import {
  IonBackdrop,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
  IonIcon,
  IonText,
  IonProgressBar,
  IonFooter,
} from '@ionic/angular/standalone';

interface Attendance {
  user: Observable<User | undefined>;
  time: TimestampType;
  id?: string;
}

@UntilDestroy()
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    ZXingScannerModule,
    FormsModule,
    NgFor,
    SweetAlert2Module,
    AsyncPipe,
    DecimalPipe,
    DatePipe,
    IonBackdrop,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonIcon,
    IonText,
    IonProgressBar,
    IonFooter,
  ],
})
export class ScannerPage implements OnInit {
  @Input('manualInput') manualInput!: string;
  @ViewChild('mySwal')
  private mySwal!: SwalComponent;
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);

  // QR Code scanner
  availableDevices!: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo | null = null;
  allowedFormats = [BarcodeFormat.QR_CODE];
  torchEnabled = false;
  torchAvailable = new BehaviorSubject<boolean>(false);
  hasDevices: boolean = false;
  hasPermission: boolean = false;
  deviceIndex: number = -1;
  showScanner = true;

  attendanceCollection$: Observable<Attendance[]>;
  /**
   * Coleção de presença de não-pagantes
   */
  nonPayingAttendanceCollection$: Observable<Attendance[]>;
  eventID: string;
  event$: Observable<EventItem>;
  /**
   * Variable initialized at this.checkIfEventIsPaid();
   * Variável inicializada no método this.checkIfEventIsPaid()
   */
  private eventIsPaid: boolean | undefined;
  /**
   * Variable initialized at this.checkIfEventIsPaid();
   * Variável inicializada no método this.checkIfEventIsPaid()
   */
  private majorEventID?: string;

  _backdropVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  backdropVisible$: Observable<boolean> = this._backdropVisibleSubject.asObservable();

  attendanceSessionScans: number = 0;

  audioSuccess: HTMLAudioElement;

  adminID: string | undefined;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    public courses: CoursesService,
    private toastController: ToastController,
    private authService: AuthService,
    public dateService: DateService
  ) {
    this.eventID = this.route.snapshot.params['eventID'];

    this.user$.pipe(take(1)).subscribe((user) => {
      this.adminID = user?.uid || 'Desconhecido';
    });

    // If eventID is not valid, redirect
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

    this.event$ = this.afs
      .collection('events')
      .doc<EventItem>(this.eventID)
      .valueChanges()
      // @ts-ignore
      .pipe(trace('firestore'));
    this.checkIfEventIsPaid();

    // Get attendance list
    this.attendanceCollection$ = this.afs
      .collection<Attendance>(`events/${this.eventID}/attendance`, (ref) => {
        let query = ref.orderBy('time', 'desc');
        query = query.limit(5);
        return query;
      })
      .valueChanges({ idField: 'id' })
      .pipe(
        untilDestroyed(this),
        trace('firestore'),
        map((attendance) =>
          attendance.map((item) => ({
            ...item,
            user: this.afs
              .collection('users')
              .doc<User>(item.id)
              .get()
              .pipe(map((document) => document.data())),
          }))
        )
      );

    // Get non-paying-attendance list
    // Lista de não-pagantes
    this.nonPayingAttendanceCollection$ = this.afs
      .collection<Attendance>(`events/${this.eventID}/non-paying-attendance`, (ref) => {
        let query = ref.orderBy('time', 'desc');
        query = query.limit(5);
        return query;
      })
      .valueChanges({ idField: 'id' })
      .pipe(
        untilDestroyed(this),
        trace('firestore'),
        map((attendance) =>
          attendance.map((item) => ({
            ...item,
            user: this.afs
              .collection('users')
              .doc<User>(item.id)
              .get()
              .pipe(map((document) => document.data())),
          }))
        )
      );

    // Load audio asset (beep)
    this.audioSuccess = new Audio();
    addIcons({ sendOutline, flashOutline, cameraReverseOutline });
  }

  ngOnInit() {
    this.audioSuccess.src = 'assets/sounds/scanner-beep.mp3';
    this.audioSuccess.load();
  }

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
      const uid = resultString.substring(4);
      this.writeUserAttendance(uid);
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

  /**
   * Verifica se o evento é parte de um majorEvent pago.
   */
  checkIfEventIsPaid() {
    this.afs
      .collection<EventItem>('events')
      .doc(this.eventID)
      .get()
      .pipe(take(1), trace('firestore'))
      .subscribe((event) => {
        if (event.exists) {
          // Verify if event is a part of majorEvent
          const majorEventID = event.data()?.inMajorEvent;
          this.majorEventID = majorEventID;
          const isSubEvent = majorEventID != null;
          // If it is a subEvent, check if majorEvent is paid
          if (isSubEvent) {
            this.afs
              .collection<MajorEventItem>('majorEvents')
              .doc(majorEventID)
              .get()
              .pipe(take(1), trace('firestore'))
              .subscribe((majorEvent) => {
                const majorEventIsPaid = !majorEvent.data()?.price.isFree;
                // Finally, set if event is paid
                this.eventIsPaid = isSubEvent && majorEventIsPaid;
              });
          } else {
            this.eventIsPaid = false;
          }
        }
      });
  }

  /**
   * Observable que indica se um usuário existe ou não
   * @param uid User ID, ID do Usuário
   */
  userExists$(uid: string): Observable<boolean> {
    // Check if user uid exists in user list
    return this.afs
      .collection('users')
      .doc(uid)
      .get()
      .pipe(
        take(1),
        trace('firestore'),
        map((userDocument) => userDocument.exists)
      );
  }

  /**
   * Observable que indica se um usuário pagou o evento (se for pago)
   * @param uid User ID, ID do usuário
   */
  userPaid$(uid: string): Observable<boolean> {
    return this.afs
      .collection<any>(`majorEvents/${this.majorEventID}/subscriptions`)
      .doc(uid)
      .valueChanges()
      .pipe(
        untilDestroyed(this),
        trace('firestore'),
        map((subscription) => {
          if (subscription) {
            return subscription.payment.status == 2;
          } else {
            return false;
          }
        })
      );
  }

  /**
   * Remove um determinado UID da coleção 'non-paying-attendance', se o UID estiver lá.
   * @param uid User ID, ID do usuário
   */
  removeFromNPAttendance(uid: string) {
    this.afs
      .collection<Attendance>(`events/${this.eventID}/non-paying-attendance`)
      .doc(uid)
      .get()
      .pipe(take(1), trace('firestore'))
      .subscribe((document) => {
        if (document.exists) {
          document.ref.delete();
        }
      });
  }

  /**
   * Escreve um determinado UID na coleção correta
   * @param uid User ID, ID do usuário
   */
  writeUserAttendance(uid: string | null) {
    if (!uid) {
      return;
    }
    // First, verify if user exists
    this.userExists$(uid).subscribe((exists) => {
      if (exists) {
        // If event is paid, treat for two different collections
        if (this.eventIsPaid) {
          // Check if user has paid
          // Yes -> write on 'attendance'
          // No -> write on 'non-paying-attendance'
          this.userPaid$(uid).subscribe((paid) => {
            if (paid) {
              this.writeUIDAttendance(uid);
              // If it was on NP-attendance, remove.
              this.removeFromNPAttendance(uid);
            } else {
              this.writeUIDNPAttendance(uid);
            }
          });
        }
        // Else, write on 'attendance'
        else {
          this.writeUIDAttendance(uid);
        }
      }
      // User does not exists
      else {
        this.backdropColor('invalid');
        this.toastInvalid();
      }
    });
  }

  /**
   * Escreve um determinado UID na coleção 'attendance'
   * @param uid User ID, ID do usuário
   */
  writeUIDAttendance(uid: string) {
    this.afs
      .collection<Attendance>(`events/${this.eventID}/attendance`)
      .doc(uid)
      .get()
      .pipe(take(1), trace('firestore'))
      .subscribe((document) => {
        // If document with user uid already exists in attendance list
        if (document.exists) {
          this.backdropColor('duplicate');
          this.toastDuplicate();
          return false;
        }
        this.afs.collection(`events/${this.eventID}/attendance`).doc(uid).set({
          // @ts-ignore
          time: serverTimestamp(),
          author: this.adminID,
        });
        this.audioSuccess.play();
        this.toastSucess();
        this.backdropColor('success');
        this.attendanceSessionScans++;
      });
  }

  /**
   * Escreve um determinado UID na coleção 'non-paying-attendance'
   * @param uid User ID, ID do usuário
   */
  writeUIDNPAttendance(uid: string) {
    this.afs
      .collection<Attendance>(`events/${this.eventID}/non-paying-attendance`)
      .doc(uid)
      .get()
      .pipe(take(1), trace('firestore'))
      .subscribe((document) => {
        // If document with user uid already exists in non-paying-attendance collection
        if (document.exists) {
          this.backdropColor('duplicate');
          this.toastDuplicate();
          return false;
        }
        this.afs.collection(`events/${this.eventID}/non-paying-attendance`).doc(uid).set({
          // @ts-ignore
          time: serverTimestamp(),
          author: this.adminID,
        });
        this.audioSuccess.play();
        this.toastSucess();
        this.backdropColor('success');
        this.attendanceSessionScans++;
      });
  }

  async manualAttendance() {
    const response = await this.authService.getUserUid(this.manualInput);

    this.manualInput = '';

    if (!response.success) {
      this.backdropColor('invalid');
      this.toastRequestError(response.message);
      console.error(response.message);
      return;
    }

    this.writeUserAttendance(response.data);
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
      header: 'Já escaneado',
      message:
        'Confira se o nome do usuário está na lista. Se não estiver, confira a sua conexão com a internet e recarregue a página.',
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
      header: 'QR Code incompatível ou perfil não encontrado no banco de dados',
      message: 'Solicite que o usuário faça logoff e login novamente ou insira os dados manualmente.',
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

  async toastRequestError(message: string) {
    const toast = await this.toastController.create({
      header: 'Ocorreu um erro ao processar a sua solicitação',
      message: message,
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
    document.querySelector('ion-backdrop')!.classList.add(color);

    // Change backdrop class to color
    this._backdropVisibleSubject.next(true);

    // Wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this._backdropVisibleSubject.next(false);
    // Remove backdrop class
    document.querySelector('ion-backdrop')!.classList.remove(color);
  }
}
