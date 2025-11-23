import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NoteListComponent } from './pages/note-list/note-list.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

const authGuard = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? true : false;
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },  
  { path: 'notes', component: NoteListComponent, canActivate: [authGuard] },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];