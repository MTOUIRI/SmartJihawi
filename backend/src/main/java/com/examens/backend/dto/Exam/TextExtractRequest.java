package com.examens.backend.dto.Exam;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TextExtractRequest {
    
    @NotBlank(message = "Le contenu de l'extrait est requis")
    @Size(max = 5000, message = "L'extrait ne peut pas dépasser 5000 caractères")
    private String content;
    
    private SourceChapterRequest sourceChapter;
}