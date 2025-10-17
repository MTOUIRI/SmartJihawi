package com.examens.backend.dto.Essay;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EssayQuestionsListResponse {
    private List<EssayQuestionResponse> questions;
    private Integer totalQuestions;
    private Integer totalPoints;
}