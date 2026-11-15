package com.memento.backend.model.valueObjects;

import org.springframework.data.annotation.Id;

// Clase auxiliar para los archivos adjuntos al contenido de las notas
public class Attachment {
    @Id 
    private String id;          // UUID único del archivo
    private String fileName;    // Ej: "diagrama.png"
    private String fileUrl;     // Ruta en la nube o servidor
    private String fileType;    // Ej: "image/png", "application/pdf"
    private long fileSize;      // Tamaño en bytes

    // Constructor, getters y setters...
    public Attachment() {
    }

    public Attachment(String fileName, String fileUrl, String fileType, long fileSize) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.fileSize = fileSize;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }
}
