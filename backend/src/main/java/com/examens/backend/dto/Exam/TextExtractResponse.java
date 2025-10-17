package com.examens.backend.dto.Exam;

import lombok.Data;

@Data
public class TextExtractResponse {
    private Long id;
    private String content;
    private SourceChapterResponse sourceChapter;
}