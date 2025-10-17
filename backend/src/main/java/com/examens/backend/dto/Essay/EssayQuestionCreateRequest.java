package com.examens.backend.dto.Essay;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EssayQuestionCreateRequest {
    @NotNull(message = "L'ID de l'examen est requis")
    private Long examId;
    
    @NotBlank(message = "Le type de question est requis")
    private String type;
    
    // NEW: Title fields
    private String title;
    private String titleArabic;
    
    @NotBlank(message = "La question est requise")
    private String question;
    
    private String questionArabic;
    
    @NotNull(message = "Les points sont requis")
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
}