package com.examens.backend.dto.QCM;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QCMCountResponse {
    private Long chapterId;
    private Long count;
}