package com.examens.backend.repository;

import com.examens.backend.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    
    // OPTIMIZED: Fetch exams with textExtract AND chapterRef in ONE query
    @EntityGraph(attributePaths = {"textExtract", "textExtract.chapterRef"})
    @Query("SELECT e FROM Exam e WHERE e.bookId = :bookId ORDER BY e.year DESC, e.createdAt DESC")
    List<Exam> findByBookIdWithTextExtract(@Param("bookId") String bookId);
    
    @EntityGraph(attributePaths = {"textExtract", "textExtract.chapterRef"})
    @Query("SELECT e FROM Exam e WHERE e.id = :id")
    Optional<Exam> findByIdWithTextExtract(@Param("id") Long id);
    
    // NEW: Lightweight query for list views (no relationships)
    @Query("SELECT e FROM Exam e ORDER BY e.year DESC, e.createdAt DESC")
    List<Exam> findAllSummary();
    
    boolean existsByBookIdAndTitleAndYear(String bookId, String title, String year);
}