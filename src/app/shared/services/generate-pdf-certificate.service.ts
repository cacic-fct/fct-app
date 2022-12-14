import { Injectable } from '@angular/core';
import { Template, generate as PDFGenerate } from '@pdfme/generator';
import { take } from 'rxjs';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeneratePdfCertificateService {
  constructor(private http: HttpClient) {}

  public async generateCertificate(
    templateName: string,
    input: Record<string, string>,
    options?: generateCertificateOptions
  ) {
    const pdfJson = this.http.get(`assets/certificates/templates/${templateName}.json`, { responseType: 'json' });
    pdfJson.pipe(take(1)).subscribe(async (pdf) => {
      const template = pdf as Template;

      let font = {};

      switch (templateName) {
        case 'cacic':
          font = {
            Inter_Regular: {
              data: await fetch(
                'https://cdn.jsdelivr.net/gh/cacic-fct/fonts@main/Inter/latin-ext/inter-v12-latin-ext-regular.woff'
              ).then((res) => res.arrayBuffer()),
              fallback: true,
            },
            Inter_Medium: {
              data: await fetch(
                'https://cdn.jsdelivr.net/gh/cacic-fct/fonts@main/Inter/latin-ext/inter-v12-latin-ext-500.woff'
              ).then((res) => res.arrayBuffer()),
            },
            Inter_Light: {
              data: await fetch(
                'https://cdn.jsdelivr.net/gh/cacic-fct/fonts@main/Inter/latin-ext/inter-v12-latin-ext-300.woff'
              ).then((res) => res.arrayBuffer()),
            },
          };
          break;
      }

      let participationType = 'Certificamos a participação de';

      if (options?.online) {
        participationType = 'Certificamos a participação digital de';
      }

      let eventType: string = 'na atividade';

      switch (options?.eventType) {
        case 'majorEvent':
          eventType = 'no evento';
          break;
        case 'shortcourse':
          eventType = 'no minicurso';
          break;
        case 'lecture':
          eventType = 'na palestra';
          break;
      }

      const verificationURL = 'https://fct-pp.web.app/certificado/verificar/' + options?.certificateID;

      input = {
        ...input,
        event_type: eventType,
        participation_type: participationType,
        url: verificationURL,
        qrcode: verificationURL,
      };

      const inputs = [input];

      PDFGenerate({ template, inputs, options: { font } }).then((pdf) => {
        const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = 'certificate.pdf';
        a.click();
      });
    });
  }
}

export interface generateCertificateOptions {
  eventType?: 'majorEvent' | 'shortcourse' | 'lecture';
  online?: boolean;
  certificateID: string;
}
