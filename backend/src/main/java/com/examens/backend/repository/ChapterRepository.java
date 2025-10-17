package com.examens.backend.repository;

import com.examens.backend.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByBookIdOrderByChapterNumber(String bookId);
    Optional<Chapter> findByBookIdAndChapterNumber(String bookId, Integer chapterNumber);
    boolean existsByBookIdAndChapterNumber(String bookId, Integer chapterNumber);
}