package com.bpdashboard.service;

import com.bpdashboard.dto.HealthDocumentRequest;
import com.bpdashboard.dto.HealthDocumentResponse;
import com.bpdashboard.model.HealthDocument;
import com.bpdashboard.model.User;
import com.bpdashboard.repository.HealthDocumentRepository;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthDocumentService {
    private static final int MAX_BASE64_LENGTH = 7_000_000;

    private final HealthDocumentRepository healthDocumentRepository;
    private final UserRepository userRepository;

    @Autowired
    public HealthDocumentService(HealthDocumentRepository healthDocumentRepository, UserRepository userRepository) {
        this.healthDocumentRepository = healthDocumentRepository;
        this.userRepository = userRepository;
    }

    public HealthDocumentResponse addDocument(String email, HealthDocumentRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        validateContentSize(request.getContent());

        HealthDocument document = HealthDocument.builder()
                .title(request.getTitle().trim())
                .category(HealthDocument.DocumentCategory.valueOf(request.getCategory().toUpperCase()))
                .fileName(request.getFileName().trim())
                .mimeType(request.getMimeType().trim())
                .content(request.getContent().trim())
                .documentDate(parseDate(request.getDocumentDate()))
                .notes(normalizeText(request.getNotes()))
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return toResponse(healthDocumentRepository.save(document));
    }

    public List<HealthDocumentResponse> getDocuments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return healthDocumentRepository.findByUserIdOrderByDocumentDateDescCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteDocument(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        HealthDocument document = healthDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!document.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this document");
        }

        healthDocumentRepository.delete(document);
    }

    private void validateContentSize(String content) {
        if (content != null && content.length() > MAX_BASE64_LENGTH) {
            throw new RuntimeException("Document is too large. Please upload a file smaller than 5 MB.");
        }
    }

    private LocalDate parseDate(String date) {
        if (date == null || date.isBlank()) {
            return null;
        }
        return LocalDate.parse(date);
    }

    private String normalizeText(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private HealthDocumentResponse toResponse(HealthDocument document) {
        return HealthDocumentResponse.builder()
                .id(document.getId())
                .title(document.getTitle())
                .category(document.getCategory().name())
                .fileName(document.getFileName())
                .mimeType(document.getMimeType())
                .content(document.getContent())
                .documentDate(document.getDocumentDate() != null ? document.getDocumentDate().toString() : null)
                .notes(document.getNotes())
                .createdAt(document.getCreatedAt() != null ? document.getCreatedAt().toString() : null)
                .build();
    }
}
