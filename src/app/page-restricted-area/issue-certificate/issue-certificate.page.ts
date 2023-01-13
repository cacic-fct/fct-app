import { ModalController } from '@ionic/angular';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  participationTypes,
  eventTypes,
  contentTypes,
  certificateTemplates,
} from './../../shared/services/certificates.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-issue-certificate',
  templateUrl: './issue-certificate.page.html',
  styleUrls: ['./issue-certificate.page.scss'],
})
export class IssueCertificatePage implements OnInit {
  public participationTypes = participationTypes;
  public eventTypes = eventTypes;
  public contentTypes = contentTypes;
  public certificateTemplates = certificateTemplates;

  dataForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private modalController: ModalController) {
    this.dataForm = this.formBuilder.group({
      issueToEveryone: [true, Validators.required],
      issueList: new FormArray([]),
      certificateName: ['', Validators.required],
      certificateID: ['', Validators.required],
      certificateTemplate: ['', Validators.required],
      issuingDate: ['', Validators.required],
      participationType: ['', Validators.required],
      eventType: ['', Validators.required],
      contentType: ['', Validators.required],
    });
  }

  ngOnInit() {}

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
      .toLowerCase();

    this.dataForm.get('certificateID')?.setValue(certificateID);
  }
}
