import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { trace } from '@angular/fire/compat/performance';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { User } from '../shared/services/user';
@UntilDestroy()
@Component({
  selector: 'app-page-payment',
  templateUrl: './page-payment.page.html',
  styleUrls: ['./page-payment.page.scss'],
})
export class PagePaymentPage implements OnInit {
  items$: Observable<any>;
  uid: string;

  constructor(public auth: AngularFireAuth, firestore: AngularFirestore) {
    this.auth.user.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.uid = user.uid;
      }
    });

    this.items$ = firestore
      .collection<User>('users')
      .doc(this.uid)
      .collection<any>('payments', (ref) => {
        let query: any = ref;
        debugger;
        return query.orderBy('date', 'desc');
      })
      .valueChanges({ idField: 'id' })
      .pipe(trace('firestore'));
  }

  ngOnInit() {
    this.items$.subscribe((items) => {
      console.log(items);
    });
  }
}
