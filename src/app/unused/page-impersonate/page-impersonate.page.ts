// @ts-strict-ignore
import { Component, inject, OnInit } from '@angular/core';
import { Auth, signInWithCustomToken } from '@angular/fire/auth';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular/standalone';
import { Functions, httpsCallable } from '@angular/fire/functions';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-impersonate',
  templateUrl: './page-impersonate.page.html',
  styleUrls: ['./page-impersonate.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  ],
})
export class PageImpersonatePage implements OnInit {
  impersonateForm: FormGroup;
  private auth: Auth = inject(Auth);
  private functions: Functions = inject(Functions);

  constructor(private formBuilder: FormBuilder, private toastController: ToastController, private router: Router) {
    this.impersonateForm = this.formBuilder.group({
      userID: '',
    });
  }

  ngOnInit() {}

  impersonate() {
    const impersonate = httpsCallable(this.functions, 'impersonate');
    impersonate({ uid: this.impersonateForm.get('userID').value }).then((res) => {
      const data: any = res.data;
      signInWithCustomToken(this.auth, data).then(() => {
        this.successToast();
        this.router.navigate(['/menu']);
      });
    });
  }

  async successToast() {
    const toast = await this.toastController.create({
      message: 'Operação realizada com sucesso',
      duration: 2000,
    });
    toast.present();
  }
}
