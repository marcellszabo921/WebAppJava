import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container d-flex align-items-center justify-content-center" style="min-height: 100vh;">
      <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
        
        <h4 class="text-center mb-4">Új jelszó megadása</h4>

        <div *ngIf="message" class="alert" [ngClass]="isSuccess ? 'alert-success' : 'alert-danger'">
          {{ message }}
        </div>

        <form *ngIf="!isSuccess" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Új jelszó</label>
            <input [(ngModel)]="newPassword" name="newPassword" type="password" class="form-control" placeholder="Min. 6 karakter" required>
          </div>

          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary btn-lg">
              Mentés
            </button>
          </div>
        </form>

        <div *ngIf="isSuccess" class="d-grid mt-3">
           <a routerLink="/login" class="btn btn-primary">Tovább a belépéshez</a>
        </div>

      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  message = '';
  isSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.message = 'Hiba: Érvénytelen link!';
      }
    });
  }

  onSubmit() {
    if (!this.newPassword || this.newPassword.length < 6) {
      this.message = 'A jelszónak legalább 6 karakternek kell lennie.';
      return;
    }

    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.message = response;
        this.isSuccess = true;
      },
      error: (err) => {
        this.message = 'Hiba: ' + (err.error || 'A link lejárt vagy érvénytelen.');
      }
    });
  }
}