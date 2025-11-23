import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container d-flex align-items-center justify-content-center" style="min-height: 100vh;">
      <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
        
        <h2 class="text-center mb-4 fw-bold text-primary">
          <i class="bi bi-journal-text"></i> MyNotes
        </h2>
        <h4 class="text-center mb-4">Bejelentkezés</h4>

        <div *ngIf="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
        </div>

        <form (ngSubmit)="onLogin()">
          <div class="mb-3">
            <label class="form-label">Felhasználónév</label>
            <input [(ngModel)]="username" name="username" class="form-control" placeholder="Írd be a neved" required>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Jelszó</label>
            <input [(ngModel)]="password" name="password" type="password" class="form-control" placeholder="••••••••" required>
            </div>

          <div class="d-grid gap-2 mt-4">
            <button type="submit" class="btn btn-primary btn-lg">
              Belépés <i class="bi bi-box-arrow-in-right"></i>
            </button>
          </div>
        </form>

        <div class="mt-4 text-center border-top pt-3">
          <p class="text-muted mb-1">Nincs még fiókod?</p>
          <a routerLink="/register" class="btn btn-link">Regisztráció</a>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/notes']),
      error: () => this.errorMessage = 'Hibás felhasználónév vagy jelszó.'
    });
  }
}