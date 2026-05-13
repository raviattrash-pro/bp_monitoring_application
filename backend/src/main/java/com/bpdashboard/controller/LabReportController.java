package com.bpdashboard.controller;

import com.bpdashboard.dto.LabReportRequest;
import com.bpdashboard.dto.LabReportResponse;
import com.bpdashboard.service.LabReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-reports")
public class LabReportController {
    private final LabReportService labReportService;

    @Autowired
    public LabReportController(LabReportService labReportService) {
        this.labReportService = labReportService;
    }

    @GetMapping
    public ResponseEntity<List<LabReportResponse>> getAll(Authentication authentication) {
        return ResponseEntity.ok(labReportService.getAll(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<LabReportResponse> add(Authentication authentication, @Valid @RequestBody LabReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(labReportService.add(authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        labReportService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
