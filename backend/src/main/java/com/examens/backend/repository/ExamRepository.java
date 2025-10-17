package com.examens.backend.repository;

import com.examens.backend.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByBookIdOrderByYearDescCreatedAtDesc(String bookId);
    
    @Query("SELECT e FROM Exam e LEFT JOIN FETCH e.textExtract WHERE e.bookId = :bookId ORDER BY e.year DESC, e.createdAt DESC")
    List<Exam> findByBookIdWithTextExtract(@Param("bookId") String bookId);
    
    @Query("SELECT e FROM Exam e LEFT JOIN FETCH e.textExtract WHERE e.id = :id")
    Optional<Exam> findByIdWithTextExtract(@Param("id") Long id);
    
    boolean existsByBookIdAndTitleAndYear(String bookId, String title, String year);
}