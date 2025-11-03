package com.examens.backend.repository;

import com.examens.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    // OPTIMIZED: Use @EntityGraph instead of JOIN FETCH
    @EntityGraph(attributePaths = {"exam"})
    @Query("SELECT q FROM Question q WHERE q.exam.id = :examId ORDER BY q.order")
    List<Question> findByExamIdOrderByOrder(@Param("examId") Long examId);
    
    @EntityGraph(attributePaths = {"exam"})
    @Query("SELECT q FROM Question q WHERE q.id = :id")
    Optional<Question> findByIdWithExam(@Param("id") Long id);
    
    @EntityGraph(attributePaths = {"exam"})
    @Query("SELECT q FROM Question q WHERE q.exam.bookId = :bookId")
    List<Question> findByExamBookId(@Param("bookId") String bookId);
    
    @Query("SELECT q FROM Question q WHERE q.exam.id = :examId AND q.order > :order ORDER BY q.order")
    List<Question> findQuestionsAfterOrder(@Param("examId") Long examId, @Param("order") Integer order);
    
    @Query("SELECT COALESCE(SUM(q.points), 0) FROM Question q WHERE q.exam.id = :examId")
    Integer sumPointsByExamId(@Param("examId") Long examId);
    
    @Query("SELECT COALESCE(MAX(q.order), 0) FROM Question q WHERE q.exam.id = :examId")
    Integer getMaxOrderByExamId(@Param("examId") Long examId);
    
    long countByExamId(Long examId);
    
    @Modifying
    @Query("DELETE FROM Question q WHERE q.exam.id = :examId")
    void deleteByExamId(Long examId);
}