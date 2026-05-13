package com.bpdashboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class HealthDocumentRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "File name is required")
    @Size(max = 255, message = "File name must be at most 255 characters")
    private String fileName;

    @NotBlank(message = "MIME type is required")
    @Size(max = 100, message = "MIME type must be at most 100 characters")
    private String mimeType;

    @NotBlank(message = "Document content is required")
    private String content;

    @Pattern(regexp = "^$|\\d{4}-\\d{2}-\\d{2}$", message = "Document date must be in yyyy-MM-dd format")
    private String documentDate;

    @Size(max = 1000, message = "Notes must be at most 1000 characters")
    private String notes;

    public HealthDocumentRequest() {
    }

    public HealthDocumentRequest(String title, String category, String fileName, String mimeType, String content,
            String documentDate, String notes) {
        this.title = title;
        this.category = category;
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.content = content;
        this.documentDate = documentDate;
        this.notes = notes;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getDocumentDate() {
        return documentDate;
    }

    public void setDocumentDate(String documentDate) {
        this.documentDate = documentDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
