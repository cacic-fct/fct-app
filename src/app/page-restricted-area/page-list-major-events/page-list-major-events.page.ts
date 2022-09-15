import { Component, OnInit } from '@angular/core';
import { startOfMonth, endOfMonth, addDays, format, parseISO } from 'date-fns'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
export interface Evento { content: string; course: string; date: Date; name: String; }

@Component({
  selector: 'app-page-list-major-events',
  templateUrl: './page-list-major-events.page.html',
  styleUrls: ['./page-list-major-events.page.scss'],
})
export class PageListMajorEventsPage implements OnInit {
  itemsCollection: AngularFirestoreCollection<Evento>;
  item: Evento = { content: '', course: '', date: new Date(), name: '' }
  currentDay: String = format(new Date(), 'dd/MM/yyyy');
  limitDate: String = format(addDays(new Date(), 365), 'dd/MM/yyyy');
  eventsArray: Evento[] = [];
  eventsDates: string[] = [];
  items: Observable<Evento[]>;

  constructor(private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Evento>('events');
    this.items = this.itemsCollection.valueChanges();
  }

  async ngOnInit() {
    let events = await this.itemsCollection.ref.where('date', '<', endOfMonth(new Date)).where('date', '>', startOfMonth(new Date)).get()
    console.log(events.size)

    events.docs.forEach(doc => { this.eventsArray.push(this.item = doc.data()) })

    //events.docs.forEach(doc => { this.eventsDates.push(format(this.item.date, 'dd/MM/yyyy'))})
    //console.log(this.eventsDates);

    /* for (let i = 0; i < this.eventsArray.length; i++) {
      this.eventsDates[i] = this.eventsArray[i].date.toLocaleString();
      console.log(format(this.eventsDates[i].date, 'dd/MM/yyyy'));
      console.log(this.eventsDates[i]);
    } */
  }

  /* formatDate(value: string) {
    return format(parseISO(value), 'dd/MM/yyyy HH:mm');
  } */

}

// firebase emulators:start --project fct-pp --import=./emulator-data --export-on-exit