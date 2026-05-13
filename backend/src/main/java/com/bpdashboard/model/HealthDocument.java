package com.bpdashboard.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_documents")
public class HealthDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private DocumentCategory category;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "document_date")
    private LocalDate documentDate;

    @Column(length = 1000)
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum DocumentCategory {
        APPOINTMENT, PRESCRIPTION, BILL, LAB_REPORT, SCAN, INSURANCE, OTHER
    }

    public HealthDocument() {
    }

    public HealthDocument(Long id, String title, DocumentCategory category, String fileName, String mimeType,
            String content, LocalDate documentDate, String notes, LocalDateTime createdAt, User user) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.content = content;
        this.documentDate = documentDate;
        this.notes = notes;
        this.createdAt = createdAt;
        this.user = user;
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

    public DocumentCategory getCategory() {
        return category;
    }

    public void setCategory(DocumentCategory category) {
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

    public LocalDate getDocumentDate() {
        return documentDate;
    }

    public void setDocumentDate(LocalDate documentDate) {
        this.documentDate = documentDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public static HealthDocumentBuilder builder() {
        return new HealthDocumentBuilder();
    }

    public static class HealthDocumentBuilder {
        private Long id;
        private String title;
        private DocumentCategory category;
        private String fileName;
        private String mimeType;
        private String content;
        private LocalDate documentDate;
        private String notes;
        private LocalDateTime createdAt;
        private User user;

        public HealthDocumentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public HealthDocumentBuilder title(String title) {
            this.title = title;
            return this;
        }

        public HealthDocumentBuilder category(DocumentCategory category) {
            this.category = category;
            return this;
        }

        public HealthDocumentBuilder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public HealthDocumentBuilder mimeType(String mimeType) {
            this.mimeType = mimeType;
            return this;
        }

        public HealthDocumentBuilder content(String content) {
            this.content = content;
            return this;
        }

        public HealthDocumentBuilder documentDate(LocalDate documentDate) {
            this.documentDate = documentDate;
            return this;
        }

        public HealthDocumentBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public HealthDocumentBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public HealthDocumentBuilder user(User user) {
            this.user = user;
            return this;
        }

        public HealthDocument build() {
            return new HealthDocument(id, title, category, fileName, mimeType, content, documentDate, notes,
                    createdAt, user);
        }
    }
}
