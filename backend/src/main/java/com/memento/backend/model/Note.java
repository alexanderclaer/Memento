package com.memento.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.memento.backend.model.enums.NoteType;

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

    public Note(String id, Content content, NoteType noteType, String topicId, Bounds bounds) {
        this.id = id;
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

    public void setContent(Content content) {
        this.content = content;
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
}
