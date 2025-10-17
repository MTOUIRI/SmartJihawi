package com.examens.backend.controller;

import com.examens.backend.dto.QCM.QCMCountResponse;
import com.examens.backend.dto.QCM.QCMQuestionCreateRequest;
import com.examens.backend.dto.QCM.QCMQuestionResponse;
import com.examens.backend.dto.QCM.QCMQuestionUpdateRequest;
import com.examens.backend.service.QCMQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/qcm")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class QCMQuestionController {
    
    @Autowired
    private QCMQuestionService qcmQuestionService;
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<?> getQuestionsByChapter(@PathVariable Long chapterId) {
        try {
            List<QCMQuestionResponse> questions = qcmQuestionService.getQuestionsByChapter(chapterId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    /**
     * Get QCM question count for a chapter
     * PUBLIC - Shows count as a teaser (actual questions are protected)
     */
    @GetMapping("/chapter/{chapterId}/count")
    public ResponseEntity<?> getQuestionCountByChapter(@PathVariable Long chapterId) {
        try {
            QCMCountResponse count = qcmQuestionService.getQuestionCountByChapter(chapterId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    @GetMapping("/{questionId}")
    public ResponseEntity<?> getQuestion(@PathVariable Long questionId) {
        try {
            QCMQuestionResponse question = qcmQuestionService.getQuestionById(questionId);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    /**
     * Create QCM question
     * ADMIN ONLY
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createQuestion(@Valid @RequestBody QCMQuestionCreateRequest request) {
        try {
            QCMQuestionResponse question = qcmQuestionService.createQuestion(request);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de création", e.getMessage()));
        }
    }
    
    /**
     * Update QCM question
     * ADMIN ONLY
     */
    @PutMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateQuestion(@PathVariable Long questionId,
                                           @Valid @RequestBody QCMQuestionUpdateRequest request) {
        try {
            QCMQuestionResponse question = qcmQuestionService.updateQuestion(questionId, request);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de mise à jour", e.getMessage()));
        }
    }
    
    /**
     * Delete QCM question
     * ADMIN ONLY
     */
    @DeleteMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long questionId) {
        try {
            qcmQuestionService.deleteQuestion(questionId);
            return ResponseEntity.ok(new MessageResponse("Question QCM supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de suppression", e.getMessage()));
        }
    }
    
    /**
     * Delete all QCM questions for a chapter
     * ADMIN ONLY
     */
    @DeleteMapping("/chapter/{chapterId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAllQuestionsByChapter(@PathVariable Long chapterId) {
        try {
            qcmQuestionService.deleteAllQuestionsByChapter(chapterId);
            return ResponseEntity.ok(new MessageResponse("Toutes les questions QCM du chapitre supprimées avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de suppression", e.getMessage()));
        }
    }
    
    // ============================================
    // Response Helper Classes
    // ============================================
    
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