package com.examens.backend.dto.QCM;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QCMQuestionResponse {
    
    private Long id;
    private Long chapterId;
    private String question;
    private String questionArabic;
    private List<Map<String, String>> options;
    private String correctAnswer;
    private String explanation;
    private String explanationArabic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}