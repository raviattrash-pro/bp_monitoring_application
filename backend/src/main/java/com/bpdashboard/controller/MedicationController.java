package com.bpdashboard.controller;

import com.bpdashboard.dto.MedicationRequest;
import com.bpdashboard.dto.MedicationResponse;
import com.bpdashboard.service.MedicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {
    private final MedicationService medicationService;

    @Autowired
    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping
    public ResponseEntity<List<MedicationResponse>> getAll(Authentication authentication) {
        return ResponseEntity.ok(medicationService.getAll(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<MedicationResponse> add(Authentication authentication, @Valid @RequestBody MedicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(medicationService.add(authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        medicationService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
