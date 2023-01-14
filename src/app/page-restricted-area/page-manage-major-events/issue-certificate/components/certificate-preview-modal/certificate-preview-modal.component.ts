import {
  participationTypes,
  eventTypes,
  contentTypes,
  CertificateTemplateData,
} from './../../../../../shared/services/certificates.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-certificate-preview-modal',
  templateUrl: './certificate-preview-modal.component.html',
  styleUrls: ['./certificate-preview-modal.component.scss'],
})
export class CertificatePreviewModalComponent implements OnInit {
  @Input() certificateData!: CertificateTemplateData;

  constructor() {}

  ngOnInit() {
    console.log(this.certificateData);
  }

  formatParticipation(): string {
    return this.certificateData.participation.type === 'custom'
      ? this.certificateData.participation.custom
      : participationTypes[this.certificateData.participation.type];
  }

  formatEventType(): string {
    return this.certificateData.event.type === 'custom'
      ? this.certificateData.event.custom
      : eventTypes[this.certificateData.event.type];
  }

  formatContentType(): string {
    return this.certificateData.content.type === 'custom'
      ? this.certificateData.content.custom
      : contentTypes[this.certificateData.content.type];
  }
}
