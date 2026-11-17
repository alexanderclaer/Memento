package com.memento.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.memento.backend.model.Note;
import com.memento.backend.model.valueObjects.Attachment;
import com.memento.backend.model.valueObjects.Bounds;
import com.memento.backend.model.valueObjects.Content;
import com.memento.backend.repository.NoteRepository;
import com.memento.backend.repository.TopicRepository;

/**
 * NoteService
 */
@Service
public class NoteService {
    private final NoteRepository noteRepository;
    private final TopicRepository topicRepository;

    public NoteService(NoteRepository noteRepository, TopicRepository topicRepository) {
        this.noteRepository = noteRepository;
        this.topicRepository = topicRepository;
    }

    public Note createNote(Note note) {
        return noteRepository.save(note);
    }

    public Note updateNote(Note note) {
        if (note.getId() == null || !noteRepository.existsById(note.getId())) {
            return null;
        }
        return noteRepository.save(note);
    }

    public Note findById(String id) {
        return noteRepository.findById(id).orElse(null);
    }

    public Note updateNoteById(String id, Note updatedNote) {
        updatedNote.setId(id);
        return noteRepository.save(updatedNote);
    }

    public void updateNoteContent(String id, Content newContent) {
        Note existingNote = noteRepository.findById(id).orElse(null);
        if (existingNote != null) {
            existingNote.setContent(newContent);
            updateNote(existingNote);
        }
    }

    public Note updateBody(String id, String newBody){
        Note existingNote = noteRepository.findById(id).orElse(null);
        if (existingNote == null) {
            return null;
        }
        existingNote.updateContentBody(newBody);
        return updateNote(existingNote);
    }

    public Note updateBounds(String id, Bounds newBounds) {
        Note existingNote = noteRepository.findById(id).orElse(null);
        if (existingNote != null) {
            existingNote.setBounds(newBounds);
            updateNote(existingNote);
            return existingNote;
        }
        return null;
    }

    public Note moveNoteToTopic(String noteId, String newTopicId) {
        Note existingNote = findById(noteId);
        if (existingNote != null && topicRepository.existsById(newTopicId)) {
            existingNote.setTopicId(newTopicId);
            return updateNote(existingNote);
        }
        return null;
    }

    public void deleteNote(String id) {
        noteRepository.deleteById(id);
    }

    public void deleteByTopicId(String topicId) {
        noteRepository.deleteByTopicId(topicId);
    }

    // Método clave para Memento: Agregar adjuntos de forma independiente
    public boolean addAttachment(String id, Attachment attachment) {
        Note note = noteRepository.findById(id).orElse(null);
        if (note != null) {
            note.addAttachment(attachment); // Delegación en el modelo
            updateNote(note);
            return true;
        }
        return false;
    }

    public void deleteAttachment(String noteId, String attachmentId) {
        Note note = noteRepository.findById(noteId).orElse(null);
        if (note != null) {
            List<Attachment> attachments = note.getAttachments();
            attachments.removeIf(att -> att.getId().equals(attachmentId));
            updateNote(note);
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
}
