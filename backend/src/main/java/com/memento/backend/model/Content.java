package com.memento.backend.model;

public class Content {
    private String title;
    private String text;
    private String format;
    private String imageUrl;


    // Constructors
    public Content() {
    }

    public Content(String title, String text, String format, String imageUrl) {
        this.text = text;
        this.imageUrl = imageUrl;
        this.title = title;
        this.format = format;   
    }

    // Getters and Setters
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}