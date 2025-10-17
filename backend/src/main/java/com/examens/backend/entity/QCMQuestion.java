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
@Table(name = "qcm_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class QCMQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;
    
    @Column(name = "question_arabic", columnDefinition = "TEXT")
    private String questionArabic;
    
    // Store options as JSON: [{"id":"a","text":"...","textArabic":"..."}, ...]
    @Type(JsonType.class)
    @Column(name = "options", columnDefinition = "json", nullable = false)
    private List<Map<String, String>> options;
    
    @Column(name = "correct_answer", nullable = false, length = 1)
    private String correctAnswer; // 'a', 'b', 'c', or 'd'
    
    @Column(columnDefinition = "TEXT")
    private String explanation;
    
    @Column(name = "explanation_arabic", columnDefinition = "TEXT")
    private String explanationArabic;
    
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