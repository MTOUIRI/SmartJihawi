package com.examens.backend.controller;

import com.examens.backend.dto.Chapter.ChapterCreateRequest;
import com.examens.backend.dto.Chapter.ChapterResponse;
import com.examens.backend.dto.Chapter.ChapterUpdateRequest;
import com.examens.backend.service.ChapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/chapters")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class ChapterController {
    
    @Autowired
    private ChapterService chapterService;
    
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ChapterResponse>> getChaptersByBook(@PathVariable String bookId) {
        List<ChapterResponse> chapters = chapterService.getAllChaptersByBook(bookId);
        return ResponseEntity.ok(chapters);
    }
    
    @GetMapping("/{chapterId}")
    public ResponseEntity<?> getChapter(@PathVariable Long chapterId) {
        try {
            ChapterResponse chapter = chapterService.getChapterById(chapterId);
            return ResponseEntity.ok(chapter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createChapter(@Valid @RequestBody ChapterCreateRequest request) {
        try {
            ChapterResponse chapter = chapterService.createChapter(request);
            return ResponseEntity.ok(chapter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de création", e.getMessage()));
        }
    }
    
    @PutMapping("/{chapterId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateChapter(@PathVariable Long chapterId, 
                                         @Valid @RequestBody ChapterUpdateRequest request) {
        try {
            ChapterResponse chapter = chapterService.updateChapter(chapterId, request);
            return ResponseEntity.ok(chapter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de mise à jour", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{chapterId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteChapter(@PathVariable Long chapterId) {
        try {
            chapterService.deleteChapter(chapterId);
            return ResponseEntity.ok(new MessageResponse("Chapitre supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de suppression", e.getMessage()));
        }
    }
    
    // Helper classes for responses
    public static class ErrorResponse {
        private String error;
        private String message;
        
        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }
        
        public String getError() { return error; }
        public String getMessage() { return message; }
    }
    
    public static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
    }
}