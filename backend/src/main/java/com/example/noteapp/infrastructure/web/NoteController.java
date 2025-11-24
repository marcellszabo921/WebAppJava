package com.example.noteapp.infrastructure.web;

import com.example.noteapp.core.domain.Note;
import com.example.noteapp.core.usecase.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class NoteController {
    private final NoteService noteService;

    @GetMapping
    public List<Note> getMyNotes(Principal principal) {
        return noteService.getNotesForUser(principal.getName());
    }

    @PostMapping
    public Note createNote(@RequestBody Note note, Principal principal) {
        return noteService.createNote(note, principal.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable String id) {
        noteService.deleteNote(id);
    }

    @PutMapping("/{id}")
    public Note updateNote(@PathVariable String id, @RequestBody Note note) {
        return noteService.updateNote(id, note);
    }
}