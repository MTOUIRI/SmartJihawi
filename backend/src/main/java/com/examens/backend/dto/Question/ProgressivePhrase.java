package com.examens.backend.dto.Question;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressivePhrase {
    private String template;
    private List<String> words;
    private String description;
    private String descriptionArabic;
    private Map<String, Object> helper;
}