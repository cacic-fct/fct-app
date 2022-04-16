import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { Observable } from 'rxjs';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { EventItem } from 'src/app/shared/services/event';
import { User } from 'src/app/shared/services/user';
import { fromUnixTime } from 'date-fns';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  attendanceCollection : attendance[]
  eventID : string;
  event : EventItem;  

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    public courses: CoursesService,
  ) {
    this.eventID = this.router.url.split('/')[4];

    this.afs
      .collection('events')
      .doc<EventItem>(this.eventID)
      .valueChanges()
      .subscribe((event) => {
        this.event = event;
      });

    this.afs
      .collection<any>(`events/${this.eventID}/attendance`, (ref) => {
        return ref.orderBy('time', 'desc');
      })
      .valueChanges({ idField: 'id' })
      .subscribe((items: any[]) => {
        this.attendanceCollection = items.map((item) => {
          return {
            ...item,
            user: this.afs.collection('users').doc<User>(item.id).valueChanges().pipe(trace('firestore')),
          };
        });
      });
  }

  ngOnInit() {}

  getDateFromTimestamp(timestamp: any): Date {
    return fromUnixTime(timestamp.seconds);
  }
}

interface attendance {
  user: Observable<User>;
  time: string | number | Date;
  id?: string;
}
