package com.bpdashboard.controller;

import com.bpdashboard.dto.ReminderRequest;
import com.bpdashboard.model.ReminderSettings;
import com.bpdashboard.model.User;
import com.bpdashboard.repository.ReminderRepository;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reminder")
public class ReminderController {

        private final ReminderRepository reminderRepository;
        private final UserRepository userRepository;

        @Autowired
        public ReminderController(ReminderRepository reminderRepository, UserRepository userRepository) {
                this.reminderRepository = reminderRepository;
                this.userRepository = userRepository;
        }

        @GetMapping
        public ResponseEntity<?> getSettings(Authentication authentication) {
                User user = getUser(authentication);
                ReminderSettings settings = reminderRepository.findByUserId(user.getId())
                                .orElse(ReminderSettings.builder()
                                                .phoneNumber("")
                                                .morningTime("09:00")
                                                .nightTime("20:00")
                                                .enabled(false)
                                                .user(user)
                                                .build());

                return ResponseEntity.ok(Map.of(
                                "phoneNumber", settings.getPhoneNumber() != null ? settings.getPhoneNumber() : "",
                                "morningTime", settings.getMorningTime() != null ? settings.getMorningTime() : "09:00",
                                "nightTime", settings.getNightTime() != null ? settings.getNightTime() : "20:00",
                                "enabled", settings.getEnabled() != null ? settings.getEnabled() : false));
        }

        @PutMapping
        public ResponseEntity<?> updateSettings(Authentication authentication,
                        @RequestBody ReminderRequest request) {
                User user = getUser(authentication);
                ReminderSettings settings = reminderRepository.findByUserId(user.getId())
                                .orElse(ReminderSettings.builder().user(user).build());

                settings.setPhoneNumber(request.getPhoneNumber());
                settings.setMorningTime(request.getMorningTime());
                settings.setNightTime(request.getNightTime());
                settings.setEnabled(request.getEnabled());

                reminderRepository.save(settings);

                return ResponseEntity.ok(Map.of(
                                "phoneNumber", settings.getPhoneNumber(),
                                "morningTime", settings.getMorningTime(),
                                "nightTime", settings.getNightTime(),
                                "enabled", settings.getEnabled()));
        }

        @DeleteMapping
        public ResponseEntity<?> deleteSettings(Authentication authentication) {
                User user = getUser(authentication);
                ReminderSettings settings = reminderRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Reminder settings not found"));

                settings.setEnabled(false);
                settings.setPhoneNumber("");
                settings.setMorningTime("09:00");
                settings.setNightTime("20:00");

                reminderRepository.save(settings);

                return ResponseEntity.ok(Map.of("message", "Reminder settings deleted successfully"));
        }

        private User getUser(Authentication authentication) {
                return userRepository.findByEmail(authentication.getName())
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        }
}
