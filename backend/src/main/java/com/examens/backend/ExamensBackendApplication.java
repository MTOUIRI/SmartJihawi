package com.examens.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching  // ← Add this annotation to enable caching
public class ExamensBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExamensBackendApplication.class, args);
    }
}