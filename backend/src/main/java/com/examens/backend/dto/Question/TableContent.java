package com.examens.backend.dto.Question;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableContent {
    private List<String> headers;
    private List<String> headersArabic;
    private List<String> answer;
    private List<String> answerArabic;
}