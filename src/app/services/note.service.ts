import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = 'http://localhost:8080/api/notes';

  constructor(private http: HttpClient) { }

  // Jegyzetek lekérése
  getNotes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Jegyzet létrehozása
  createNote(note: { title: string; content: string }) {
    return this.http.post(this.apiUrl, note);
  }

  // Jegyzet törlése
  deleteNote(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateNote(id: string, note: { title: string; content: string }) {
    return this.http.put(`${this.apiUrl}/${id}`, note);
  }
}