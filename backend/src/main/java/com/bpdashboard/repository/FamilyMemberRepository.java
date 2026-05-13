package com.bpdashboard.repository;

import com.bpdashboard.model.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
    List<FamilyMember> findByUserIdOrderByNameAsc(Long userId);
}
