package com.examens.backend.dto.Question;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchingPair {
    private String left;
    private String leftArabic;
    private String right;
    private String rightArabic;
}