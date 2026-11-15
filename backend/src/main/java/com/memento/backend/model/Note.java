package com.memento.backend.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.memento.backend.model.enums.NoteType;
import com.memento.backend.model.valueObjects.Attachment;
import com.memento.backend.model.valueObjects.Bounds;
import com.memento.backend.model.valueObjects.Content;

@Document(collection = "notes")
public class Note {

    @Id
    private String id;
    private Content content;
    private NoteType noteType;
    private String topicId;
    private Bounds bounds;

    // Constructors
    public Note() {
    }

    public Note(Content content, NoteType noteType, String topicId, Bounds bounds) {
        this.content = content;
        this.noteType = noteType;
        this.topicId = topicId;
        this.bounds = bounds;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Content getContent() {
        return content;
    }

    public void setContent(Content newContent) {
        this.content = newContent;
    }

    public NoteType getNoteType() {
        return noteType;
    }

    public void setNoteType(NoteType noteType) {
        this.noteType = noteType;
    }

    public String getTopicId() {
        return topicId;
    }

    public void setTopicId(String topicId) {
        this.topicId = topicId;
    }

    public Bounds getBounds() {
        return bounds;
    }

    public void setBounds(double x, double y, double width, double height) {
        this.bounds = new Bounds(x, y, width, height);
    }

    // --- MÉTODOS DE DELEGACIÓN (ATAJOS) ---

    // 1. Obtener la lista de adjuntos de forma segura
    public List<Attachment> getAttachments() {
        if (this.content == null) {
            return new ArrayList<>(); // Evita NullPointerException si el content no ha sido creado
        }
        return this.content.getAttachments();
    }

    // 2. Agregar un adjunto directamente desde la nota
    public void addAttachment(Attachment attachment) {
        if (this.content == null) {
            this.content = new Content(); // Inicializa el content si no existe
        }
        this.content.getAttachments().add(attachment);
    }

    // 3. Modificar el body de forma directa
    public String getBody() {
        return this.content != null ? this.content.getBody() : null;
    }

    public void setBody(String body) {
        if (this.content == null) {
            this.content = new Content();
        }
        this.content.setBody(body);
    }

}
