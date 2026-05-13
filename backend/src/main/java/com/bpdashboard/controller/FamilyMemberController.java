package com.bpdashboard.controller;

import com.bpdashboard.dto.FamilyMemberRequest;
import com.bpdashboard.dto.FamilyMemberResponse;
import com.bpdashboard.service.FamilyMemberService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/family-members")
public class FamilyMemberController {
    private final FamilyMemberService familyMemberService;

    @Autowired
    public FamilyMemberController(FamilyMemberService familyMemberService) {
        this.familyMemberService = familyMemberService;
    }

    @GetMapping
    public ResponseEntity<List<FamilyMemberResponse>> getAll(Authentication authentication) {
        return ResponseEntity.ok(familyMemberService.getAll(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<FamilyMemberResponse> add(Authentication authentication, @Valid @RequestBody FamilyMemberRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(familyMemberService.add(authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        familyMemberService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
