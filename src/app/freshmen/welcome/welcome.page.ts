import { Component, OnInit } from '@angular/core';
import { FaqAccordionComponent } from './components/faq-accordion/faq-accordion.component';
import { StepsAccordionComponent } from './components/steps-accordion/steps-accordion.component';
import { MarkdownModule } from 'ngx-markdown';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        MarkdownModule,
        StepsAccordionComponent,
        FaqAccordionComponent,
    ],
})
export class WelcomePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
