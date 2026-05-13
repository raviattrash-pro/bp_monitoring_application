package com.bpdashboard.repository;

import com.bpdashboard.model.LabReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabReportRepository extends JpaRepository<LabReport, Long> {
    List<LabReport> findByUserIdOrderByReportDateDescTestNameAsc(Long userId);
}
