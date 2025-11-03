package com.examens.backend.repository;

import com.examens.backend.entity.EssayQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EssayQuestionRepository extends JpaRepository<EssayQuestion, Long> {
    
    // OPTIMIZED: Use @EntityGraph
    @EntityGraph(attributePaths = {"exam"})
    @Query("SELECT eq FROM EssayQuestion eq WHERE eq.exam.id = :examId ORDER BY eq.order")
    List<EssayQuestion> findByExamIdOrderByOrder(@Param("examId") Long examId);
    
    @EntityGraph(attributePaths = {"exam"})
    @Query("SELECT eq FROM EssayQuestion eq WHERE eq.id = :id")
    Optional<EssayQuestion> findByIdWithExam(@Param("id") Long id);
    
    @EntityGraph(attributePaths = {"exam"})
    @Query("SELECT eq FROM EssayQuestion eq WHERE eq.exam.bookId = :bookId")
    List<EssayQuestion> findByExamBookId(@Param("bookId") String bookId);
    
    @Query("SELECT eq FROM EssayQuestion eq WHERE eq.exam.id = :examId AND eq.order > :order ORDER BY eq.order")
    List<EssayQuestion> findQuestionsAfterOrder(@Param("examId") Long examId, @Param("order") Integer order);
    
    @Query("SELECT COALESCE(SUM(eq.points), 0) FROM EssayQuestion eq WHERE eq.exam.id = :examId")
    Integer sumPointsByExamId(@Param("examId") Long examId);
    
    @Query("SELECT COALESCE(MAX(eq.order), 0) FROM EssayQuestion eq WHERE eq.exam.id = :examId")
    Integer getMaxOrderByExamId(@Param("examId") Long examId);
    
    long countByExamId(Long examId);
    
    @Modifying
    @Query("DELETE FROM EssayQuestion eq WHERE eq.exam.id = :examId")
    void deleteByExamId(Long examId);
}