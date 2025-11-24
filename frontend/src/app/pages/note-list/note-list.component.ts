import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  styles: [`
    .note-card {
      height: 200px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      overflow: hidden;
      position: relative;
    }
    .note-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .note-content-preview {
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: var(--text-color);
      opacity: 0.8;
    }
    .fab-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      z-index: 1000;
    }
  `],
  template: `
    <app-header></app-header>

    <div class="container mt-4">
      <div class="row g-4">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3" *ngFor="let note of notes">
          <div class="card note-card h-100 p-3" (click)="openNoteModal(note)">
            <h5 class="fw-bold mb-2 text-truncate">{{ note.title }}</h5>
            <div class="note-content-preview">
              {{ note.content }}
            </div>
          </div>
        </div>

        <div *ngIf="notes.length === 0" class="col-12 text-center mt-5 opacity-50">
          <i class="bi bi-journal-x fs-1"></i>
          <h4 class="mt-3">Még nincs jegyzeted.</h4>
          <p>Kattints a + gombra jobb alul!</p>
        </div>
      </div>
    </div>

    <button class="btn btn-primary fab-btn" (click)="openCreateModal()">
      <i class="bi bi-plus-lg"></i>
    </button>

    <div class="modal d-block" tabindex="-1" *ngIf="isModalOpen" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(2px);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg">
          
          <ng-container *ngIf="!isDeleteMode">
            <div class="modal-header border-0 pb-0">
              <input [(ngModel)]="currentNote.title" 
                     class="form-control form-control-lg border-0 fw-bold fs-4 bg-transparent" 
                     placeholder="Cím nélkül">
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>

            <div class="modal-body">
              <textarea [(ngModel)]="currentNote.content" 
                        class="form-control border-0 bg-transparent" 
                        style="resize: none; height: 300px; font-size: 1.1rem;" 
                        placeholder="Írj valamit..."></textarea>
            </div>

            <div class="modal-footer border-0 justify-content-between">
              <div>
                <button *ngIf="currentNote.id" (click)="isDeleteMode = true" class="btn btn-outline-danger border-0">
                  <i class="bi bi-trash"></i> Törlés
                </button>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-light" (click)="closeModal()">Mégsem</button>
                <button class="btn btn-primary px-4" (click)="saveNote()">
                  <i class="bi bi-check-lg me-1"></i> {{ currentNote.id ? 'Mentés' : 'Létrehozás' }}
                </button>
              </div>
            </div>
          </ng-container>

          <ng-container *ngIf="isDeleteMode">
            <div class="modal-header border-0">
              <h5 class="modal-title text-danger"><i class="bi bi-exclamation-triangle-fill"></i> Jegyzet törlése</h5>
            </div>
            <div class="modal-body">
              <p>Biztosan törölni szeretnéd ezt a jegyzetet? Ez a művelet nem visszavonható.</p>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="isDeleteMode = false">Mégsem</button>
              <button class="btn btn-danger" (click)="confirmDelete()">
                <i class="bi bi-trash-fill"></i> Igen, törlöm
              </button>
            </div>
          </ng-container>

        </div>
      </div>
    </div>
  `
})
export class NoteListComponent implements OnInit {
  notes: any[] = [];
  isModalOpen = false;
  isDeleteMode = false;
  currentNote: any = { title: '', content: '' };

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.noteService.getNotes().subscribe(data => this.notes = data);
  }

  openCreateModal() {
    this.currentNote = { title: '', content: '' };
    this.isDeleteMode = false;
    this.isModalOpen = true;
  }

  openNoteModal(note: any) {
    this.currentNote = { ...note };
    this.isDeleteMode = false;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isDeleteMode = false;
  }

  saveNote() {
    if (!this.currentNote.title && !this.currentNote.content) return;

    if (this.currentNote.id) {
      this.noteService.updateNote(this.currentNote.id, this.currentNote).subscribe(() => {
        this.loadNotes();
        this.closeModal();
      });
    } else {
      this.noteService.createNote(this.currentNote).subscribe(() => {
        this.loadNotes();
        this.closeModal();
      });
    }
  }

  confirmDelete() {
    this.noteService.deleteNote(this.currentNote.id).subscribe(() => {
      this.loadNotes();
      this.closeModal();
    });
  }
}