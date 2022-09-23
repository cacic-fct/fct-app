import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, first, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { format, parseISO, addHours } from 'date-fns';

@UntilDestroy()
@Component({
  selector: 'app-page-pay',
  templateUrl: './page-pay.page.html',
  styleUrls: ['./page-pay.page.scss'],
})
export class PagePayPage implements OnInit {
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  uid: string;
  fileName: string;
  majorEvent: any;
  enrollment: any;
  eventID: string;
  rawFile: any;

  constructor(
    private storage: AngularFireStorage,
    public auth: AngularFireAuth,
    private imageCompress: NgxImageCompressService,
    public toastController: ToastController,
    private router: Router,
    public firestore: AngularFirestore
  ) {
    this.eventID = this.router.url.split('/')[3];
  }

  ngOnInit() {
    this.auth.user.pipe(first()).subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.firestore
          .collection(`/users/${user.uid}/majorEventEnrollments`)
          .doc<any>(this.eventID)
          .valueChanges()
          .subscribe((value) => {
            return (this.enrollment = value);
          });
      }
    });

    this.firestore
      .collection('majorEvents')
      .doc<any>(this.eventID)
      .valueChanges()
      .subscribe((value) => {
        return (this.majorEvent = {
          ...value,
          subscriptionStartDate: format(parseISO(value.subscriptionStartDate), 'dd/MM/yyyy HH:mm'),
          subscriptionEndDate: format(parseISO(value.subscriptionEndDate), 'dd/MM/yyyy HH:mm'),
        });
      });
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.majorEvent.accountChavePix);
    alert('Chave copiada para área de transferência');
  }

  compressFile() {
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
    this.firestore
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
}
