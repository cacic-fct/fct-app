import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, Observable, take } from 'rxjs';
import { EventItem } from '../shared/services/event';
import { Timestamp } from '@firebase/firestore-types';
import { fromUnixTime } from 'date-fns';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

interface EventInfo {
  name: string;
  attendanceCollectionEnd: Timestamp;
}

@UntilDestroy()
@Component({
  selector: 'app-page-confirm-attendance',
  templateUrl: './page-confirm-attendance.html',
  styleUrls: ['./page-confirm-attendance.scss'],
})
export class PageConfirmAttendance implements OnInit {
  eventID: string;
  dataForm: FormGroup;
  eventInfo$: Observable<EventInfo>;
  private attendanceCode: string;
  @ViewChild('swalConfirm') private swalConfirm: SwalComponent;

  constructor(
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventID = this.route.snapshot.params.eventID;
    this.dataForm = this.formBuilder.group({
      code: ['', [Validators.required, this.codeValidator]],
    });
    const eventValueChanges$: Observable<EventItem> = this.afs
      .collection<EventItem>('events')
      .doc(this.eventID)
      .valueChanges();
    this.eventInfo$ = eventValueChanges$.pipe(
      trace('firestore'),
      untilDestroyed(this),
      map((event) => ({
        name: event.name,
        attendanceCollectionEnd: event.attendanceCollectionEnd,
      }))
    );
    // attendanceCode is constant
    eventValueChanges$.pipe(take(1)).subscribe((event) => {
      this.attendanceCode = event.attendanceCode;
    });
    // When the code is valid, automatically submit.
    this.dataForm.get('code').valueChanges.subscribe((value) => {
      if (value == this.attendanceCode) {
        this.onSubmit();
      }
    });
  }

  codeValidator = (formControl: AbstractControl): { [key: string]: boolean } | null => {
    if (!this.attendanceCode) {
      return { codeLoading: true };
    }
    if (formControl.value == this.attendanceCode) {
      return null;
    } else {
      return { wrongCode: true };
    }
  };

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  onSubmit() {
    this.swalConfirm.fire();
    setTimeout(() => {
      this.swalConfirm.close();
      this.router.navigate(['/menu'], { replaceUrl: true });
    }, 1500);
  }
}
