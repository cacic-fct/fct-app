import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  courses = CoursesService.courses;
  dateValue = '';

  dataForm: FormGroup = new FormGroup({
    course: new FormControl(''),
    icon: new FormControl(''),
    name: new FormControl(''),
    shortDescription: new FormControl(''),
    description: new FormControl(''),
    date: new FormControl(''),
    locationDescription: new FormControl(''),
    locationLat: new FormControl(''),
    locationLon: new FormControl(''),
    youtubeCode: new FormControl(''),
    public: new FormControl(''),
    buttonText: new FormControl(''),
    buttonUrl: new FormControl(''),
  });

  userData: any;
  constructor(public formBuilder: FormBuilder) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group(
      {
        course: ['', Validators.required],
        icon: ['', Validators.required],
        name: ['', Validators.required],
        shortDescription: ['', Validators.maxLength(80)],
        description: '',
        date: ['', Validators.required],
        locationDescription: '',
        locationLat: [
          '',
          [
            //Validators.pattern('^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$')
          ],
        ],
        locationLon: [
          '',
          [
            //Validators.pattern('^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$')
          ],
        ],
        youtubeCode: '',
        public: '',
        buttonText: '',
        buttonUrl: '',
      },
      {
        validators: [this.validatorLatLong, this.validatorButton],
      }
    );
    this.userData.displayName.replace(/%20/g, ' ');
  }

  formatDate(value: string) {
    return format(parseISO(value), 'dd/MM/yyyy HH:mm');
  }

  onSubmit(
    // TODO implementar
  ) {}

  validatorLatLong(control: AbstractControl): ValidationErrors | null {
    if (control.get('locationLat').value == '' && control.get('locationLon').value == '') {
      control.get('locationLat').removeValidators(Validators.required);
      control.get('locationLon').removeValidators(Validators.required);
    }

    if (control.get('locationLon').value != '') control.get('locationLat').addValidators(Validators.required);

    if (control.get('locationLat').value != '') control.get('locationLon').addValidators(Validators.required);

    return null;
  }

  validatorButton(control: AbstractControl): ValidationErrors | null {
    if (control.get('buttonText').value != '') control.get('buttonUrl').addValidators(Validators.required);
    else control.get('buttonUrl').removeValidators(Validators.required);

    return null;
  }
}
