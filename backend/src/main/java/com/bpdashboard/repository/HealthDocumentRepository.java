package com.bpdashboard.repository;

import com.bpdashboard.model.HealthDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthDocumentRepository extends JpaRepository<HealthDocument, Long> {
    List<HealthDocument> findByUserIdOrderByDocumentDateDescCreatedAtDesc(Long userId);
}
