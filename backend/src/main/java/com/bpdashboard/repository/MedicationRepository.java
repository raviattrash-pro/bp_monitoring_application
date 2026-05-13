package com.bpdashboard.repository;

import com.bpdashboard.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByUserIdOrderByActiveDescNameAsc(Long userId);
}
