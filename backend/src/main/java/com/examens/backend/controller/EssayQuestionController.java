package com.examens.backend.controller;

import com.examens.backend.dto.Essay.EssayQuestionCreateRequest;
import com.examens.backend.dto.Essay.EssayQuestionResponse;
import com.examens.backend.dto.Essay.EssayQuestionUpdateRequest;
import com.examens.backend.dto.Essay.EssayQuestionsListResponse;
import com.examens.backend.service.EssayQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@RestController
@RequestMapping("/api/essay-questions")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class EssayQuestionController {
    
    @Autowired
    private EssayQuestionService essayQuestionService;
    
    @GetMapping("/exam/{examId}")
    public ResponseEntity<?> getEssayQuestionsByExam(@PathVariable @NotNull Long examId) {
        try {
            EssayQuestionsListResponse questions = essayQuestionService.getEssayQuestionsByExamId(examId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    @GetMapping("/{questionId}")
    public ResponseEntity<?> getEssayQuestion(@PathVariable @NotNull Long questionId) {
        try {
            EssayQuestionResponse question = essayQuestionService.getEssayQuestionById(questionId);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    @GetMapping("/book/{bookId}")
    public ResponseEntity<?> getEssayQuestionsByBook(@PathVariable String bookId) {
        try {
            List<EssayQuestionResponse> questions = essayQuestionService.getEssayQuestionsByBookId(bookId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createEssayQuestion(@Valid @RequestBody EssayQuestionCreateRequest request) {
        try {
            EssayQuestionResponse question = essayQuestionService.createEssayQuestion(request);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de création", e.getMessage()));
        }
    }
    
    @PutMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateEssayQuestion(@PathVariable @NotNull Long questionId,
                                                @Valid @RequestBody EssayQuestionUpdateRequest request) {
        try {
            EssayQuestionResponse question = essayQuestionService.updateEssayQuestion(questionId, request);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de mise à jour", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEssayQuestion(@PathVariable @NotNull Long questionId) {
        try {
            essayQuestionService.deleteEssayQuestion(questionId);
            return ResponseEntity.ok(new MessageResponse("Question d'expression supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de suppression", e.getMessage()));
        }
    }
    
    @DeleteMapping("/exam/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAllEssayQuestionsByExam(@PathVariable @NotNull Long examId) {
        try {
            essayQuestionService.deleteAllEssayQuestionsByExamId(examId);
            return ResponseEntity.ok(new MessageResponse("Toutes les questions d'expression de l'examen supprimées avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de suppression", e.getMessage()));
        }
    }
    
    @PutMapping("/exam/{examId}/reorder")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reorderEssayQuestions(@PathVariable @NotNull Long examId,
                                                  @RequestBody @NotNull List<Long> questionIds) {
        try {
            List<EssayQuestionResponse> questions = essayQuestionService.reorderEssayQuestions(examId, questionIds);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de réorganisation", e.getMessage()));
        }
    }
    
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