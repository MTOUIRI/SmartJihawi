package com.examens.backend.dto.Question;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    
    private Long id;
    private Long examId;
    private String type;
    private String question;
    private String questionArabic;
    private String instruction;
    private String instructionArabic;
    private Integer points;
    private Integer order;
    private List<Map<String, Object>> options;
    private List<Map<String, Object>> subQuestions;
    private List<Map<String, Object>> matchingPairs;
    private Map<String, Object> tableContent;
    private Map<String, Object> dragDropWords;
    private Map<String, Object> helper;
    private String answer;
    private String answerArabic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}