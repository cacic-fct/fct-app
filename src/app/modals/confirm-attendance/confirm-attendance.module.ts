import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmAttendancePageRoutingModule } from './confirm-attendance-routing.module';
import { ConfirmAttendancePage } from './confirm-attendance';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        ConfirmAttendancePageRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SweetAlert2Module,
        ConfirmAttendancePage,
    ],
})
export class ConfirmAttendancePageModule {}
