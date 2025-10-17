package com.examens.backend.dto.Question;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MultipleChoiceOption {
    private String id;
    private String text;
    private String textArabic;
}