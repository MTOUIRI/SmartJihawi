package com.examens.backend.util;

import com.examens.backend.dto.Essay.EssayQuestionCreateRequest;
import com.examens.backend.dto.Essay.EssayQuestionUpdateRequest;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class EssayQuestionValidationUtil {
    
    private static final Set<String> VALID_ESSAY_TYPES = Set.of(
        "essay_introduction",
        "essay_development", 
        "essay_conclusion",
        "essay_subject"
    );
    
    public void validateEssayQuestionCreate(EssayQuestionCreateRequest request) {
        validateEssayQuestionType(request.getType());
        validateEssayQuestionContent(request);
        validateEssayQuestionSpecificFields(request);
    }
    
    public void validateEssayQuestionUpdate(EssayQuestionUpdateRequest request) {
        validateEssayQuestionType(request.getType());
        validateEssayQuestionUpdateContent(request);
        validateEssayQuestionUpdateSpecificFields(request);
    }
    
    private void validateEssayQuestionType(String type) {
        if (type == null || type.trim().isEmpty()) {
            throw new IllegalArgumentException("Le type de question est requis");
        }
        
        if (!VALID_ESSAY_TYPES.contains(type)) {
            throw new IllegalArgumentException("Type de question d'expression invalide: " + type + 
                ". Types valides: " + String.join(", ", VALID_ESSAY_TYPES));
        }
    }
    
    private void validateEssayQuestionContent(EssayQuestionCreateRequest request) {
        if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
            throw new IllegalArgumentException("Le contenu de la question est requis");
        }
        
        if (request.getPoints() == null || request.getPoints() < 1) {
            throw new IllegalArgumentException("Le nombre de points doit être au moins 1");
        }
        
        if (request.getPoints() > 20) {
            throw new IllegalArgumentException("Le nombre de points ne peut pas dépasser 20");
        }
    }
    
    private void validateEssayQuestionUpdateContent(EssayQuestionUpdateRequest request) {
        if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
            throw new IllegalArgumentException("Le contenu de la question est requis");
        }
        
        if (request.getPoints() == null || request.getPoints() < 1) {
            throw new IllegalArgumentException("Le nombre de points doit être au moins 1");
        }
        
        if (request.getPoints() > 20) {
            throw new IllegalArgumentException("Le nombre de points ne peut pas dépasser 20");
        }
    }
    
    private void validateEssayQuestionSpecificFields(EssayQuestionCreateRequest request) {
        switch (request.getType()) {
            case "essay_introduction":
            case "essay_development":
            case "essay_conclusion":
                validateEssaySection(request);
                break;
            case "essay_subject":
                validateEssaySubject(request);
                break;
        }
    }
    
    private void validateEssayQuestionUpdateSpecificFields(EssayQuestionUpdateRequest request) {
        switch (request.getType()) {
            case "essay_introduction":
            case "essay_development":
            case "essay_conclusion":
                validateEssaySectionUpdate(request);
                break;
            case "essay_subject":
                validateEssaySubjectUpdate(request);
                break;
        }
    }
    
    @SuppressWarnings("unchecked")
    private void validateEssaySection(EssayQuestionCreateRequest request) {
        if (request.getProgressivePhrases() != null && !request.getProgressivePhrases().isEmpty()) {
            for (Map<String, Object> phrase : request.getProgressivePhrases()) {
                if (!phrase.containsKey("template") || !phrase.containsKey("words")) {
                    throw new IllegalArgumentException("Chaque phrase progressive doit avoir 'template' et 'words'");
                }
                
                String template = (String) phrase.get("template");
                List<String> words = (List<String>) phrase.get("words");
                
                if (template == null || template.trim().isEmpty()) {
                    throw new IllegalArgumentException("Le template de la phrase progressive est requis");
                }
                
                if (words == null || words.isEmpty()) {
                    throw new IllegalArgumentException("Les mots de la phrase progressive sont requis");
                }
            }
        }
    }
    
    @SuppressWarnings("unchecked")
    private void validateEssaySectionUpdate(EssayQuestionUpdateRequest request) {
        if (request.getProgressivePhrases() != null && !request.getProgressivePhrases().isEmpty()) {
            for (Map<String, Object> phrase : request.getProgressivePhrases()) {
                if (!phrase.containsKey("template") || !phrase.containsKey("words")) {
                    throw new IllegalArgumentException("Chaque phrase progressive doit avoir 'template' et 'words'");
                }
            }
        }
    }
    
    @SuppressWarnings("unchecked")
    private void validateEssaySubject(EssayQuestionCreateRequest request) {
        if (request.getCriteria() == null) {
            throw new IllegalArgumentException("Les critères d'évaluation sont requis pour le sujet d'expression");
        }
        
        Map<String, Object> criteria = request.getCriteria();
        if (!criteria.containsKey("discourse") || !criteria.containsKey("language")) {
            throw new IllegalArgumentException("Les critères doivent contenir 'discourse' et 'language'");
        }
        
        if (request.getPrompt() == null || request.getPrompt().trim().isEmpty()) {
            throw new IllegalArgumentException("Le sujet/prompt est requis pour l'expression");
        }
    }
    
    @SuppressWarnings("unchecked")
    private void validateEssaySubjectUpdate(EssayQuestionUpdateRequest request) {
        if (request.getCriteria() == null) {
            throw new IllegalArgumentException("Les critères d'évaluation sont requis pour le sujet d'expression");
        }
        
        Map<String, Object> criteria = request.getCriteria();
        if (!criteria.containsKey("discourse") || !criteria.containsKey("language")) {
            throw new IllegalArgumentException("Les critères doivent contenir 'discourse' et 'language'");
        }
        
        if (request.getPrompt() == null || request.getPrompt().trim().isEmpty()) {
            throw new IllegalArgumentException("Le sujet/prompt est requis pour l'expression");
        }
    }
}