import { CacicTemplateInput, CertificateService } from './../../../../shared/services/certificates.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.scss'],
})
export class PreviewModalComponent implements OnInit {
  constructor(private certificateService: CertificateService, private http: HttpClient) {}

  ngOnInit() {}
}
