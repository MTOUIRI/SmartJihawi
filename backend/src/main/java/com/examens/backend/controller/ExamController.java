package com.examens.backend.controller;

import com.examens.backend.dto.Exam.ExamCreateRequest;
import com.examens.backend.dto.Exam.ExamResponse;
import com.examens.backend.dto.Exam.ExamUpdateRequest;
import com.examens.backend.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class ExamController {
    
    @Autowired
    private ExamService examService;
    
    @GetMapping
    public ResponseEntity<List<ExamResponse>> getAllExams() {
        List<ExamResponse> exams = examService.getAllExams();
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ExamResponse>> getExamsByBook(@PathVariable String bookId) {
        List<ExamResponse> exams = examService.getAllExamsByBook(bookId);
        return ResponseEntity.ok(exams);
    }
    
    @GetMapping("/{examId}")
    public ResponseEntity<?> getExam(@PathVariable Long examId) {
        try {
            ExamResponse exam = examService.getExamById(examId);
            return ResponseEntity.ok(exam);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur", e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createExam(@Valid @RequestBody ExamCreateRequest request) {
        try {
            ExamResponse exam = examService.createExam(request);
            return ResponseEntity.ok(exam);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de création", e.getMessage()));
        }
    }
    
    @PutMapping("/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateExam(@PathVariable Long examId, 
                                      @Valid @RequestBody ExamUpdateRequest request) {
        try {
            ExamResponse exam = examService.updateExam(examId, request);
            return ResponseEntity.ok(exam);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Erreur de mise à jour", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteExam(@PathVariable Long examId) {
        try {
            examService.deleteExam(examId);
            return ResponseEntity.ok(new MessageResponse("Examen supprimé avec succès"));
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