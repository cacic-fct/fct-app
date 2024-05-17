import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter } from '@ionic/angular/standalone';
import { DebugScannerPage } from 'src/app/debug-scanner/debug-scanner.page';

@Component({
  selector: 'app-debug-scanner-page',
  templateUrl: './debug-scanner-page.page.html',
  styleUrls: ['./debug-scanner-page.page.scss'],
  standalone: true,
  imports: [IonFooter, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, DebugScannerPage],
})
export class DebugScannerPagePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
