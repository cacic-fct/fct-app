import { CacicTemplateInput, CertificateService } from './../../../../shared/services/certificates.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { HttpClient } from '@angular/common/http';

import { Template, Viewer } from '@pdfme/ui';

@Component({
  selector: 'app-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.scss'],
})
export class PreviewModalComponent implements OnInit {
  constructor(private certificateService: CertificateService, private http: HttpClient) {}

  ngOnInit() {
    this.previewCertificate();
  }

  previewCertificate() {
    const domContainer = document.getElementById('pdf-viewer');
    if (!domContainer) {
      return;
    }
    const templateURL = this.certificateService.getTemplateURL('cacic');

    this.http
      .get(templateURL)
      .pipe(take(1))
      .subscribe((template: any) => {
        if (template) {
          const inputsa: CacicTemplateInput = {
            date: 'Lorem',
            participationType: 'Lorem',
            eventType: 'Lorem',
            content: 'Lorem',
            name: 'Lorem',
            eventName: 'Lorem',
            document: 'Lorem',
          };

          const inputs = this.certificateService.cacicCertificatePreviewInputs(inputsa);

          const viewer = new Viewer({ domContainer, template, inputs });
        }
      });
  }
}
