package com.memento.backend.model;

import java.time.Instant;

public class Topic {
    private String id;
    private String title;
    private String bookId;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant topicDate;

    // Constructors
    public Topic() {
    }

    public Topic(String id, String title, String bookId, Instant topicDate) {
        this.id = id;
        this.title = title;
        this.bookId = bookId;
        this.topicDate = topicDate;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getTopicDate() {
        return topicDate;
    }

    public void setTopicDate(Instant topicDate) {
        this.topicDate = topicDate;
    }
    

}   
