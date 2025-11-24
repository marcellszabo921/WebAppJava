package com.example.noteapp.core.usecase;

import com.example.noteapp.core.domain.Note;
import com.example.noteapp.infrastructure.persistence.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;

    public List<Note> getNotesForUser(String userId) {
        return noteRepository.findByUserId(userId);
    }

    public Note createNote(Note note, String userId) {
        note.setUserId(userId);
        return noteRepository.save(note);
    }

    public void deleteNote(String id) {
        noteRepository.deleteById(id);
    }

    public Note updateNote(String id, Note noteDetails) {
        Note note = noteRepository.findById(id).orElseThrow();
        note.setTitle(noteDetails.getTitle());
        note.setContent(noteDetails.getContent());
        return noteRepository.save(note);
    }
}