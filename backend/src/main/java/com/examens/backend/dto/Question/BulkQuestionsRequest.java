package com.examens.backend.dto.Question;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkQuestionsRequest {
    
    @NotNull(message = "L'ID de l'examen est requis")
    private Long examId;
    
    @NotEmpty(message = "Au moins une question est requise")
    @Valid
    private List<QuestionCreateRequest> questions;
}