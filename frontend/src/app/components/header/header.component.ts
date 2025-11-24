import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toast-container" *ngIf="toastMessage">
      <div class="custom-toast" [ngClass]="toastType === 'success' ? 'toast-success' : 'toast-error'">
        <div class="d-flex align-items-center">
          <i class="bi fs-4 me-3" [ngClass]="toastType === 'success' ? 'bi-check-circle' : 'bi-x-circle'"></i>
          <span>{{ toastMessage }}</span>
        </div>
        <button class="btn-close ms-3" (click)="toastMessage = ''"></button>
      </div>
    </div>

    <header class="navbar px-4 py-2 border-bottom" [style.background-color]="'var(--header-bg)'">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-journal-text fs-3 text-primary"></i>
        <h4 class="m-0 fw-bold text-primary">MyNotes</h4>
      </div>

      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-outline-secondary border-0" (click)="toggleTheme()" title="Téma váltása">
          <i class="bi" [ngClass]="isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'"></i>
        </button>

        <div class="position-relative">
          <div (click)="showMenu = !showMenu" style="cursor: pointer;" class="d-flex align-items-center gap-2">
            <img *ngIf="user?.avatarUrl" [src]="user.avatarUrl" 
                 class="rounded-circle border" width="40" height="40" style="object-fit: cover;">
            <div *ngIf="!user?.avatarUrl" class="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white" 
                 style="width: 40px; height: 40px;">
              <i class="bi bi-person-fill fs-5"></i>
            </div>
          </div>

          <div *ngIf="showMenu" class="dropdown-menu show position-absolute end-0 mt-2 shadow" style="min-width: 220px; z-index: 1000;">
            <div class="px-3 py-2 border-bottom">
              <span class="small text-muted">Bejelentkezve mint:</span><br>
              <strong>{{ user?.username }}</strong>
            </div>
            <button class="dropdown-item py-2" (click)="openProfileModal()">
              <i class="bi bi-gear me-2"></i> Beállítások
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item py-2 text-danger" (click)="logout()">
              <i class="bi bi-box-arrow-right me-2"></i> Kijelentkezés
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="modal d-block" tabindex="-1" *ngIf="isProfileModalOpen" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-person-circle me-2"></i> Profil szerkesztése</h5>
            <button type="button" class="btn-close" (click)="isProfileModalOpen = false"></button>
          </div>
          
          <div class="modal-body">
            <div class="mb-4 text-center">
              <div class="position-relative d-inline-block">
                <img [src]="user?.avatarUrl || 'assets/placeholder.png'" 
                     class="rounded-circle border mb-2" width="100" height="100" style="object-fit: cover; background: #eee;">
                <br>
                <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none" accept="image/*">
                <button class="btn btn-sm btn-outline-primary mt-2" (click)="fileInput.click()">
                  <i class="bi bi-camera-fill"></i> Kép cseréje
                </button>
              </div>
            </div>
            
            <hr>
            <label class="form-label small text-muted">Jelszó módosítása</label>
            
            <div class="input-group mb-2">
              <span class="input-group-text bg-light"><i class="bi bi-shield-lock"></i></span>
              <input [(ngModel)]="editUser.oldPassword" type="password" class="form-control" placeholder="Jelenlegi jelszó">
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text"><i class="bi bi-key"></i></span>
              <input [(ngModel)]="editUser.newPassword" type="password" class="form-control" placeholder="Új jelszó">
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="isProfileModalOpen = false">Mégsem</button>
            <button class="btn btn-primary" (click)="saveProfile()">
              <i class="bi bi-check-lg me-1"></i> Mentés
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HeaderComponent implements OnInit {
  user: any = {};
  
  editUser: any = {};
  
  showMenu = false;
  isDarkMode = false;
  isProfileModalOpen = false;

  toastMessage = '';
  toastType = 'success';

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.loadUser();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.setAttribute('data-theme', 'dark');
    }
  }

  loadUser() {
    this.http.get('http://localhost:8080/api/auth/me').subscribe({
      next: (u) => this.user = u,
      error: () => this.auth.logout()
    });
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post('http://localhost:8080/api/auth/upload-avatar', formData).subscribe({
        next: (updatedUser: any) => {
          this.user.avatarUrl = updatedUser.avatarUrl;
          this.showToast('Profilkép sikeresen frissítve!', 'success');
        },
        error: () => this.showToast('Hiba a feltöltéskor', 'error')
      });
    }
  }

  saveProfile() {
    const payload = {
      oldPassword: this.editUser.oldPassword,
      newPassword: this.editUser.newPassword
    };

    this.http.put('http://localhost:8080/api/auth/profile', payload).subscribe({
      next: () => {
        this.isProfileModalOpen = false;
        this.editUser.oldPassword = '';
        this.editUser.newPassword = '';
        this.showToast('Jelszó sikeresen módosítva!', 'success');
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.error || 'Hiba a mentéskor';
        this.showToast(errorMsg, 'error');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  logout() {
    this.auth.logout();
  }

  openProfileModal() {
    this.editUser = { ...this.user, oldPassword: '', newPassword: '' };
    this.showMenu = false;
    this.isProfileModalOpen = true;
  }
}