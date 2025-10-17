package com.examens.backend.dto.Question;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DragDropWords {
    private String template;
    private List<String> words;
}