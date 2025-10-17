package com.examens.backend.dto.QCM;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QCMQuestionUpdateRequest {
    
    @NotBlank(message = "Question est requise")
    private String question;
    
    private String questionArabic;
    
    @NotNull(message = "Options sont requises")
    @Size(min = 4, max = 4, message = "Exactement 4 options requises")
    private List<Map<String, String>> options;
    
    @NotBlank(message = "Réponse correcte est requise")
    @Pattern(regexp = "[a-d]", message = "Réponse doit être a, b, c, ou d")
    private String correctAnswer;
    
    private String explanation;
    
    private String explanationArabic;
}