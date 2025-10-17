package com.examens.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String bookId; // 'dernier-jour', 'antigone', 'boite-merveilles'
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "title_arabic")
    private String titleArabic;
    
    @Column(nullable = false)
    private String year;
    
    @Column(nullable = false)
    private String region;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(name = "subject_arabic")
    private String subjectArabic;
    
    @Column(nullable = false)
    private Integer points;
    
    @Column(nullable = false)
    private String duration;
    
    // Text extract with optional chapter reference
    @OneToOne(mappedBy = "exam", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TextExtract textExtract;
    
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