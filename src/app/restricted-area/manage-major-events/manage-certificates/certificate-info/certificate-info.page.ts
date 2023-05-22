import { Component, inject, OnInit } from '@angular/core';
import { doc, DocumentReference, Firestore, DocumentData, docData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CertificateAdminData, CertificateStoreData } from 'src/app/shared/services/certificates.service';
import { DateService } from 'src/app/shared/services/date.service';

@Component({
  selector: 'app-certificate-info',
  templateUrl: './certificate-info.page.html',
  styleUrls: ['./certificate-info.page.scss'],
})
export class CertificateInfoPage implements OnInit {
  private firestore: Firestore = inject(Firestore);
  eventID: string | null;
  certificateID: string | null;
  docRef: DocumentReference<DocumentData>;
  docData$: Observable<CertificateStoreData>;

  docAdminRef: DocumentReference<DocumentData>;
  docAdminData$: Observable<CertificateAdminData>;

  constructor(private route: ActivatedRoute, private router: Router, public dateService: DateService) {
    this.eventID = this.route.snapshot.paramMap.get('eventID');
    this.certificateID = this.route.snapshot.paramMap.get('certificateID');

    if (!this.eventID || !this.certificateID === null) {
      this.router.navigate(['/area-restrita/gerenciar-grandes-eventos']);
    }

    this.docRef = doc(this.firestore, `majorEvents/${this.eventID}/certificates/${this.certificateID}`);
    this.docData$ = docData(this.docRef, { idField: 'id' }) as Observable<CertificateStoreData>;

    this.docAdminRef = doc(this.firestore, `majorEvents/${this.eventID}/certificates/${this.certificateID}/admin/data`);
    this.docAdminData$ = docData(this.docAdminRef) as Observable<any>;
  }

  ngOnInit() {}
}
