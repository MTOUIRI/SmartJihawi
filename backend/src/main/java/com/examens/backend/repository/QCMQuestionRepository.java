package com.examens.backend.repository;

import com.examens.backend.entity.QCMQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QCMQuestionRepository extends JpaRepository<QCMQuestion, Long> {
    
    // OPTIMIZED: Fetch chapter in same query
    @EntityGraph(attributePaths = {"chapter"})
    @Query("SELECT q FROM QCMQuestion q WHERE q.chapter.id = :chapterId")
    List<QCMQuestion> findByChapterId(@Param("chapterId") Long chapterId);
    
    Long countByChapterId(Long chapterId);
    
    @Modifying
    @Query("DELETE FROM QCMQuestion q WHERE q.chapter.id = :chapterId")
    void deleteByChapterId(Long chapterId);
    
    @EntityGraph(attributePaths = {"chapter"})
    @Query("SELECT q FROM QCMQuestion q JOIN q.chapter c WHERE c.bookId = :bookId")
    List<QCMQuestion> findByBookId(@Param("bookId") String bookId);
}