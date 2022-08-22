import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CoursesService } from '../shared/services/courses.service';

import { first } from 'rxjs';
import { User } from '../shared/services/user';

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.page.html',
  styleUrls: ['./page-profile.page.scss'],
})
export class PageProfilePage implements OnInit {
  user: any;
  uid: string;
  academicID: string;
  constructor(public auth: AngularFireAuth, public courses: CoursesService, private afs: AngularFirestore) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));

    this.auth.user.pipe(first()).subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.afs
          .doc<User>(`users/${this.uid}`)
          .valueChanges()
          .pipe(first())
          .subscribe((user) => {
            this.academicID = user.academicID;
          });
      }
    });
  }
}
