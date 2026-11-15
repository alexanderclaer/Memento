package com.memento.backend.model.valueObjects;

import java.util.ArrayList;
import java.util.List;

// Clase auxiliar para representar el contenido de una nota, incluyendo texto, formato y archivos adjuntos
public class Content {
    private String body;
    private String format = "MARKDOWN"; // Formato por defecto
    private List<Attachment> attachments;


    // Constructors
    // 1. Constructor vacío (inicializa la lista para evitar nulos)
    public Content() {
        this.attachments = new ArrayList<>();
    }

    // 2. Constructor principal para notas rápidas (asume MARKDOWN por defecto)
    public Content(String body, List<Attachment> attachments) {
        this.body = body;
        this.attachments = attachments != null ? attachments : new ArrayList<>();
    }

    // 3. Constructor completo (por si necesitas forzar un formato distinto)
    public Content(String body, String format, List<Attachment> attachments) {
        this.body = body;
        this.format = format != null ? format : "MARKDOWN";
        this.attachments = attachments != null ? attachments : new ArrayList<>();
    }

    // Getters and Setters
    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public List<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}