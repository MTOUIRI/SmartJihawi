package com.examens.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;
    
    @Column(name = "question_arabic", columnDefinition = "TEXT")
    private String questionArabic;
    
    @Column(name = "instruction", columnDefinition = "TEXT")
    private String instruction;
    
    @Column(name = "instruction_arabic", columnDefinition = "TEXT")
    private String instructionArabic;
    
    @Column(nullable = false)
    private Integer points;
    
    @Column(name = "question_order")
    private Integer order;
    
    @Type(JsonType.class)
    @Column(name = "options", columnDefinition = "json")
    private List<Map<String, Object>> options;
    
    @Type(JsonType.class)
    @Column(name = "sub_questions", columnDefinition = "json")
    private List<Map<String, Object>> subQuestions;
    
    @Type(JsonType.class)
    @Column(name = "matching_pairs", columnDefinition = "json")
    private List<Map<String, Object>> matchingPairs;
    
    @Type(JsonType.class)
    @Column(name = "table_content", columnDefinition = "json")
    private Map<String, Object> tableContent;
    
    @Type(JsonType.class)
    @Column(name = "drag_drop_words", columnDefinition = "json")
    private Map<String, Object> dragDropWords;
    
    @Type(JsonType.class)
    @Column(name = "helper", columnDefinition = "json")
    private Map<String, Object> helper;
    
    @Column(columnDefinition = "TEXT")
    private String answer;
    
    @Column(name = "answer_arabic", columnDefinition = "TEXT")
    private String answerArabic;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}