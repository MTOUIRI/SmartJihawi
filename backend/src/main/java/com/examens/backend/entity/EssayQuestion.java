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
@Table(name = "essay_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class EssayQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;
    
    @Column(nullable = false)
    private String type;
    
    // New title fields
    @Column(name = "title", columnDefinition = "TEXT")
    private String title;
    
    @Column(name = "title_arabic", columnDefinition = "TEXT")
    private String titleArabic;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;
    
    @Column(name = "question_arabic", columnDefinition = "TEXT")
    private String questionArabic;
    
    @Column(nullable = false)
    private Integer points = 2;
    
    @Column(name = "question_order")
    private Integer order;
    
    @Type(JsonType.class)
    @Column(name = "progressive_phrases", columnDefinition = "json")
    private List<Map<String, Object>> progressivePhrases;
    
    @Type(JsonType.class)
    @Column(name = "helper", columnDefinition = "json")
    private Map<String, Object> helper;
    
    @Column(columnDefinition = "TEXT")
    private String answer;
    
    @Column(name = "answer_arabic", columnDefinition = "TEXT")
    private String answerArabic;
    
    @Column(name = "sub_title")
    private String subTitle;
    
    @Column(name = "sub_title_arabic")
    private String subTitleArabic;
    
    @Column(name = "prompt", columnDefinition = "TEXT")
    private String prompt;
    
    @Column(name = "prompt_arabic", columnDefinition = "TEXT")
    private String promptArabic;
    
    @Type(JsonType.class)
    @Column(name = "criteria", columnDefinition = "json")
    private Map<String, Object> criteria;
    
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