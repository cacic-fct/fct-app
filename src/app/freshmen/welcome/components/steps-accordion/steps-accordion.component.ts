import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-steps-accordion',
    templateUrl: './steps-accordion.component.html',
    styleUrls: ['./steps-accordion.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        MarkdownModule,
        RouterLink,
    ],
})
export class StepsAccordionComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
