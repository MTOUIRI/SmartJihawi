package com.examens.backend.dto.Chapter;

import jakarta.validation.constraints.NotBlank;

public class ChapterUpdateRequest {
    @NotBlank(message = "Le titre est requis")
    private String title;
    
    @NotBlank(message = "La durée est requise")
    private String duration;
    
    private String videoUrl;
    
    @NotBlank(message = "Le résumé est requis")
    private String resume;

    // Default constructor
    public ChapterUpdateRequest() {}

    // Constructor with all fields
    public ChapterUpdateRequest(String title, String duration, String videoUrl, String resume) {
        this.title = title;
        this.duration = duration;
        this.videoUrl = videoUrl;
        this.resume = resume;
    }

    // Getters and Setters
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
        return "ChapterUpdateRequest{" +
                "title='" + title + '\'' +
                ", duration='" + duration + '\'' +
                ", videoUrl='" + videoUrl + '\'' +
                ", resume='" + resume + '\'' +
                '}';
    }
}