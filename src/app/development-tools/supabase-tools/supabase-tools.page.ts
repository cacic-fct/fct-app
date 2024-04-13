import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonInput,
  IonItem,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { SupabaseAuthService } from 'src/app/shared/services/supabase-auth.service';

@Component({
  selector: 'app-supabase-tools',
  templateUrl: './supabase-tools.page.html',
  styleUrls: ['./supabase-tools.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonItem,
    IonInput,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    CommonModule,
    FormsModule,
  ],
})
export class SupabaseToolsPage implements OnInit {
  emailInput: string = '';
  passwordInput: string = '';

  constructor(public supabaseAuth: SupabaseAuthService) {}

  login(): void {
    this.supabaseAuth.signIn(this.emailInput, this.passwordInput);
  }

  logout(): void {
    this.supabaseAuth.signOut();
  }

  ngOnInit() {}
}
