package com.examens.backend.repository;

import com.examens.backend.entity.QCMQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QCMQuestionRepository extends JpaRepository<QCMQuestion, Long> {
    
    // Find all QCM questions for a specific chapter
    List<QCMQuestion> findByChapterId(Long chapterId);
    
    // Count questions for a chapter
    Long countByChapterId(Long chapterId);
    
    // Delete all questions for a chapter
    void deleteByChapterId(Long chapterId);
    
    // Find all QCM questions for a book (through chapter)
    @Query("SELECT q FROM QCMQuestion q JOIN q.chapter c WHERE c.bookId = :bookId")
    List<QCMQuestion> findByBookId(String bookId);
}