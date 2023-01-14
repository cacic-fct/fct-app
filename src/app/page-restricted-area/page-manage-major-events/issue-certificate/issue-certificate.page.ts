import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  participationTypes,
  eventTypes,
  contentTypes,
  certificateTemplates,
} from '../../../shared/services/certificates.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

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

  @ViewChild('swalNotFound')
  public readonly swalNotFound!: SwalComponent;

  eventType: string | null;
  eventID: string | null;

  dataForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.eventType = this.route.snapshot.paramMap.get('eventType');
    this.eventID = this.route.snapshot.paramMap.get('eventID');

    if (this.eventType === null || this.eventID === null) {
      this.swalNotFound.fire();
      this.router.navigate(['/area-restrita']);
    }

    this.dataForm = this.formBuilder.group({
      issueType: ['', Validators.required],
      issueList: this.formBuilder.array([]),
      batchIssue: this.formBuilder.group({
        toPaid: [true, Validators.required],
        toNonSubscriber: [false, Validators.required],
        toNonPaid: [false, Validators.required],
      }),
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

  addToIssueList() {
    const issueList = this.dataForm.get('issueList') as FormArray;
    issueList.push(
      this.formBuilder.group({
        userData: ['', Validators.required],
      })
    );
  }

  issueCheckboxChange() {
    if (this.dataForm.get('issueType')?.value === 'list') {
      if (this.getIssueList().length === 0) {
        this.addToIssueList();
      }
    }
  }

  removeIssueList(i: number) {
    if (this.getIssueList().length === 1) {
      return;
    }
    const issueList = this.dataForm.get('issueList') as FormArray;
    issueList.removeAt(i);
  }

  getIssueList() {
    return (this.dataForm.get('issueList') as FormArray).controls;
  }

  clearIssueList() {
    const issueList = this.dataForm.get('issueList') as FormArray;
    issueList.clear();
    this.addToIssueList();
  }

  async clearIssueListAlert() {
    const alert = await this.alertController.create({
      header: 'Limpar lista',
      message: 'Tem certeza que deseja limpar a lista de usuários?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Limpar',
          handler: () => {
            this.clearIssueList();
          },
        },
      ],
    });

    await alert.present();
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
}
