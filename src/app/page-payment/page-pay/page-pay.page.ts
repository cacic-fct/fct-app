import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, first } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

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

  eventID: string;

  constructor(
    private storage: AngularFireStorage,
    public auth: AngularFireAuth,
    private imageCompress: NgxImageCompressService,
    public toastController: ToastController,
    private router: Router
  ) {
    this.eventID = this.router.url.split('/')[3];
  }

  ngOnInit() {
    this.auth.user.pipe(first()).subscribe((user) => {
      if (user) {
        this.uid = user.uid;
      }
    });
  }

  compressFile() {
    const MAX_MEGABYTE = 8;
    this.imageCompress.uploadAndGetImageWithMaxSize(MAX_MEGABYTE).then(
      (result: string) => {
        this.uploadFile(result);
      },
      (result: string) => {
        if (this.imageCompress.byteCount(result) > 10_000_000) {
          this.toastSize();
          return;
        }
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
      .pipe(finalize(() => ((this.downloadURL = fileRef.getDownloadURL()), untilDestroyed(this))))
      .subscribe();
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
}
