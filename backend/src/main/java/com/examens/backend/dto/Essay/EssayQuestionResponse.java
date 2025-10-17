package com.examens.backend.dto.Essay;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EssayQuestionResponse {
    private Long id;
    
    private Long examId;
    
    private String type;
    
    // NEW: Title fields
    private String title;
    private String titleArabic;
    
    private String question;
    
    private String questionArabic;
    
    private Integer points;
    
    private Integer order;
    
    private List<Map<String, Object>> progressivePhrases;
    
    private Map<String, Object> helper;
    
    private String answer;
    
    private String answerArabic;
    
    private String subTitle;
    
    private String subTitleArabic;
    
    private String prompt;
    
    private String promptArabic;
    
    private Map<String, Object> criteria;
    
    private java.time.LocalDateTime createdAt;
    
    private java.time.LocalDateTime updatedAt;
}