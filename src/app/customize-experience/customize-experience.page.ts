import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customize-experience',
  templateUrl: './customize-experience.page.html',
  styleUrls: ['./customize-experience.page.scss'],
})
export class CustomizeExperiencePage implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  // Register answer on local storage
  registerAnswer(answer: string) {
    localStorage.setItem('isUnesp', answer);

    // Navigate to calendario page
    this.router.navigate(['/calendario']);
  }
}
