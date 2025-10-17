package com.examens.backend.dto.Exam;

import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SourceChapterRequest {
    
    private Long chapterId; // Reference to existing chapter
    
    private Integer chapterNumber;
    
    @Size(max = 200, message = "Le titre du chapitre ne peut pas dépasser 200 caractères")
    private String chapterTitle;
    
    @Size(max = 200, message = "Le titre arabe ne peut pas dépasser 200 caractères")
    private String chapterTitleArabic;
    
    @Size(max = 500, message = "L'URL ne peut pas dépasser 500 caractères")
    private String videoUrl;
    
    @Size(max = 10, message = "Le temps de début ne peut pas dépasser 10 caractères")
    private String timeStart; // Format: "MM:SS"
    
    @Size(max = 10, message = "Le temps de fin ne peut pas dépasser 10 caractères")
    private String timeEnd; // Format: "MM:SS"
}
