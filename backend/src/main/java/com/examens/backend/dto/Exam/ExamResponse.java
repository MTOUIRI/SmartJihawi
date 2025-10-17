package com.examens.backend.dto.Exam;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResponse {
    
    private Long id;
    private String bookId;
    private String title;
    private String titleArabic;
    private String year;
    private String region;
    private String subject;
    private String subjectArabic;
    private Integer points;
    private String duration;
    private TextExtractResponse textExtract;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}