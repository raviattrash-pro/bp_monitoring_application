package com.bpdashboard.controller;

import com.bpdashboard.dto.BpReadingRequest;
import com.bpdashboard.dto.BpReadingResponse;
import com.bpdashboard.service.BpService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/bp")
public class BpController {

    private final BpService bpService;

    @Autowired
    public BpController(BpService bpService) {
        this.bpService = bpService;
    }

    @PostMapping
    public ResponseEntity<BpReadingResponse> addReading(
            Authentication authentication,
            @Valid @RequestBody BpReadingRequest request) {
        String email = authentication.getName();
        BpReadingResponse response = bpService.addReading(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<BpReadingResponse>> getReadings(Authentication authentication) {
        String email = authentication.getName();
        List<BpReadingResponse> readings = bpService.getReadings(email);
        return ResponseEntity.ok(readings);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReadings(Authentication authentication) {
        String email = authentication.getName();
        byte[] csvData = bpService.exportReadingsToCsv(email);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bp_readings.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @PostMapping("/import")
    public ResponseEntity<String> importReadings(Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        String email = authentication.getName();
        int count = bpService.importReadingsFromCsv(email, file);
        return ResponseEntity.ok("Successfully imported " + count + " readings.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<BpReadingResponse> updateReading(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody BpReadingRequest request) {
        String email = authentication.getName();
        BpReadingResponse response = bpService.updateReading(email, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReading(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        bpService.deleteReading(email, id);
        return ResponseEntity.noContent().build();
    }
}
