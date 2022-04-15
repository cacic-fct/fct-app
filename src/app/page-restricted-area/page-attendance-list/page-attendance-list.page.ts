import { Component, OnInit } from '@angular/core';
import { parseISO } from 'date-fns';

@Component({
  selector: 'app-page-attendance-list',
  templateUrl: './page-attendance-list.page.html',
  styleUrls: ['./page-attendance-list.page.scss'],
})
export class PageAttendanceListPage implements OnInit {
  dateAsString: string = new Date().toISOString()
  properDate: Date = new Date(this.dateAsString);
  constructor() { }

  ngOnInit() {}

  updateDate(dateString: string) {
    this.dateAsString = dateString;
    this.properDate = parseISO(dateString);
  }
}
