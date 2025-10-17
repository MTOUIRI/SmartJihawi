package com.examens.backend.dto.Question;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionUpdateRequest {
    
    @NotBlank(message = "Le type de question est requis")
    @Pattern(regexp = "^(multiple_choice_single|multiple_choice|text|matching|table|word_placement)$",
             message = "Type de question invalide")
    private String type;
    
    @NotBlank(message = "Le contenu de la question est requis")
    @Size(max = 5000, message = "La question ne peut pas dépasser 5000 caractères")
    private String question;
    
    @Size(max = 5000, message = "La question arabe ne peut pas dépasser 5000 caractères")
    private String questionArabic;
    
    @Size(max = 2000, message = "L'instruction ne peut pas dépasser 2000 caractères")
    private String instruction;
    
    @Size(max = 2000, message = "L'instruction arabe ne peut pas dépasser 2000 caractères")
    private String instructionArabic;
    
    @NotNull(message = "Le nombre de points est requis")
    @DecimalMin(value = "0.25", message = "Le minimum est 0.25 points")
    @DecimalMax(value = "20.0", message = "Le maximum est 20 points")
    private Integer points;
    
    @Min(value = 1, message = "L'ordre doit être au moins 1")
    private Integer order;
    
    private List<Map<String, Object>> options;
    private List<Map<String, Object>> subQuestions;
    private List<Map<String, Object>> matchingPairs;
    private Map<String, Object> tableContent;
    private Map<String, Object> dragDropWords;
    private Map<String, Object> helper;
    
    @Size(max = 5000, message = "La réponse ne peut pas dépasser 5000 caractères")
    private String answer;
    
    @Size(max = 5000, message = "La réponse arabe ne peut pas dépasser 5000 caractères")
    private String answerArabic;
}