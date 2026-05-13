package com.bpdashboard.service;

import com.bpdashboard.dto.EmergencyProfileRequest;
import com.bpdashboard.dto.EmergencyProfileResponse;
import com.bpdashboard.model.EmergencyProfile;
import com.bpdashboard.model.User;
import com.bpdashboard.repository.EmergencyProfileRepository;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class EmergencyProfileService {
    private final EmergencyProfileRepository emergencyProfileRepository;
    private final UserRepository userRepository;

    @Autowired
    public EmergencyProfileService(EmergencyProfileRepository emergencyProfileRepository, UserRepository userRepository) {
        this.emergencyProfileRepository = emergencyProfileRepository;
        this.userRepository = userRepository;
    }

    public EmergencyProfileResponse get(String email) {
        User user = getUser(email);
        EmergencyProfile profile = emergencyProfileRepository.findByUserId(user.getId())
                .orElse(EmergencyProfile.builder().user(user).build());
        return toResponse(profile);
    }

    public EmergencyProfileResponse save(String email, EmergencyProfileRequest request) {
        User user = getUser(email);
        EmergencyProfile profile = emergencyProfileRepository.findByUserId(user.getId())
                .orElse(EmergencyProfile.builder().user(user).build());

        profile.setBloodGroup(normalize(request.getBloodGroup()));
        profile.setAllergies(normalize(request.getAllergies()));
        profile.setChronicConditions(normalize(request.getChronicConditions()));
        profile.setContactName(normalize(request.getContactName()));
        profile.setContactPhone(normalize(request.getContactPhone()));
        profile.setContactRelation(normalize(request.getContactRelation()));
        profile.setInsuranceProvider(normalize(request.getInsuranceProvider()));
        profile.setInsurancePolicyNumber(normalize(request.getInsurancePolicyNumber()));
        profile.setDoctorName(normalize(request.getDoctorName()));
        profile.setDoctorPhone(normalize(request.getDoctorPhone()));
        profile.setNotes(normalize(request.getNotes()));
        profile.setUser(user);

        return toResponse(emergencyProfileRepository.save(profile));
    }

    private EmergencyProfileResponse toResponse(EmergencyProfile profile) {
        EmergencyProfileResponse response = new EmergencyProfileResponse();
        response.setId(profile.getId());
        response.setBloodGroup(profile.getBloodGroup());
        response.setAllergies(profile.getAllergies());
        response.setChronicConditions(profile.getChronicConditions());
        response.setContactName(profile.getContactName());
        response.setContactPhone(profile.getContactPhone());
        response.setContactRelation(profile.getContactRelation());
        response.setInsuranceProvider(profile.getInsuranceProvider());
        response.setInsurancePolicyNumber(profile.getInsurancePolicyNumber());
        response.setDoctorName(profile.getDoctorName());
        response.setDoctorPhone(profile.getDoctorPhone());
        response.setNotes(profile.getNotes());
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
}
