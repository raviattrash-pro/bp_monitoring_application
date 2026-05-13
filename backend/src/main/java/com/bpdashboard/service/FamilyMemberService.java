package com.bpdashboard.service;

import com.bpdashboard.dto.FamilyMemberRequest;
import com.bpdashboard.dto.FamilyMemberResponse;
import com.bpdashboard.model.FamilyMember;
import com.bpdashboard.model.User;
import com.bpdashboard.repository.FamilyMemberRepository;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FamilyMemberService {
    private final FamilyMemberRepository familyMemberRepository;
    private final UserRepository userRepository;

    @Autowired
    public FamilyMemberService(FamilyMemberRepository familyMemberRepository, UserRepository userRepository) {
        this.familyMemberRepository = familyMemberRepository;
        this.userRepository = userRepository;
    }

    public List<FamilyMemberResponse> getAll(String email) {
        User user = getUser(email);
        return familyMemberRepository.findByUserIdOrderByNameAsc(user.getId()).stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    public FamilyMemberResponse add(String email, FamilyMemberRequest request) {
        User user = getUser(email);
        FamilyMember familyMember = FamilyMember.builder()
                .name(request.getName().trim())
                .relation(normalize(request.getRelation()))
                .age(request.getAge())
                .bloodGroup(normalize(request.getBloodGroup()))
                .conditions(normalize(request.getConditions()))
                .medications(normalize(request.getMedications()))
                .notes(normalize(request.getNotes()))
                .user(user)
                .build();
        return toResponse(familyMemberRepository.save(familyMember));
    }

    public void delete(String email, Long id) {
        User user = getUser(email);
        FamilyMember member = familyMemberRepository.findById(id).orElseThrow(() -> new RuntimeException("Family member not found"));
        authorize(user, member.getUser().getId());
        familyMemberRepository.delete(member);
    }

    private FamilyMemberResponse toResponse(FamilyMember member) {
        FamilyMemberResponse response = new FamilyMemberResponse();
        response.setId(member.getId());
        response.setName(member.getName());
        response.setRelation(member.getRelation());
        response.setAge(member.getAge());
        response.setBloodGroup(member.getBloodGroup());
        response.setConditions(member.getConditions());
        response.setMedications(member.getMedications());
        response.setNotes(member.getNotes());
        return response;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void authorize(User user, Long ownerId) {
        if (!ownerId.equals(user.getId())) throw new RuntimeException("Unauthorized");
    }
}
