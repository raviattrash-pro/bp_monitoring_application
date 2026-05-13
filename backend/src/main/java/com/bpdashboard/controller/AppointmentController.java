package com.bpdashboard.controller;

import com.bpdashboard.dto.AppointmentRequest;
import com.bpdashboard.dto.AppointmentResponse;
import com.bpdashboard.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAll(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAll(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> add(Authentication authentication, @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.add(authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        appointmentService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
