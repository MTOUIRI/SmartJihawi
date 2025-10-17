package com.examens.backend.dto.Exam;

import jakarta.validation.constraints.*;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamUpdateRequest {
    
    @NotBlank(message = "Le titre est requis")
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String title;
    
    @Size(max = 200, message = "Le titre arabe ne peut pas dépasser 200 caractères")
    private String titleArabic;
    
    @NotBlank(message = "L'année est requise")
    @Pattern(regexp = "\\d{4}", message = "L'année doit être au format YYYY")
    private String year;
    
    @NotBlank(message = "La région est requise")
    @Size(max = 100, message = "La région ne peut pas dépasser 100 caractères")
    private String region;
    
    @NotBlank(message = "La matière est requise")
    @Size(max = 100, message = "La matière ne peut pas dépasser 100 caractères")
    private String subject;
    
    @Size(max = 100, message = "La matière arabe ne peut pas dépasser 100 caractères")
    private String subjectArabic;
    
    @NotNull(message = "Le nombre de points est requis")
    @Min(value = 1, message = "Le minimum est 1 point")
    @Max(value = 100, message = "Le maximum est 100 points")
    private Integer points;
    
    @NotBlank(message = "La durée est requise")
    @Size(max = 50, message = "La durée ne peut pas dépasser 50 caractères")
    private String duration;
    
    @Valid
    @NotNull(message = "L'extrait de texte est requis")
    private TextExtractRequest textExtract;
}
