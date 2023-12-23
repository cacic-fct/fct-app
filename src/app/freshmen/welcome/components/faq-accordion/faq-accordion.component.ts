import { Component, OnInit } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-faq-accordion',
    templateUrl: './faq-accordion.component.html',
    styleUrls: ['./faq-accordion.component.scss'],
    standalone: true,
    imports: [IonicModule, MarkdownModule],
})
export class FaqAccordionComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
