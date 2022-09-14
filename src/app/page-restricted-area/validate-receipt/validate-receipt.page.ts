import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-validate-receipt',
  templateUrl: './validate-receipt.page.html',
  styleUrls: ['./validate-receipt.page.scss'],
})
export class ValidateReceiptPage implements OnInit {
  eventId;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId')
  }

}
