import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { FormGroup, FormControl } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-page-search-user',
  templateUrl: './page-search-user.page.html',
  styleUrls: ['./page-search-user.page.scss'],
})
export class PageSearchUserPage implements OnInit {
  userSearchForm: FormGroup = new FormGroup({
    userData: new FormControl(''),
  });

  constructor(private fns: AngularFireFunctions) {}

  ngOnInit() {}

  onSubmit() {
    const getUserProfile = this.fns.httpsCallable('getUserProfile');
    getUserProfile({ string: this.userSearchForm.value.userData })
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
      });
  }
}
