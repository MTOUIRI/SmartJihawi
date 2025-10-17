package com.examens.backend.dto.Question;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubQuestion {
    private String id;
    private String question;
    private String questionArabic;
    private String answer;
    private String answerArabic;
    private String justification;
    private String justificationArabic;
}