import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-supabase-tools',
  templateUrl: './supabase-tools.page.html',
  styleUrls: ['./supabase-tools.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, CommonModule, FormsModule],
})
export class SupabaseToolsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
