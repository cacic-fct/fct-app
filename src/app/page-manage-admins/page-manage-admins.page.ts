import { Component, OnInit, ViewChild } from '@angular/core';

import { AngularFireFunctions } from '@angular/fire/compat/functions';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ToastController } from '@ionic/angular';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-page-manage-admins',
  templateUrl: './page-manage-admins.page.html',
  styleUrls: ['./page-manage-admins.page.scss'],
})
export class PageManageAdminsPage implements OnInit {
  addAdminForm: FormGroup = new FormGroup({
    adminEmail: new FormControl(''),
  });

  removeAdminForm: FormGroup = new FormGroup({
    adminEmail: new FormControl(''),
  });

  constructor(
    private fns: AngularFireFunctions,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  async errorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  async successToast() {
    const toast = await this.toastController.create({
      message: 'Operação realizada com sucesso',
      duration: 2000,
    });
    toast.present();
  }

  // TODO: Write user additions and removals to Firestore claims/admin
  addAdmin() {
    console.log(this.addAdminForm.value.adminEmail);
    const addAdminRole = this.fns.httpsCallable('addAdminRole');
    addAdminRole({ email: this.addAdminForm.value.adminEmail })
      .pipe(first())
      .subscribe((res) => {
        this.successToast();
        this.addAdminForm.reset();
      });
  }

  removeAdmin() {
    console.log(this.removeAdminForm.value.adminEmail);
    const removeAdminRole = this.fns.httpsCallable('removeAdminRole');
    removeAdminRole({ email: this.removeAdminForm.value.adminEmail })
      .pipe(first())
      .subscribe((res) => {
        this.successToast();
        this.removeAdminForm.reset();
      });
  }
}
