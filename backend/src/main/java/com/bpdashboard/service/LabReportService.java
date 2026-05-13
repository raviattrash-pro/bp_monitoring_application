package com.bpdashboard.service;

import com.bpdashboard.dto.LabReportRequest;
import com.bpdashboard.dto.LabReportResponse;
import com.bpdashboard.model.LabReport;
import com.bpdashboard.model.User;
import com.bpdashboard.repository.LabReportRepository;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LabReportService {
    private final LabReportRepository labReportRepository;
    private final UserRepository userRepository;

    @Autowired
    public LabReportService(LabReportRepository labReportRepository, UserRepository userRepository) {
        this.labReportRepository = labReportRepository;
        this.userRepository = userRepository;
    }

    public List<LabReportResponse> getAll(String email) {
        User user = getUser(email);
        return labReportRepository.findByUserIdOrderByReportDateDescTestNameAsc(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public LabReportResponse add(String email, LabReportRequest request) {
        User user = getUser(email);
        LabReport labReport = LabReport.builder()
                .testName(request.getTestName().trim())
                .resultValue(normalize(request.getResultValue()))
                .unit(normalize(request.getUnit()))
                .normalRange(normalize(request.getNormalRange()))
                .reportDate(LocalDate.parse(request.getReportDate()))
                .labName(normalize(request.getLabName()))
                .category(normalize(request.getCategory()))
                .notes(normalize(request.getNotes()))
                .user(user)
                .build();
        return toResponse(labReportRepository.save(labReport));
    }

    public void delete(String email, Long id) {
        User user = getUser(email);
        LabReport labReport = labReportRepository.findById(id).orElseThrow(() -> new RuntimeException("Lab report not found"));
        authorize(user, labReport.getUser().getId());
        labReportRepository.delete(labReport);
    }

    private LabReportResponse toResponse(LabReport report) {
        LabReportResponse response = new LabReportResponse();
        response.setId(report.getId());
        response.setTestName(report.getTestName());
        response.setResultValue(report.getResultValue());
        response.setUnit(report.getUnit());
        response.setNormalRange(report.getNormalRange());
        response.setReportDate(report.getReportDate().toString());
        response.setLabName(report.getLabName());
        response.setCategory(report.getCategory());
        response.setNotes(report.getNotes());
        return response;
    }

    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private void authorize(User user, Long ownerId) {
        if (!ownerId.equals(user.getId())) throw new RuntimeException("Unauthorized");
    }
}
