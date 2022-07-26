import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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

  constructor(private storage: AngularFireStorage, public auth: AngularFireAuth) {}

  ngOnInit() {
    this.auth.user.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.uid = user.uid;
      }
    });
  }

  uploadFile(event) {
    const file = event.target.files[0];
    this.fileName = file.name;
    const filePath = 'secompp/payment-receipts/' + this.uid;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file, { customMetadata: { owner: this.uid } });

    this.uploadPercent = task.percentageChanges();

    task
      .snapshotChanges()
      .pipe(finalize(() => (this.downloadURL = fileRef.getDownloadURL())))
      .subscribe();
  }
}
