import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { first, map, Observable } from 'rxjs';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { EventItem } from 'src/app/shared/services/event';
import { User } from 'src/app/shared/services/user';
import { fromUnixTime } from 'date-fns';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Timestamp } from '@firebase/firestore-types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

interface Attendance {
  user: Observable<User>;
  time: Timestamp;
  id?: string;
}

@UntilDestroy()
@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  @ViewChild('mySwal')
  private mySwal: SwalComponent;

  attendanceCollection$: Observable<Attendance[]>;
  eventID: string;
  event$: Observable<EventItem>;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    public courses: CoursesService
  ) {}

  ngOnInit() {
    this.eventID = this.route.snapshot.params.eventID;
    this.afs
      .collection('events')
      .doc(this.eventID)
      .get()
      .pipe(untilDestroyed(this), trace('firestore'))
      .subscribe((document) => {
        if (!document.exists) {
          this.router.navigate(['area-restrita/coletar-presenca']);
          this.mySwal.fire();
          setTimeout(() => {
            this.mySwal.close();
          }, 1000);
        }
      });

    this.event$ = this.afs.collection('events').doc<EventItem>(this.eventID).valueChanges().pipe(trace('firestore'));

    this.attendanceCollection$ = this.afs
      .collection<Attendance>(`events/${this.eventID}/attendance`, (ref) => {
        return ref.orderBy('time', 'desc');
      })
      .valueChanges({ idField: 'id' })
      .pipe(
        untilDestroyed(this),
        trace('firestore'),
        map((attendance) => {
          return attendance.map((item) => {
            return {
              ...item,
              user: this.afs.collection('users').doc<User>(item.id).valueChanges().pipe(trace('firestore'), first()),
            };
          });
        })
      );
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  generateCSV() {
    this.afs
      .collection<User>('users')
      .valueChanges({ idfield: 'id' })
      .pipe(first(), trace('firestore'))
      .subscribe((users) => {
        const csv = [];
        const headers = ['Nome', 'RA', 'Email', 'Data_locale', 'Data_iso'];
        csv.push(headers);
        this.attendanceCollection$.pipe(first()).subscribe((attendanceCol) => {
          attendanceCol.forEach((attendance) => {
            const user = users.find((user) => user.uid === attendance.id);
            const row = [
              user.displayName,
              user.academicID,
              user.email,
              this.getDateFromTimestamp(attendance.time).toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
              this.getDateFromTimestamp(attendance.time).toISOString(),
            ];
            csv.push(row);
          });

          this.event$.pipe(first()).subscribe((event) => {
            const csvString = csv.map((row) => row.join(',')).join('\n');
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(new Blob([csvString], { type: 'text/csv' }));
            a.download = `${event.name}_${this.getDateFromTimestamp(event.eventStartDate).toISOString()}.csv`;
            a.click();
          });
        });
      });
  }
}
