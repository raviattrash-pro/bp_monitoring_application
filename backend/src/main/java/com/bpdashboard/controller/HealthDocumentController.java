package com.bpdashboard.controller;

import com.bpdashboard.dto.HealthDocumentRequest;
import com.bpdashboard.dto.HealthDocumentResponse;
import com.bpdashboard.service.HealthDocumentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class HealthDocumentController {
    private final HealthDocumentService healthDocumentService;

    @Autowired
    public HealthDocumentController(HealthDocumentService healthDocumentService) {
        this.healthDocumentService = healthDocumentService;
    }

    @PostMapping
    public ResponseEntity<HealthDocumentResponse> addDocument(Authentication authentication,
            @Valid @RequestBody HealthDocumentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(healthDocumentService.addDocument(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<HealthDocumentResponse>> getDocuments(Authentication authentication) {
        return ResponseEntity.ok(healthDocumentService.getDocuments(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(Authentication authentication, @PathVariable Long id) {
        healthDocumentService.deleteDocument(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
