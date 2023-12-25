import { Component, inject, OnInit } from '@angular/core';
import { doc, DocumentReference, Firestore, DocumentData, docData } from '@angular/fire/firestore';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CertificateAdminData, CertificateStoreData } from 'src/app/shared/services/certificates.service';
import { DateService } from 'src/app/shared/services/date.service';
import {
  certificateTemplates,
  eventTypes,
  participationTypes,
  contentTypes,
} from 'src/app/shared/services/certificates.service';
import { AsyncPipe, DatePipe, KeyValuePipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonText,
  IonIcon,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-certificate-info',
  templateUrl: './certificate-info.page.html',
  styleUrls: ['./certificate-info.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    DatePipe,
    // IonHeader,
    // IonToolbar,
    // IonButtons,
    // IonBackButton,
    // IonTitle,
    // IonContent,
    // IonText,
    // IonIcon,
    // IonButton,
    // IonCard,
    // IonCardHeader,
    // IonCardTitle,
    // IonCardContent,
    IonRouterLink,
    IonicModule,
    KeyValuePipe,
    ReactiveFormsModule,
  ],
})
export class CertificateInfoPage implements OnInit {
  private firestore: Firestore = inject(Firestore);
  eventID: string | null;
  certificateID: string | null;
  docRef: DocumentReference<DocumentData>;
  docData$: Observable<CertificateStoreData>;

  docAdminRef: DocumentReference<DocumentData>;
  docAdminData$: Observable<CertificateAdminData>;

  dataForm: FormGroup;
  disableEditing: boolean = true;

  certificateTemplates = certificateTemplates;
  eventTypes = eventTypes;
  participationTypes = participationTypes;
  contentTypes = contentTypes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dateService: DateService,
    private formBuilder: FormBuilder
  ) {
    this.eventID = this.route.snapshot.paramMap.get('eventID');
    this.certificateID = this.route.snapshot.paramMap.get('certificateID');

    if (!this.eventID || !this.certificateID === null) {
      this.router.navigate(['/area-restrita/gerenciar-grandes-eventos']);
    }

    this.dataForm = this.formBuilder.group({
      certificateName: ['', Validators.required],
      certificateID: ['', Validators.required],
      certificateTemplate: ['', Validators.required],

      extraText: [''],

      participationType: this.formBuilder.group(
        {
          type: ['', Validators.required],
          custom: [''],
        },
        {
          validators: [this.customGroupValidator],
        }
      ),

      eventType: this.formBuilder.group(
        {
          type: ['', Validators.required],
          custom: [''],
        },
        {
          validators: [this.customGroupValidator],
        }
      ),

      contentType: this.formBuilder.group(
        {
          type: ['', Validators.required],
          custom: [''],
        },
        {
          validators: [this.customGroupValidator],
        }
      ),
    });

    this.docRef = doc(this.firestore, `majorEvents/${this.eventID}/certificates/${this.certificateID}`);
    this.docData$ = docData(this.docRef, { idField: 'id' }) as Observable<CertificateStoreData>;

    this.docAdminRef = doc(
      this.firestore,
      `majorEvents/${this.eventID}/certificates/${this.certificateID}/certificateDataAdmin/data`
    );
    this.docAdminData$ = docData(this.docAdminRef) as Observable<any>;
  }

  ngOnInit() {}

  customGroupValidator(control: AbstractControl): ValidationErrors | null {
    const eventType = control.get('type')?.value;
    const custom = control.get('custom')?.value;

    if (eventType === 'custom' && custom === '') {
      return { customRequired: true };
    }
    return null;
  }

  batchIssueValidator(control: AbstractControl): ValidationErrors | null {
    // Only validate if issueType is batch
    const issueType = control.parent?.get('issueType')?.value;

    if (issueType !== 'batch') {
      return null;
    }

    const toPayer = control.get('toPayer')?.value;
    const toNonSubscriber = control.get('toNonSubscriber')?.value;
    const toNonPayer = control.get('toNonPayer')?.value;

    // At least one option must be selected
    if (!toPayer && !toNonSubscriber && !toNonPayer) {
      return { atLeastOneOption: true };
    }

    return null;
  }

  formatCertificateName() {
    const certificateName = this.dataForm.get('certificateName')?.value;
    let formatName = certificateName
      // Remove trailing spaces
      .trim()
      // Remove multiple spaces in a row
      .replace(/\s+/g, ' ');

    // Capitalize first letter
    formatName = formatName.charAt(0).toUpperCase() + formatName.slice(1);

    this.dataForm.get('certificateName')?.setValue(formatName);
  }

  formatCertificateID() {
    // Get string and format it to be used as a Firestore collection ID
    // Example: "Certificado de Participação" -> "certificado-de-participacao"

    const certificateName = this.dataForm.get('certificateName')?.value;
    const certificateID = certificateName
      // Remove accents ção -> cao
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Remove special characters
      .replace(/[^a-zA-Z0-9 ]/g, '')
      // Replace spaces with dashes
      .replace(/\s/g, '-')
      // Remove multiple dashes in a row '---' -> '-'
      .replace(/-+/g, '-')
      // Remove trailing dash
      .replace(/-$/, '')
      .toLowerCase();

    this.dataForm.get('certificateID')?.setValue(certificateID);
  }

  allowEditing() {
    this.disableEditing = false;
  }

  submitChanges() {
    this.disableEditing = true;
  }
}
