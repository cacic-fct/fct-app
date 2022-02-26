import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/shared/services/courses.service';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {
  courses = CoursesService.courses;

  constructor() {}

  ngOnInit() {}

  clearSelection() {}
}
