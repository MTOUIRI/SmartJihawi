package com.examens.backend.service;

import com.examens.backend.dto.Chapter.ChapterCreateRequest;
import com.examens.backend.dto.Chapter.ChapterResponse;
import com.examens.backend.dto.Chapter.ChapterUpdateRequest;
import com.examens.backend.entity.Chapter;
import com.examens.backend.repository.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChapterService {
    
    @Autowired
    private ChapterRepository chapterRepository;
    
    // ✅ CACHED: Chapters by book
    @Cacheable(value = "chapters", key = "'book-' + #bookId")
    public List<ChapterResponse> getAllChaptersByBook(String bookId) {
        return chapterRepository.findByBookIdOrderByChapterNumber(bookId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // ✅ CACHED: Single chapter by ID
    @Cacheable(value = "chapters", key = "#chapterId")
    public ChapterResponse getChapterById(Long chapterId) throws Exception {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new Exception("Chapitre non trouvé"));
        return convertToResponse(chapter);
    }
    
    // ⚠️ CACHE EVICTION: Clear chapters and qcm caches when creating
    @CacheEvict(value = {"chapters", "qcm"}, allEntries = true)
    public ChapterResponse createChapter(ChapterCreateRequest request) throws Exception {
        // Check if chapter number already exists for this book
        if (chapterRepository.existsByBookIdAndChapterNumber(request.getBookId(), request.getChapterNumber())) {
            throw new Exception("Le chapitre " + request.getChapterNumber() + " existe déjà pour ce livre");
        }
        
        Chapter chapter = new Chapter();
        chapter.setBookId(request.getBookId());
        chapter.setChapterNumber(request.getChapterNumber());
        chapter.setTitle(request.getTitle());
        chapter.setDuration(request.getDuration());
        chapter.setVideoUrl(request.getVideoUrl());
        chapter.setResume(request.getResume());
        
        Chapter savedChapter = chapterRepository.save(chapter);
        return convertToResponse(savedChapter);
    }
    
    // ⚠️ CACHE EVICTION: Clear chapters and qcm caches when updating
    @CacheEvict(value = {"chapters", "qcm"}, allEntries = true)
    public ChapterResponse updateChapter(Long chapterId, ChapterUpdateRequest request) throws Exception {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new Exception("Chapitre non trouvé"));
        
        chapter.setTitle(request.getTitle());
        chapter.setDuration(request.getDuration());
        chapter.setVideoUrl(request.getVideoUrl());
        chapter.setResume(request.getResume());
        
        Chapter updatedChapter = chapterRepository.save(chapter);
        return convertToResponse(updatedChapter);
    }
    
    // ⚠️ CACHE EVICTION: Clear chapters and qcm caches when deleting
    @CacheEvict(value = {"chapters", "qcm"}, allEntries = true)
    public void deleteChapter(Long chapterId) throws Exception {
        if (!chapterRepository.existsById(chapterId)) {
            throw new Exception("Chapitre non trouvé");
        }
        chapterRepository.deleteById(chapterId);
    }
    
    private ChapterResponse convertToResponse(Chapter chapter) {
        ChapterResponse response = new ChapterResponse();
        response.setId(chapter.getId());
        response.setBookId(chapter.getBookId());
        response.setChapterNumber(chapter.getChapterNumber());
        response.setTitle(chapter.getTitle());
        response.setDuration(chapter.getDuration());
        response.setVideoUrl(chapter.getVideoUrl());
        response.setResume(chapter.getResume());
        response.setCreatedAt(chapter.getCreatedAt().toString());
        response.setUpdatedAt(chapter.getUpdatedAt().toString());
        return response;
    }
}