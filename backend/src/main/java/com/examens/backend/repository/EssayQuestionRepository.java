package com.examens.backend.repository;

import com.examens.backend.entity.EssayQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EssayQuestionRepository extends JpaRepository<EssayQuestion, Long> {
    
    List<EssayQuestion> findByExamIdOrderByOrder(Long examId);
    
    @Query("SELECT eq FROM EssayQuestion eq JOIN FETCH eq.exam WHERE eq.id = :id")
    Optional<EssayQuestion> findByIdWithExam(@Param("id") Long id);
    
    @Query("SELECT COALESCE(SUM(eq.points), 0) FROM EssayQuestion eq WHERE eq.exam.id = :examId")
    Integer sumPointsByExamId(@Param("examId") Long examId);
    
    @Query("SELECT COALESCE(MAX(eq.order), 0) FROM EssayQuestion eq WHERE eq.exam.id = :examId")
    Integer getMaxOrderByExamId(@Param("examId") Long examId);
    
    @Query("SELECT eq FROM EssayQuestion eq WHERE eq.exam.id = :examId AND eq.order > :order ORDER BY eq.order")
    List<EssayQuestion> findQuestionsAfterOrder(@Param("examId") Long examId, @Param("order") Integer order);
    
    void deleteByExamId(Long examId);
    
    @Query("SELECT eq FROM EssayQuestion eq WHERE eq.exam.bookId = :bookId")
    List<EssayQuestion> findByExamBookId(@Param("bookId") String bookId);
    
    long countByExamId(Long examId);
}