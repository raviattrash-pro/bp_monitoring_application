package com.bpdashboard.dto;

public class HealthDocumentResponse {
    private Long id;
    private String title;
    private String category;
    private String fileName;
    private String mimeType;
    private String content;
    private String documentDate;
    private String notes;
    private String createdAt;

    public HealthDocumentResponse() {
    }

    public HealthDocumentResponse(Long id, String title, String category, String fileName, String mimeType,
            String content, String documentDate, String notes, String createdAt) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.content = content;
        this.documentDate = documentDate;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public static HealthDocumentResponseBuilder builder() {
        return new HealthDocumentResponseBuilder();
    }

    public static class HealthDocumentResponseBuilder {
        private Long id;
        private String title;
        private String category;
        private String fileName;
        private String mimeType;
        private String content;
        private String documentDate;
        private String notes;
        private String createdAt;

        public HealthDocumentResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public HealthDocumentResponseBuilder title(String title) {
            this.title = title;
            return this;
        }

        public HealthDocumentResponseBuilder category(String category) {
            this.category = category;
            return this;
        }

        public HealthDocumentResponseBuilder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public HealthDocumentResponseBuilder mimeType(String mimeType) {
            this.mimeType = mimeType;
            return this;
        }

        public HealthDocumentResponseBuilder content(String content) {
            this.content = content;
            return this;
        }

        public HealthDocumentResponseBuilder documentDate(String documentDate) {
            this.documentDate = documentDate;
            return this;
        }

        public HealthDocumentResponseBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public HealthDocumentResponseBuilder createdAt(String createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public HealthDocumentResponse build() {
            return new HealthDocumentResponse(id, title, category, fileName, mimeType, content, documentDate, notes,
                    createdAt);
        }
    }
}
