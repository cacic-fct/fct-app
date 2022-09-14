import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CoursesService } from '../shared/services/courses.service';

import { BehaviorSubject, first, Observable, map } from 'rxjs';
import { User } from '../shared/services/user';
import { trace } from '@angular/fire/compat/performance';

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.page.html',
  styleUrls: ['./page-profile.page.scss'],
})
export class PageProfilePage implements OnInit {
  user: any;
  uid$: Observable<string>;
  _academicIDSubject: BehaviorSubject<string> = new BehaviorSubject(undefined);
  academicID$: Observable<string> = this._academicIDSubject.asObservable();
  serviceWorkerActive: boolean = false;

  constructor(public auth: AngularFireAuth, public courses: CoursesService, private afs: AngularFirestore) {
    // If browser supports service worker
    if ('serviceWorker' in navigator) {
      // If service worker is "activated" or "activating"
      if (navigator.serviceWorker.controller) {
        this.serviceWorkerActive = true;
      }
    }
  }

  ngOnInit() {
    this.uid$ = this.auth.user.pipe(first(), trace('auth')).pipe(map((user) => user.uid));

    this.auth.user.pipe(first(), trace('auth')).subscribe((user) => {
      if (user) {
        this.afs
          .doc<User>(`users/${user.uid}`)
          .valueChanges()
          .pipe(first(), trace('firestore'))
          .subscribe((user) => {
            if (user.academicID) {
              this._academicIDSubject.next(user.academicID);
            }
          });
      }
    });
  }
}
