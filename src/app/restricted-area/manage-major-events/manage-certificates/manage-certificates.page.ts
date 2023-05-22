import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { collection, collectionData, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CertificateStoreData } from 'src/app/shared/services/certificates.service';

@Component({
  selector: 'app-manage-certificates',
  templateUrl: './manage-certificates.page.html',
  styleUrls: ['./manage-certificates.page.scss'],
})
export class ManageCertificatesPage implements OnInit {
  eventID: string | null;

  private firestore: Firestore = inject(Firestore);
  certificatesRef: CollectionReference<DocumentData>;
  certificates$: Observable<CertificateStoreData[]>;

  @ViewChild('swalNotFound')
  public readonly swalNotFound!: SwalComponent;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.eventID = this.route.snapshot.paramMap.get('eventID');

    if (this.eventID === null) {
      this.swalNotFound.fire();
      this.router.navigate(['/area-restrita/gerenciar-grandes-eventos']);
    }

    this.certificatesRef = collection(this.firestore, `majorEvents/${this.eventID}/certificates`);
    this.certificates$ = collectionData(this.certificatesRef, { idField: 'id' }) as Observable<CertificateStoreData[]>;
  }

  ngOnInit() {}
}
