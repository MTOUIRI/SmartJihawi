package com.examens.backend.controller;

import com.examens.backend.dto.Question.BulkQuestionsRequest;
import com.examens.backend.dto.Question.QuestionCreateRequest;
import com.examens.backend.dto.Question.QuestionResponse;
import com.examens.backend.dto.Question.QuestionUpdateRequest;
import com.examens.backend.dto.Question.QuestionsListResponse;
import com.examens.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class QuestionController {
    
    @Autowired
    private QuestionService questionService;
    
    @GetMapping("/exam/{examId}")
    public ResponseEntity<?> getQuestionsByExam(@PathVariable @NotNull Long examId) {
        try {
            QuestionsListResponse questions = questionService.getQuestionsByExamId(examId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    @GetMapping("/{questionId}")
    public ResponseEntity<?> getQuestion(@PathVariable @NotNull Long questionId) {
        try {
            QuestionResponse question = questionService.getQuestionById(questionId);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    @GetMapping("/book/{bookId}")
    public ResponseEntity<?> getQuestionsByBook(@PathVariable String bookId) {
        try {
            List<QuestionResponse> questions = questionService.getQuestionsByBookId(bookId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createQuestion(@Valid @RequestBody QuestionCreateRequest request) {
        try {
            QuestionResponse question = questionService.createQuestion(request);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de création", e.getMessage()));
        }
    }
    
    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBulkQuestions(@Valid @RequestBody BulkQuestionsRequest request) {
        try {
            List<QuestionResponse> questions = questionService.createBulkQuestions(request);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de création groupée", e.getMessage()));
        }
    }
    
    @PutMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateQuestion(@PathVariable @NotNull Long questionId,
                                           @Valid @RequestBody QuestionUpdateRequest request) {
        try {
            QuestionResponse question = questionService.updateQuestion(questionId, request);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de mise à jour", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteQuestion(@PathVariable @NotNull Long questionId) {
        try {
            questionService.deleteQuestion(questionId);
            return ResponseEntity.ok(new MessageResponse("Question supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de suppression", e.getMessage()));
        }
    }
    
    @DeleteMapping("/exam/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAllQuestionsByExam(@PathVariable @NotNull Long examId) {
        try {
            questionService.deleteAllQuestionsByExamId(examId);
            return ResponseEntity.ok(new MessageResponse("Toutes les questions de l'examen supprimées avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de suppression", e.getMessage()));
        }
    }
    
    @PutMapping("/exam/{examId}/reorder")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reorderQuestions(@PathVariable @NotNull Long examId,
                                             @RequestBody @NotNull List<Long> questionIds) {
        try {
            List<QuestionResponse> questions = questionService.reorderQuestions(examId, questionIds);
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
        public void setError(String error) { this.error = error; }
        public void setMessage(String message) { this.message = message; }
    }
    
    public static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}