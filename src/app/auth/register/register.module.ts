import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { PageVerifyPhonePageModule } from '../../page-verify-phone/page-verify-phone.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    SweetAlert2Module,
    PageVerifyPhonePageModule,
  ],
  declarations: [RegisterPage],
})
export class RegisterPageModule {}
