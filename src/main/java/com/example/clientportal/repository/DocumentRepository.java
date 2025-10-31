package com.example.clientportal.repository;

import com.example.clientportal.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByFilingId(Long filingId);
}
