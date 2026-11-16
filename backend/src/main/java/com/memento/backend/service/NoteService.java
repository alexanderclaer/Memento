package com.memento.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.memento.backend.model.Note;
import com.memento.backend.model.valueObjects.Attachment;
import com.memento.backend.model.valueObjects.Bounds;
import com.memento.backend.model.valueObjects.Content;
import com.memento.backend.repository.NoteRepository;

/**
 * NoteService
 */
@Service
public class NoteService {
    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public Note createNote(Note note) {
        return noteRepository.save(note);
    }

    public void updateNote(Note note) {
        noteRepository.save(note);
    }

    public void updateNoteById(String id, Note updatedNote) {
        updatedNote.setId(id);
        noteRepository.save(updatedNote);
    }

    public void updateNoteContent(String id, Content newContent) {
        Note existingNote = noteRepository.findById(id).orElse(null);
        if (existingNote != null) {
            existingNote.setContent(newContent);
            updateNote(existingNote);
        }
    }

    public void updateBody(String id, String newBody){
        Note existingNote = noteRepository.findById(id).orElse(null);
        if (existingNote != null) {
            existingNote.getContent().setBody(newBody);
            updateNote(existingNote);
        }
    }

    public void updateBounds(String id, Bounds newBounds) {
        Note existingNote = noteRepository.findById(id).orElse(null);
        if (existingNote != null) {
            existingNote.setBounds(newBounds);
            updateNote(existingNote);
        }
    }

    public void deleteNoteById(String id) {
        noteRepository.deleteById(id);
    }

    // Método clave para Memento: Agregar adjuntos de forma independiente
    public boolean addAttachment(String id, Attachment attachment) {
        Note note = noteRepository.findById(id).orElse(null);
        if (note != null) {
            note.addAttachment(attachment); // Delegación en el modelo
            noteRepository.save(note);
            return true;
        }
        return false;
    }

    public void deleteAttachment(String noteId, String attachmentId) {
        Note note = noteRepository.findById(noteId).orElse(null);
        if (note != null) {
            List<Attachment> attachments = note.getAttachments();
            attachments.removeIf(att -> att.getId().equals(attachmentId));
            noteRepository.save(note);
        }
    }

    public Bounds getBounds(String id) {
        Note note = noteRepository.findById(id).orElse(null);
        if (note != null) {
            return note.getBounds();
        }
        return null;
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public Note getNoteById(String id) {
        if (id == null || id.isEmpty()) {
            return null; // Manejo de caso nulo o vacío
        }
        if (!noteRepository.existsById(id)) {
            return null; // Manejo de caso donde la nota no existe
        }
        return noteRepository.findById(id).orElse(null);
    }

    public List<Note> getNotesByContentType(String contentType) {
        return noteRepository.findByContentContentType(contentType);
    }

    public List<Note> getNotesByTopicId(String topicId) {
        return noteRepository.findByTopicId(topicId);
    }

    public List<Note> getNotesByTitleContaining(String title) {
        return noteRepository.findByTitleContaining(title);
    }
}
