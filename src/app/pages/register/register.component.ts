import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  <div class="container d-flex align-items-center justify-content-center" style="min-height: 100vh;">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      
      <h2 class="text-center mb-4 fw-bold text-primary">
        <i class="bi bi-journal-text"></i> MyNotes
      </h2>
      <h4 class="text-center mb-4">Fiók létrehozása</h4>

      <div *ngIf="errorMessage" class="alert alert-danger d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
      </div>

      <form (ngSubmit)="onRegister()" #registerForm="ngForm">
        
        <div class="mb-3">
          <label class="form-label">Email cím</label>
          <input [(ngModel)]="email" 
                 name="email" 
                 type="email" 
                 class="form-control" 
                 placeholder="pelda@mail.com" 
                 required 
                 email 
                 #emailInput="ngModel"> <div *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)" class="text-danger small mt-1">
            <div *ngIf="emailInput.errors?.['required']">Az email cím kötelező.</div>
            <div *ngIf="emailInput.errors?.['email']">Nem érvényes email formátum.</div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Felhasználónév</label>
          <input [(ngModel)]="username" 
                 name="username" 
                 class="form-control" 
                 placeholder="Válassz nevet" 
                 required
                 #usernameInput="ngModel">
          <div *ngIf="usernameInput.invalid && (usernameInput.dirty || usernameInput.touched)" class="text-danger small mt-1">
             A felhasználónév kötelező.
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Jelszó</label>
          <input [(ngModel)]="password" 
                 name="password" 
                 type="password" 
                 class="form-control" 
                 placeholder="Jelszó (min. 6 karakter)" 
                 required 
                 minlength="6"
                 #passwordInput="ngModel">
          
          <div *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)" class="text-danger small mt-1">
            <div *ngIf="passwordInput.errors?.['required']">A jelszó kötelező.</div>
            <div *ngIf="passwordInput.errors?.['minlength']">Legalább 6 karakter hosszúnak kell lennie.</div>
          </div>
        </div>

        <div class="d-grid gap-2 mt-4">
          <button type="submit" 
                  class="btn btn-primary btn-lg" 
                  [disabled]="!registerForm.valid">
            Regisztrálok <i class="bi bi-person-plus"></i>
          </button>
        </div>
      </form>

      <div class="mt-4 text-center border-top pt-3">
        <p class="text-muted mb-1">Már van fiókod?</p>
        <a routerLink="/login" class="btn btn-link">Jelentkezz be</a>
      </div>

    </div>
  </div>
`
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) { }

  onRegister() {
    this.auth.register({ email: this.email, username: this.username, password: this.password }).subscribe({
      next: () => {
        alert('Sikeres regisztráció! Most jelentkezz be.');
        this.router.navigate(['/login']);
      },
      error: () => this.errorMessage = 'Hiba! A név valószínűleg már foglalt.'
    });
  }
}