import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmModalPage } from './confirm-modal.page';
import { SafeModule } from './../../../shared/pipes/safe.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SafeModule],
  declarations: [ConfirmModalPage],
})
export class ConfirmModalPageModule {}
