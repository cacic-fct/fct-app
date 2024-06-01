// @ts-strict-ignore
import { KeyValue, KeyValuePipe } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { CoursesService } from 'src/app/shared/services/courses.service';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonCheckbox,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonCheckbox,
    KeyValuePipe,
  ],
})
// TODO: Refactor me
export class FilterModalPage implements AfterViewInit {
  courses = CoursesService.courses;

  constructor(private modalController: ModalController) {}

  @Input() selectedFilter: {
    courses: string[];
  };

  ngAfterViewInit() {
    const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('course');

    for (const element of elements) {
      const checkbox = element as HTMLInputElement;
      // Check checkboxes that have id matching selectedFilter
      if (this.selectedFilter['courses'].includes(checkbox.id)) {
        checkbox.checked = true;
      }
    }
  }

  checkBoxClickCourse(coursekey: string) {
    const coursesArray = this.selectedFilter['courses'];
    // Add coursekey to array if not present. If present, remove it
    if (coursesArray.includes(coursekey)) {
      coursesArray.splice(coursesArray.indexOf(coursekey), 1);
    } else {
      coursesArray.push(coursekey);
    }
    this.selectedFilter['courses'] = coursesArray;
  }
  uncheckAll() {
    // Get elements with course.key id
     
    const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('course');
    // Uncheck all elements
    for (const element of elements) {
      const checkbox = element as HTMLInputElement;
      checkbox.checked = false;
    }
    // Clear all selectedFilter keys
    this.selectedFilter['courses'] = [];
  }

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
      selectedFilter: this.selectedFilter,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  originalOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): number => {
    return 0;
  };
}
