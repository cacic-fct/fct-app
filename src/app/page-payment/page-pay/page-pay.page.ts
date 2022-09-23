import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { fromUnixTime } from 'date-fns';

import { MajorEventItem } from 'src/app/shared/services/major-event';
import { ClipboardService } from 'ngx-clipboard';
import { Timestamp } from 'firebase/firestore';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-page-pay',
  templateUrl: './page-pay.page.html',
  styleUrls: ['./page-pay.page.scss'],
})
export class PagePayPage implements OnInit {
  @ViewChild('notFound')
  private notFound: SwalComponent;

  @ViewChild('expired')
  private expired: SwalComponent;

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  majorEvent$: Observable<MajorEventItem>;
  eventID: string;
  fileName: string;
  uid: string;

  rawFile: any;
  userSubscription$: Promise<MajorEventSubscription>;
  today: Date = new Date();
  outOfDate: boolean = false;

  constructor(
    private storage: AngularFireStorage,
    private clipboardService: ClipboardService,
    public auth: AngularFireAuth,
    private imageCompress: NgxImageCompressService,
    public toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    public afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.eventID = this.route.snapshot.params.eventID;

    // If eventID is not valid, redirect
    this.afs
      .collection('majorEvents')
      .doc(this.eventID)
      .get()
      .pipe(untilDestroyed(this), trace('firestore'))
      .subscribe((document) => {
        if (!document.exists) {
          // TODO: Redirecionar para página de minhas inscrições
          this.router.navigate(['menu']);
          this.notFound.fire();
          setTimeout(() => {
            this.notFound.close();
          }, 1000);
        }
      });

    this.auth.user.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.afs
          .doc<Subscription>(`users/${user.uid}/majorEventSubscriptions/${this.eventID}`)
          .valueChanges({ idField: 'id' })
          .pipe(untilDestroyed(this), trace('firestore'))
          .subscribe((subscription) => {
            this.userSubscription$ = subscription.reference.get().then((doc) => {
              return doc.data();
            });
          });
      }
    });

    this.majorEvent$ = this.afs
      .collection('majorEvents')
      .doc<MajorEventItem>(this.eventID)
      .valueChanges()
      .pipe(untilDestroyed(this), trace('firestore'));

    this.majorEvent$.pipe(untilDestroyed(this)).subscribe((event) => {
      if (this.getDateFromTimestamp(event.subscriptionEndDate) < this.today) {
        this.outOfDate = true;
        // TODO: Redirecionar para página de minhas inscrições
        this.router.navigate(['menu']);
        this.expired.fire();
        setTimeout(() => {
          this.expired.close();
        }, 1000);
      }
    });
  }

  copyPixToClipboard(chavePix: string) {
    this.clipboardService.copy(chavePix);
    this.presentToastCopied();
  }

  async presentToastCopied() {
    const toast = await this.toastController.create({
      header: 'Realizar pagamento',
      message: 'Chave pix copiada para a área de transferência.',
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

    toast.present();
  }

  compressFile() {
    if (this.outOfDate) {
      return;
    }

    const MAX_MEGABYTE = 8;
    this.imageCompress.uploadAndGetImageWithMaxSize(MAX_MEGABYTE).then(
      (result: string) => {
        this.uploadFile(result);
        this.rawFile = result;
      },
      (result: string) => {
        if (this.imageCompress.byteCount(result) > 10_000_000) {
          this.toastSize();
          return;
        }

        this.rawFile = result;
        this.uploadFile(result);
      }
    );
  }

  uploadFile(result: string) {
    // Attribution: Harsh Mittal
    // https://stackoverflow.com/questions/68324916/resize-compress-selected-image-before-uploading-to-firebase-in-angular
    const split = result.split(',');
    const type = split[0].replace('data:', '').replace(';base64', '');

    // atob is not deprecated
    // https://github.com/microsoft/TypeScript/issues/45566
    const byteString = atob(split[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }

    const fileBlob = new Blob([arrayBuffer], { type }); // upload this to firebase.

    const filePath = `${this.eventID}/payment-receipts/${this.uid}`;

    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, fileBlob, { customMetadata: { owner: this.uid } });

    this.uploadPercent = task.percentageChanges();
    task.catch((error) => {
      console.error(error);
      this.toastError();
    });

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.updateUser();
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  updateUser() {
    this.afs
      .doc<any>(`/users/${this.uid}/majorEventEnrollments/${this.eventID}`)
      .update({ receiptUploaded: true, receiptLink: this.downloadURL })
      .then(() => {
        this.toastSuccess();

        setTimeout(() => {
          this.toastController.dismiss();
          this.router.navigate(['/pagamentos'], { replaceUrl: true });
        }, 1500);
      })
      .catch((err) => {
        this.toastError();
        console.error('Failed to update user', err);
      });
  }

  async toastError() {
    const toast = await this.toastController.create({
      header: 'Falha no upload',
      message: 'Ocorreu um erro ao fazer o upload do seu recibo de pagamento. Tente novamente.',
      icon: 'close-circle',
      position: 'bottom',
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

  async toastSize() {
    const toast = await this.toastController.create({
      header: 'Falha no upload',
      message: 'O arquivo escolhido é muito grande. Tente novamente com um arquivo menor.',
      icon: 'close-circle',
      position: 'bottom',
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

  async toastSuccess() {
    const toast = await this.toastController.create({
      header: 'Comprovante enviado',
      message:
        'O comprovante foi enviado com sucesso! Acompanhe o status do pagamento através da seção "Minhas Inscrições"',
      icon: 'checkmark-circle',
      position: 'bottom',
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

  getDateFromTimestamp(timestamp: any): Date {
    return fromUnixTime(timestamp.seconds);
  }
}

interface Subscription {
  id?: string;
  reference?: DocumentReference<any>;
}

interface MajorEventSubscription {
  id?: string;
  payment?: {
    status?: number;
    price?: number;
    time?: Timestamp;
    error?: string;
    author?: string;
  };
  subscribedToEvents: string[];
  subscriptionType?: number;
  time: Timestamp;
}
