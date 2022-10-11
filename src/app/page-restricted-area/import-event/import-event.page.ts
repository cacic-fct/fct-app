import { GetUserUIDResponse } from './../../shared/services/auth.service';
import { isObservable, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-import-event',
  templateUrl: './import-event.page.html',
  styleUrls: ['./import-event.page.scss'],
})
export class ImportEventPage implements OnInit {
  notFound: string[];
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  uploadCSV(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const csvData = reader.result;
      const arrayData = this.csvToArray(csvData as string);
      // For every object in array
      for (let i = 0; i < arrayData.length; i++) {
        // Get key that is Endereço de e-mail
        const email = arrayData[i]['Endereço de e-mail'];
        // Get uid by email

        const response = this.authService.getUserUid(email);

        if (isObservable(response)) {
          response.pipe(take(1)).subscribe((response: GetUserUIDResponse) => {
            if (response.message) {
              this.notFound.push(email);
              return;
            }
            const uid = response.uid;
          });
        }
      }
    };
  }

  csvToArray(string: string) {
    const lines = string.split('\n');
    const result = [];
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result;
  }
}
