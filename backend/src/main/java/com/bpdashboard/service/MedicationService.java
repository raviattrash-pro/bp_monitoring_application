package com.bpdashboard.service;

import com.bpdashboard.dto.MedicationRequest;
import com.bpdashboard.dto.MedicationResponse;
import com.bpdashboard.model.Medication;
import com.bpdashboard.model.User;
import com.bpdashboard.repository.MedicationRepository;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicationService {
    private final MedicationRepository medicationRepository;
    private final UserRepository userRepository;

    @Autowired
    public MedicationService(MedicationRepository medicationRepository, UserRepository userRepository) {
        this.medicationRepository = medicationRepository;
        this.userRepository = userRepository;
    }

    public List<MedicationResponse> getAll(String email) {
        User user = getUser(email);
        return medicationRepository.findByUserIdOrderByActiveDescNameAsc(user.getId()).stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MedicationResponse add(String email, MedicationRequest request) {
        User user = getUser(email);
        Medication medication = Medication.builder()
                .name(request.getName().trim())
                .dosage(normalize(request.getDosage()))
                .frequency(normalize(request.getFrequency()))
                .timeSchedule(normalize(request.getTimeSchedule()))
                .instructions(normalize(request.getInstructions()))
                .remainingCount(request.getRemainingCount())
                .refillThreshold(request.getRefillThreshold())
                .startDate(parseDate(request.getStartDate()))
                .endDate(parseDate(request.getEndDate()))
                .active(request.getActive() == null ? true : request.getActive())
                .user(user)
                .build();
        return toResponse(medicationRepository.save(medication));
    }

    public void delete(String email, Long id) {
        User user = getUser(email);
        Medication medication = medicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Medication not found"));
        authorize(user, medication.getUser().getId());
        medicationRepository.delete(medication);
    }

    private MedicationResponse toResponse(Medication medication) {
        MedicationResponse response = new MedicationResponse();
        response.setId(medication.getId());
        response.setName(medication.getName());
        response.setDosage(medication.getDosage());
        response.setFrequency(medication.getFrequency());
        response.setTimeSchedule(medication.getTimeSchedule());
        response.setInstructions(medication.getInstructions());
        response.setRemainingCount(medication.getRemainingCount());
        response.setRefillThreshold(medication.getRefillThreshold());
        response.setStartDate(medication.getStartDate() != null ? medication.getStartDate().toString() : null);
        response.setEndDate(medication.getEndDate() != null ? medication.getEndDate().toString() : null);
        response.setActive(medication.getActive());
        response.setRefillSoon(medication.getRemainingCount() != null && medication.getRefillThreshold() != null
                && medication.getRemainingCount() <= medication.getRefillThreshold());
        return response;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private void authorize(User user, Long ownerId) {
        if (!ownerId.equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
    }

    private LocalDate parseDate(String value) {
        return value == null || value.isBlank() ? null : LocalDate.parse(value);
    }

    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
