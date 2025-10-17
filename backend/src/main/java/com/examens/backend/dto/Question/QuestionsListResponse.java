package com.examens.backend.dto.Question;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionsListResponse {
    private List<QuestionResponse> questions;
    private Integer totalQuestions;
    private Integer totalPoints;
}