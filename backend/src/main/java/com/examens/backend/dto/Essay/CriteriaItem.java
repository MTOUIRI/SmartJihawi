package com.examens.backend.dto.Essay;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CriteriaItem {
    private String text;
    private String textArabic;
    private Integer points;
}