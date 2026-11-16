package com.memento.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.memento.backend.model.Note;
import com.memento.backend.model.valueObjects.Attachment;
import com.memento.backend.model.valueObjects.Bounds;
import com.memento.backend.service.NoteService;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*") // dominio sin restricciones para desarrollo local, cambiar en producción
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // 1. Create NOTE
    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        Note created = noteService.createNote(note);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 2. GET NOTE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable String id) {
        Note note = noteService.getNoteById(id);
        return note != null ? ResponseEntity.ok(note) : ResponseEntity.notFound().build();
    }

    // Get all notes from topic
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<Note>> getNotesByTopic(@PathVariable String topicId) {
        return ResponseEntity.ok(noteService.getNotesByTopicId(topicId));
    }

    // 3. PARTIAL UPDATES
    // update the content of the note
    @PatchMapping("/{id}/body")
    public ResponseEntity<Void> updateBody(@PathVariable String id, @RequestBody String newBody) {
        Note updatedBody = noteService.updateBody(id, newBody);
        return updatedBody != null ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // update the position and dimensions of the note
    @PatchMapping("/{id}/bounds")
    public ResponseEntity<Note> updateBounds(@PathVariable String id, @RequestBody Bounds newBounds) {
        Note updated = noteService.updateBounds(id, newBounds);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // Post an attachment to a note
    @PostMapping("/{id}/attachments")
    public ResponseEntity<Void> addAttachment(@PathVariable String id, @RequestBody Attachment attachment) {
        boolean added = noteService.addAttachment(id, attachment);
        return added ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // 4. delete a note by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable String id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    //Move note to another topic
    @PatchMapping("/{id}/topic")
    public ResponseEntity<Note> moveNoteToTopic(@PathVariable String id, @RequestParam String newTopicId){
        Note note = noteService.moveNoteToTopic(id, newTopicId);
        return note != null ? ResponseEntity.ok(note) : ResponseEntity.notFound().build();
    }
}