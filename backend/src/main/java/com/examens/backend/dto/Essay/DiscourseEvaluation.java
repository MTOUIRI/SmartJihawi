package com.examens.backend.dto.Essay;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscourseEvaluation {
    private String title;
    private String titleArabic;
    private List<CriteriaItem> items;
    private Integer totalPoints;
}