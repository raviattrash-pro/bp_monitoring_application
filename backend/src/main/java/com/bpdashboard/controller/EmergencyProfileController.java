package com.bpdashboard.controller;

import com.bpdashboard.dto.EmergencyProfileRequest;
import com.bpdashboard.dto.EmergencyProfileResponse;
import com.bpdashboard.service.EmergencyProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency-profile")
public class EmergencyProfileController {
    private final EmergencyProfileService emergencyProfileService;

    @Autowired
    public EmergencyProfileController(EmergencyProfileService emergencyProfileService) {
        this.emergencyProfileService = emergencyProfileService;
    }

    @GetMapping
    public ResponseEntity<EmergencyProfileResponse> get(Authentication authentication) {
        return ResponseEntity.ok(emergencyProfileService.get(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<EmergencyProfileResponse> save(Authentication authentication,
            @Valid @RequestBody EmergencyProfileRequest request) {
        return ResponseEntity.ok(emergencyProfileService.save(authentication.getName(), request));
    }
}
