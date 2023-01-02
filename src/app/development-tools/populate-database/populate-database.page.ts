import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { take } from 'rxjs';

import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-populate-database',
  templateUrl: './populate-database.page.html',
  styleUrls: ['./populate-database.page.scss'],
})
export class PopulateDatabasePage implements OnInit {
  parseFloat = parseFloat;
  dataForm: FormGroup;

  progress: number = 0;

  populateStarted: boolean = false;

  numberOfSelectedCheckboxes: number = 0;
  progressPerItem: number;

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

    // Count the number of selected checkboxes
    Object.keys(this.dataForm.controls).forEach((key) => {
      if (this.dataForm.controls[key].value === true) {
        this.numberOfSelectedCheckboxes++;
      }
    });

    this.progressPerItem = 1 / this.numberOfSelectedCheckboxes;
  }

  ngOnInit() {
    this.dataForm.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.numberOfSelectedCheckboxes = 0;
      // Count the number of selected checkboxes
      Object.keys(this.dataForm.controls).forEach((key) => {
        if (this.dataForm.controls[key].value === true) {
          this.numberOfSelectedCheckboxes++;
        }
      });

      this.progressPerItem = 1 / this.numberOfSelectedCheckboxes;
    });
  }

  populateDatabase() {
    this.progress = 0;
    this.populateStarted = true;

    if (this.dataForm.get('createAdmin')?.value) {
      this.createAdmin();
    }

    if (this.dataForm.get('createUndergraduate')?.value) {
      this.createUndergraduate();
    }

    if (this.dataForm.get('createProfessor')?.value) {
      this.createProfessor();
    }

    if (this.dataForm.get('createExternal')?.value) {
      this.createExternal();
    }

    if (this.dataForm.get('createPaidMajorEvent')?.value) {
      this.createPaidMajorEvent();
    }

    if (this.dataForm.get('createEvent')?.value) {
      this.createEvent();
    }

    if (this.dataForm.get('createEventGroup')?.value) {
      this.createEventGroup();
    }
  }

  createAdmin() {
    const createAdmin = this.fns.httpsCallable('populate_db-create_users-createAdminUser');
    createAdmin(null)
      .pipe(take(1))
      .subscribe(() => {
        this.progress += this.progressPerItem;
      });
  }

  createUndergraduate() {
    const createUndergraduate = this.fns.httpsCallable('populate_db-create_users-createUndergraduateUser');
    createUndergraduate(null)
      .pipe(take(1))
      .subscribe(() => {
        this.progress += this.progressPerItem;
      });
  }

  createProfessor() {
    const createProfessor = this.fns.httpsCallable('populate_db-create_users-createProfessorUser');
    createProfessor(null)
      .pipe(take(1))
      .subscribe(() => {
        this.progress += this.progressPerItem;
      });
  }

  createExternal() {
    const createExternal = this.fns.httpsCallable('populate_db-create_users-createExternalUser');
    createExternal(null)
      .pipe(take(1))
      .subscribe(() => {
        this.progress += this.progressPerItem;
      });
  }

  createPaidMajorEvent() {
    const createPaidMajorEvent = this.fns.httpsCallable('populate_db-create_events-createPaidMajorEvent');
    createPaidMajorEvent(null)
      .pipe(take(1))
      .subscribe(() => {
        this.progress += this.progressPerItem;
      });
  }

  createEvent() {
    const createEvent = this.fns.httpsCallable('populate_db-create_events-createEvent');
    createEvent(null)
      .pipe(take(1))
      .subscribe(() => {
        this.progress += this.progressPerItem;
      });
  }

  createEventGroup() {
    const createEventGroup = this.fns.httpsCallable('populate_db-create_events-createEventGroup');
    createEventGroup(null)
      .pipe(take(1))
      .subscribe(() => {
        this.progress += this.progressPerItem;
      });
  }
}
