import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.page.html',
  styleUrls: ['./page-login.page.scss'],
})
export class PageLoginPage implements OnInit {
  constructor(public authService: AuthService, public auth: AngularFireAuth, public router: Router) {
    this.auth
      .getRedirectResult()
      .then((result) => {
        console.log('yes');
        authService.SetUserData(result.user);
        this.router.navigate(['/menu']);
      })
      .catch((error) => {
        console.error('Login failed');
        console.error(error);
        authService.toastLoginFailed();
        authService.SignOut();
      });
  }

  ngOnInit() {}
}
