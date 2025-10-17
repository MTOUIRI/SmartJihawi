package com.examens.backend.dto.Chapter;

public class ChapterResponse {
    private Long id;
    private String bookId;
    private Integer chapterNumber;
    private String title;
    private String duration;
    private String videoUrl;
    private String resume;
    private String createdAt;
    private String updatedAt;

    // Default constructor
    public ChapterResponse() {}

    // Constructor with all fields
    public ChapterResponse(Long id, String bookId, Integer chapterNumber, String title, 
                          String duration, String videoUrl, String resume, 
                          String createdAt, String updatedAt) {
        this.id = id;
        this.bookId = bookId;
        this.chapterNumber = chapterNumber;
        this.title = title;
        this.duration = duration;
        this.videoUrl = videoUrl;
        this.resume = resume;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "ChapterResponse{" +
                "id=" + id +
                ", bookId='" + bookId + '\'' +
                ", chapterNumber=" + chapterNumber +
                ", title='" + title + '\'' +
                ", duration='" + duration + '\'' +
                ", videoUrl='" + videoUrl + '\'' +
                ", resume='" + resume + '\'' +
                ", createdAt='" + createdAt + '\'' +
                ", updatedAt='" + updatedAt + '\'' +
                '}';
    }
}