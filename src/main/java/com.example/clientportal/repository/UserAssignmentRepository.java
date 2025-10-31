package com.example.clientportal.repository;

import com.example.clientportal.model.UserAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserAssignmentRepository extends JpaRepository<UserAssignment, Long> {
    List<UserAssignment> findByUserId(Long userId);
}
