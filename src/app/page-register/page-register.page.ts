import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { AlertController } from '@ionic/angular';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.page.html',
  styleUrls: ['./page-register.page.scss'],
})
export class PageRegisterPage implements OnInit {
  @ViewChild('mySwal')
  private mySwal: SwalComponent;

  dataVersion = '0.1.0';
  userData: any;
  dataForm: FormGroup = new FormGroup({
    academicID: new FormControl(''),
    dob: new FormControl(''),
    phone: new FormControl(''),
  });

  constructor(
    public authService: AuthService,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public router: Router
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.userData.uid.replace(/%20/g, ' ') +
      '%0D%0Anome%3A%20' +
      this.userData.displayName.replace(/%20/g, ' ') +
      '%0D%0Ae-mail%20institucional%3A%20' +
      this.userData.email.replace(/%20/g, ' ') +
      '%0D%0A';
    this.dataForm = this.formBuilder.group({
      academicID: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    });
  }

  onSubmit() {
    if (!this.dataForm.valid) {
      return;
    }
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${this.userData.uid}`
    );
    const user = {
      academicID: this.dataForm.value.academicID,
      dataVersion: this.dataVersion,
    };

    userRef.set(user, {
      merge: true,
    });
    this.mySwal.fire();
    setTimeout(() => {
      this.mySwal.close();
      this.router.navigate(['/menu']);
    }, 1500);
  }
}
