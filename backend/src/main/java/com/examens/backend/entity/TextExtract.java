package com.examens.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "text_extracts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TextExtract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;
    
    @Column(length = 5000, nullable = false)
    private String content;
    
    // Optional chapter reference - stored as JSON or separate fields
    @Column(name = "source_chapter_id")
    private Long sourceChapterId; // Reference to Chapter entity
    
    // Alternative: store chapter info directly if not referencing Chapter entity
    @Column(name = "chapter_number")
    private Integer chapterNumber;
    
    @Column(name = "chapter_title")
    private String chapterTitle;
    
    @Column(name = "chapter_title_arabic")
    private String chapterTitleArabic;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    @Column(name = "time_start")
    private String timeStart; // Format: "MM:SS"
    
    @Column(name = "time_end")
    private String timeEnd; // Format: "MM:SS"
    
    // Optional relationship to Chapter entity if you want to reference existing chapters
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_ref_id")
    private Chapter chapterRef;
}