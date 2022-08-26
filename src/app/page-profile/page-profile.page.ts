import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CoursesService } from '../shared/services/courses.service';

import { BehaviorSubject, first, Observable } from 'rxjs';
import { User } from '../shared/services/user';

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.page.html',
  styleUrls: ['./page-profile.page.scss'],
})
export class PageProfilePage implements OnInit {
  user: any;
  _uidSubject: BehaviorSubject<string> = new BehaviorSubject(undefined);
  uid$: Observable<string> = this._uidSubject.asObservable();
  _academicIDSubject: BehaviorSubject<string> = new BehaviorSubject(undefined);
  academicID$: Observable<string> = this._academicIDSubject.asObservable();
  constructor(public auth: AngularFireAuth, public courses: CoursesService, private afs: AngularFirestore) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));

    this.auth.user.pipe(first()).subscribe((user) => {
      if (user) {
        this._uidSubject.next(user.uid);
        this.afs
          .doc<User>(`users/${user.uid}`)
          .valueChanges()
          .pipe(first())
          .subscribe((user) => {
            if (user.academicID) {
              this._academicIDSubject.next(user.academicID);
            }
          });
      }
    });
  }
}
