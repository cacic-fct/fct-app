import { UserRecord } from 'src/app/shared/services/userRecord';
import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { FormGroup, FormControl } from '@angular/forms';
import { ToastController, ModalController } from '@ionic/angular';
import { take } from 'rxjs';

import { UserEditModalComponent } from '../components/user-edit-modal/user-edit-modal.component';

@Component({
  selector: 'app-page-search-user',
  templateUrl: './page-search-user.page.html',
  styleUrls: ['./page-search-user.page.scss'],
})
export class PageSearchUserPage implements OnInit {
  userSearchForm: FormGroup = new FormGroup({
    userData: new FormControl(''),
  });

  disableSubmitButton: boolean = false;

  constructor(
    private fns: AngularFireFunctions,
    public toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.disableSubmitButton = true;

    const getUserProfile = this.fns.httpsCallable('getUserProfile');
    getUserProfile({ string: this.userSearchForm.value.userData })
      .pipe(take(1))
      .subscribe((res) => {
        this.disableSubmitButton = false;
        if (!res) {
          this.errorToast('Ocorreu um erro inesperado. Tente novamente.');
          return;
        }

        if (res.message) {
          this.errorToast(res.message);
          return;
        }

        this.openEditModal(res);
      });
  }

  async errorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      icon: 'warning',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  async openEditModal(data: UserRecord) {
    const modal = await this.modalController.create({
      component: UserEditModalComponent,
      componentProps: {
        userData: data,
      },
      showBackdrop: true,
      backdropDismiss: false,
    });
    return await modal.present();
  }
}
