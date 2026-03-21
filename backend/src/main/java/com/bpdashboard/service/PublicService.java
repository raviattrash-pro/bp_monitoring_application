package com.bpdashboard.service;

import com.bpdashboard.dto.PublicStatsResponse;
import com.bpdashboard.repository.BpReadingRepository;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PublicService {

    private final UserRepository userRepository;
    private final BpReadingRepository bpReadingRepository;

    @Autowired
    public PublicService(UserRepository userRepository, BpReadingRepository bpReadingRepository) {
        this.userRepository = userRepository;
        this.bpReadingRepository = bpReadingRepository;
    }

    public Map<String, String> getHealthStatus() {
        try {
            // Simple check to ensure DB is reachable
            userRepository.count();
            return Map.of("status", "UP", "database", "CONNECTED");
        } catch (Exception e) {
            return Map.of("status", "DOWN", "database", "DISCONNECTED", "error", e.getMessage());
        }
    }

    public PublicStatsResponse getPublicStats() {
        long totalUsers = userRepository.count();
        long totalReadings = bpReadingRepository.count();
        return PublicStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalReadings(totalReadings)
                .build();
    }
}
