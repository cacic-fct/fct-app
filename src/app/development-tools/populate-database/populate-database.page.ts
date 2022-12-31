import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { take } from 'rxjs';

import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-populate-database',
  templateUrl: './populate-database.page.html',
  styleUrls: ['./populate-database.page.scss'],
})
export class PopulateDatabasePage implements OnInit {
  dataForm: FormGroup;

  progress: number = 0;

  constructor(private fns: AngularFireFunctions, private formBuilder: FormBuilder) {
    this.dataForm = this.formBuilder.group({
      createAdmin: [true],
      createUndergraduate: [true],
      createProfessor: [true],
      createExternal: [true],
      createPaidMajorEvent: [true],
      createEvent: [true],
      createEventGroup: [true],
    });
  }

  ngOnInit() {}

  populateDatabase() {
    this.progress = 0;
    if (this.dataForm.get('createAdmin')?.value) {
      this.createAdmin();
    }
    this.progress += 0.1428;
    if (this.dataForm.get('createUndergraduate')?.value) {
      this.createUndergraduate();
    }
    this.progress += 0.1428;
    if (this.dataForm.get('createProfessor')?.value) {
      this.createProfessor();
    }
    this.progress += 0.1428;
    if (this.dataForm.get('createExternal')?.value) {
      this.createExternal();
    }
    this.progress += 0.1428;
    if (this.dataForm.get('createPaidMajorEvent')?.value) {
      this.createPaidMajorEvent();
    }
    this.progress += 0.1428;
    if (this.dataForm.get('createEvent')?.value) {
      this.createEvent();
    }
    this.progress += 0.1428;
    if (this.dataForm.get('createEventGroup')?.value) {
      this.createEventGroup();
    }
    this.progress = 1;
  }

  createAdmin() {
    const createAdmin = this.fns.httpsCallable('populate_db-create_users-createAdminUser');
    createAdmin(null).pipe(take(1)).subscribe();
  }

  createUndergraduate() {
    const createUndergraduate = this.fns.httpsCallable('populate_db.create_users.createUndergraduateUser');
    createUndergraduate(null).pipe(take(1)).subscribe();
  }

  createProfessor() {
    const createProfessor = this.fns.httpsCallable('populate_db-create_users-createProfessorUser');
    createProfessor(null).pipe(take(1)).subscribe();
  }

  createExternal() {
    const createExternal = this.fns.httpsCallable('populate_db-create_users-createExternalUser');
    createExternal(null).pipe(take(1)).subscribe();
  }

  createPaidMajorEvent() {
    const createPaidMajorEvent = this.fns.httpsCallable('populate_db-create_events-createPaidMajorEvent');
    createPaidMajorEvent(null).pipe(take(1)).subscribe();
  }

  createEvent() {
    const createEvent = this.fns.httpsCallable('populate_db-create_events-createEvent');
    createEvent(null).pipe(take(1)).subscribe();
  }

  createEventGroup() {
    const createEventGroup = this.fns.httpsCallable('populate_db-create_events-createEventGroup');
    createEventGroup(null).pipe(take(1)).subscribe();
  }
}
