import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { UserRecord } from 'src/app/shared/services/userRecord';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss'],
})
export class UserEditModalComponent implements OnInit {
  @Input() userData: UserRecord;

  constructor(
    private fns: AngularFireFunctions,
    private modalController: ModalController,
    private alertController: AlertController,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  deleteUser(uid: string) {
    const deleteUser = this.fns.httpsCallable('deleteUser');

    deleteUser(uid)
      .pipe(take(1))
      .subscribe((res) => {
        if (!res) {
          this.errorToast('Ocorreu um erro inesperado. Tente novamente.');
          return;
        }

        if (res.message) {
          this.errorToast(res.message);
          return;
        }

        this.closeModal();
        return;
      });
  }

  copyJSON() {
    navigator.clipboard.writeText(JSON.stringify(this.userData));
    this.successToast('JSON copiado para a área de transferência.');
  }

  async presentDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Deseja excluir o usuário?',
      message: 'Essa alteração não poderá ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.deleteUser(this.userData.uid);
          },
        },
      ],
    });
    await alert.present();
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

  async successToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      icon: 'checkmark-circle',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  onSubmit() {
    this.closeModal();
  }
}
