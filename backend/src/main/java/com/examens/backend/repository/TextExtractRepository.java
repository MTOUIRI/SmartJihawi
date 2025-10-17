package com.examens.backend.repository;

import com.examens.backend.entity.TextExtract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TextExtractRepository extends JpaRepository<TextExtract, Long> {
    TextExtract findByExamId(Long examId);
}