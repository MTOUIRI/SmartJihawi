package com.examens.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyHelper {
    private List<String> french;
    private List<String> arabic;
}