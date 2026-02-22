package com.bpdashboard.config;

import com.bpdashboard.model.User;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String adminEmail = "admin@bpdashboard.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .build();

            userRepository.save(admin);
            System.out.println("✅ Default admin user created: " + adminEmail + " / admin123");
        }

        // Ensure raviattrash2@gmail.com exists and is an Admin for testing
        userRepository.findByEmail("raviattrash2@gmail.com").ifPresentOrElse(user -> {
            user.setPassword(passwordEncoder.encode("admin123"));
            user.setRole("ROLE_ADMIN");
            userRepository.save(user);
            System.out.println("✅ Test Admin updated: raviattrash2@gmail.com / admin123");
        }, () -> {
            User testAdmin = User.builder()
                    .name("Ravi Test")
                    .email("raviattrash2@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(testAdmin);
            System.out.println("✅ Test Admin created: raviattrash2@gmail.com / admin123");
        });
    }
}
