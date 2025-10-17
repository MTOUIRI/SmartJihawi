package com.examens.backend.dto.Chapter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class ChapterCreateRequest {
    @NotBlank(message = "L'ID du livre est requis")
    private String bookId;
    
    @NotNull(message = "Le numéro du chapitre est requis")
    @Min(value = 1, message = "Le numéro du chapitre doit être au moins 1")
    private Integer chapterNumber;
    
    @NotBlank(message = "Le titre est requis")
    private String title;
    
    @NotBlank(message = "La durée est requise")
    private String duration;
    
    private String videoUrl;
    
    @NotBlank(message = "Le résumé est requis")
    private String resume;

    // Default constructor
    public ChapterCreateRequest() {}

    // Constructor with all fields
    public ChapterCreateRequest(String bookId, Integer chapterNumber, String title, 
                               String duration, String videoUrl, String resume) {
        this.bookId = bookId;
        this.chapterNumber = chapterNumber;
        this.title = title;
        this.duration = duration;
        this.videoUrl = videoUrl;
        this.resume = resume;
    }

    // Getters and Setters
    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public Integer getChapterNumber() {
        return chapterNumber;
    }

    public void setChapterNumber(Integer chapterNumber) {
        this.chapterNumber = chapterNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getResume() {
        return resume;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }

    @Override
    public String toString() {
        return "ChapterCreateRequest{" +
                "bookId='" + bookId + '\'' +
                ", chapterNumber=" + chapterNumber +
                ", title='" + title + '\'' +
                ", duration='" + duration + '\'' +
                ", videoUrl='" + videoUrl + '\'' +
                ", resume='" + resume + '\'' +
                '}';
    }
}