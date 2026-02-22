package com.bpdashboard.service;

import com.bpdashboard.dto.AdminStatsResponse;
import com.bpdashboard.dto.BpReadingResponse;
import com.bpdashboard.dto.UserDetailResponse;
import com.bpdashboard.model.BpReading;
import com.bpdashboard.model.User;
import com.bpdashboard.repository.BpReadingRepository;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final BpReadingRepository bpReadingRepository;

    @Autowired
    public AdminService(UserRepository userRepository, BpReadingRepository bpReadingRepository) {
        this.userRepository = userRepository;
        this.bpReadingRepository = bpReadingRepository;
    }

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        List<BpReading> allReadings = bpReadingRepository.findAll();
        long totalReadings = allReadings.size();

        double avgSystolic = allReadings.stream()
                .mapToInt(BpReading::getSystolic)
                .average()
                .orElse(0);

        double avgDiastolic = allReadings.stream()
                .mapToInt(BpReading::getDiastolic)
                .average()
                .orElse(0);

        // Users with at least one high BP reading (systolic >= 140 or diastolic >= 90)
        long usersWithHighBp = allReadings.stream()
                .filter(r -> r.getSystolic() >= 140 || r.getDiastolic() >= 90)
                .map(r -> r.getUser().getId())
                .distinct()
                .count();

        long readingsToday = bpReadingRepository.countByReadingDate(LocalDate.now());

        long newUsersThisWeek = userRepository.countByCreatedAtAfter(
                LocalDateTime.now().minusDays(7));

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalReadings(totalReadings)
                .avgSystolic(Math.round(avgSystolic * 10.0) / 10.0)
                .avgDiastolic(Math.round(avgDiastolic * 10.0) / 10.0)
                .usersWithHighBp(usersWithHighBp)
                .readingsToday(readingsToday)
                .newUsersThisWeek(newUsersThisWeek)
                .build();
    }

    public List<UserDetailResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::toUserDetail)
                .collect(Collectors.toList());
    }

    public UserDetailResponse getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<BpReading> readings = bpReadingRepository
                .findByUserIdOrderByReadingDateDescTimeOfDayDesc(user.getId());

        UserDetailResponse detail = toUserDetail(user);
        detail.setReadings(readings.stream()
                .map(this::toReadingResponse)
                .collect(Collectors.toList()));

        return detail;
    }

    private UserDetailResponse toUserDetail(User user) {
        List<BpReading> readings = bpReadingRepository
                .findByUserIdOrderByReadingDateDescTimeOfDayDesc(user.getId());

        BpReading latest = readings.isEmpty() ? null : readings.get(0);

        String bpStatus = "--";
        if (latest != null) {
            int sys = latest.getSystolic();
            int dia = latest.getDiastolic();
            if (sys < 120 && dia < 80)
                bpStatus = "Normal";
            else if (sys < 130 && dia < 80)
                bpStatus = "Elevated";
            else if (sys < 140 || dia < 90)
                bpStatus = "High (Stage 1)";
            else
                bpStatus = "High (Stage 2)";
        }

        return UserDetailResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : "N/A")
                .readingCount(readings.size())
                .lastReadingDate(latest != null ? latest.getReadingDate().toString() : null)
                .lastSystolic(latest != null ? latest.getSystolic() : null)
                .lastDiastolic(latest != null ? latest.getDiastolic() : null)
                .bpStatus(bpStatus)
                .build();
    }

    private BpReadingResponse toReadingResponse(BpReading reading) {
        return BpReadingResponse.builder()
                .id(reading.getId())
                .systolic(reading.getSystolic())
                .diastolic(reading.getDiastolic())
                .timeOfDay(reading.getTimeOfDay().name())
                .readingDate(reading.getReadingDate().toString())
                .build();
    }
}
