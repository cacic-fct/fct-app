import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DateService } from 'src/app/shared/services/date.service';
import { MajorEventItem } from './../../shared/services/major-event.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { addDays } from 'date-fns';
import { pipe, take } from 'rxjs';

@Component({
  selector: 'app-populate-database',
  templateUrl: './populate-database.page.html',
  styleUrls: ['./populate-database.page.scss'],
})
export class PopulateDatabasePage implements OnInit {
  constructor(
    private fns: AngularFireFunctions,
    private afs: AngularFirestore,
    private dateService: DateService,
    private auth: AngularFireAuth
  ) {}

  ngOnInit() {}

  createAdmin() {
    const createAdmin = this.fns.httpsCallable('populate_db-create_users-createAdminUser');
    createAdmin(null).pipe(take(1)).subscribe();
  }

  paidMajorEvent() {
    this.afs.collection<MajorEventItem>('majorEvents').add({
      name: 'Grande evento pago',
      course: '12',
      description: 'Futuro grande evento pago gerado automaticamente com inscrição aberta.',
      eventStartDate: this.dateService.timestampFromDate(addDays(new Date(), 4)),
      eventEndDate: this.dateService.timestampFromDate(addDays(new Date(), 6)),
      subscriptionStartDate: this.dateService.timestampFromDate(new Date()),
      subscriptionEndDate: this.dateService.timestampFromDate(addDays(new Date(), 2)),
      maxCourses: 2,
      maxLectures: 2,
      price: {
        students: 12,
        otherStudents: 12,
        professors: 12,
      },
      paymentInfo: {
        chavePix: 'chave@pix.com',
        bankName: 'Banco',
        name: 'Nome do beneficiário',
        document: '000.000.000-00',
        agency: '1234',
        accountNumber: '0000000000',
        additionalPaymentInformation: 'Pagável presencialmente',
      },
      button: {
        text: 'Visite nosso site',
        url: 'https://google.com',
      },
      public: true,
      createdBy: 'populate-db',
      createdOn: this.dateService.timestampFromDate(new Date()),
      events: ['12', '13'],
    });
  }
}
