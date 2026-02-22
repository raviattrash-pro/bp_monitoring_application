package com.bpdashboard.repository;

import com.bpdashboard.model.ReminderSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReminderRepository extends JpaRepository<ReminderSettings, Long> {
    Optional<ReminderSettings> findByUserId(Long userId);
}
