package com.bpdashboard.repository;

import com.bpdashboard.model.EmergencyProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmergencyProfileRepository extends JpaRepository<EmergencyProfile, Long> {
    Optional<EmergencyProfile> findByUserId(Long userId);
}
