package com.examens.backend.dto.Exam;

import lombok.Data;

@Data
public class SourceChapterResponse {
    private Long chapterId;
    private Integer chapterNumber;
    private String chapterTitle;
    private String chapterTitleArabic;
    private String videoUrl;
    private String timeStart;
    private String timeEnd;
    private String bookTitle; // Derived from bookId for frontend display
}