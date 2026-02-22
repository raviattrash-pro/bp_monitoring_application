package com.bpdashboard.repository;

import com.bpdashboard.model.BpReading;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDate;

public interface BpReadingRepository extends JpaRepository<BpReading, Long> {
    List<BpReading> findByUserIdOrderByReadingDateAscTimeOfDayAsc(Long userId);

    List<BpReading> findByUserIdOrderByReadingDateDescTimeOfDayDesc(Long userId);

    long countByUserId(Long userId);

    long countByReadingDate(LocalDate date);
}
