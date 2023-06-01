import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { Firestore, query, where, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-list-issued',
  templateUrl: './list-issued.page.html',
  styleUrls: ['./list-issued.page.scss'],
})
export class ListIssuedPage implements OnInit {
  eventID: string | null;
  certificateID: string | null;

  private firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.eventID = this.route.snapshot.paramMap.get('eventID');
    this.certificateID = this.route.snapshot.paramMap.get('certificateID');

    if (!this.eventID || !this.certificateID) {
      this.router.navigate(['/area-restrita/gerenciar-grandes-eventos']);
    }
  }

  async ngOnInit() {
    const col = collection(this.firestore, `certificates/${this.eventID}`);
    const q = query(col, where('certificateID', '==', this.certificateID));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
    });

    // this.certificateList$ = q;
  }
}
