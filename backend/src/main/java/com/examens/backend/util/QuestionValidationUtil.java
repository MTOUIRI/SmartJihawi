package com.examens.backend.util;

import com.examens.backend.dto.Question.QuestionCreateRequest;
import com.examens.backend.dto.Question.QuestionUpdateRequest;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class QuestionValidationUtil {
    
    private static final Set<String> VALID_QUESTION_TYPES = Set.of(
        "multiple_choice_single",
        "multiple_choice", 
        "text",
        "matching",
        "table",
        "word_placement"
    );
    
    public void validateQuestionCreate(QuestionCreateRequest request) {
        validateQuestionType(request.getType());
        validateQuestionContent(request);
        validateQuestionSpecificFields(request);
    }
    
    public void validateQuestionUpdate(QuestionUpdateRequest request) {
        validateQuestionType(request.getType());
        validateQuestionUpdateContent(request);
        validateQuestionUpdateSpecificFields(request);
    }
    
    private void validateQuestionType(String type) {
        if (type == null || type.trim().isEmpty()) {
            throw new IllegalArgumentException("Le type de question est requis");
        }
        
        if (!VALID_QUESTION_TYPES.contains(type)) {
            throw new IllegalArgumentException("Type de question invalide: " + type + 
                ". Types valides: " + String.join(", ", VALID_QUESTION_TYPES));
        }
    }
    
    private void validateQuestionContent(QuestionCreateRequest request) {
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
    
    private void validateQuestionUpdateContent(QuestionUpdateRequest request) {
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
    
    private void validateQuestionSpecificFields(QuestionCreateRequest request) {
        switch (request.getType()) {
            case "multiple_choice_single":
                validateMultipleChoiceSingle(request);
                break;
            case "multiple_choice":
                validateMultipleChoice(request);
                break;
            case "matching":
                validateMatching(request);
                break;
            case "table":
                validateTable(request);
                break;
            case "word_placement":
                validateWordPlacement(request);
                break;
        }
    }
    
    private void validateQuestionUpdateSpecificFields(QuestionUpdateRequest request) {
        // Similar validation logic for update
    }
    
    @SuppressWarnings("unchecked")
    private void validateMultipleChoiceSingle(QuestionCreateRequest request) {
        if (request.getOptions() == null || request.getOptions().isEmpty()) {
            throw new IllegalArgumentException("Les options sont requises pour les questions à choix multiple");
        }
        
        if (request.getOptions().size() < 2) {
            throw new IllegalArgumentException("Au moins 2 options sont requises");
        }
        
        if (request.getOptions().size() > 6) {
            throw new IllegalArgumentException("Maximum 6 options autorisées");
        }
        
        for (Map<String, Object> option : request.getOptions()) {
            if (!option.containsKey("id") || !option.containsKey("text")) {
                throw new IllegalArgumentException("Chaque option doit avoir un 'id' et un 'text'");
            }
        }
        
        if (request.getAnswer() == null || request.getAnswer().trim().isEmpty()) {
            throw new IllegalArgumentException("La réponse correcte est requise");
        }
        
        boolean answerExists = request.getOptions().stream()
            .anyMatch(option -> request.getAnswer().equals(option.get("id")));
        
        if (!answerExists) {
            throw new IllegalArgumentException("La réponse correcte doit correspondre à l'une des options");
        }
    }
    @SuppressWarnings("unchecked")
    private void validateMultipleChoice(QuestionCreateRequest request) {
        if (request.getSubQuestions() == null || request.getSubQuestions().isEmpty()) {
            throw new IllegalArgumentException("Les sous-questions sont requises pour ce type de question");
        }
        
        if (request.getSubQuestions().size() > 10) {
            throw new IllegalArgumentException("Maximum 10 sous-questions autorisées");
        }
        
        for (Map<String, Object> subQ : request.getSubQuestions()) {
            if (!subQ.containsKey("id") || !subQ.containsKey("question") || !subQ.containsKey("answer")) {
                throw new IllegalArgumentException("Chaque sous-question doit avoir 'id', 'question' et 'answer'");
            }
            
            String answer = (String) subQ.get("answer");
            if (!"VRAI".equals(answer) && !"FAUX".equals(answer) && !"صحيح".equals(answer) && !"خطأ".equals(answer)) {
                throw new IllegalArgumentException("La réponse doit être 'VRAI', 'FAUX', 'صحيح', ou 'خطأ'");
            }
        }
    }
    
    @SuppressWarnings("unchecked")
    private void validateMatching(QuestionCreateRequest request) {
        if (request.getMatchingPairs() == null || request.getMatchingPairs().isEmpty()) {
            throw new IllegalArgumentException("Les paires de correspondance sont requises");
        }
        
        if (request.getOptions() == null || request.getOptions().isEmpty()) {
            throw new IllegalArgumentException("Les options de réponse sont requises pour les questions de correspondance");
        }
        
        if (request.getMatchingPairs().size() > 8) {
            throw new IllegalArgumentException("Maximum 8 paires de correspondance autorisées");
        }
        
        for (Map<String, Object> pair : request.getMatchingPairs()) {
            if (!pair.containsKey("left") || !pair.containsKey("right")) {
                throw new IllegalArgumentException("Chaque paire doit avoir 'left' et 'right'");
            }
        }
    }
    
    @SuppressWarnings("unchecked")
    private void validateTable(QuestionCreateRequest request) {
        if (request.getTableContent() == null) {
            throw new IllegalArgumentException("Le contenu du tableau est requis");
        }
        
        Map<String, Object> content = request.getTableContent();
        if (!content.containsKey("headers") || !content.containsKey("answer")) {
            throw new IllegalArgumentException("Le tableau doit avoir 'headers' et 'answer'");
        }
        
        List<String> headers = (List<String>) content.get("headers");
        List<String> answers = (List<String>) content.get("answer");
        
        if (headers == null || headers.isEmpty()) {
            throw new IllegalArgumentException("Les en-têtes du tableau sont requis");
        }
        
        if (answers == null || answers.isEmpty()) {
            throw new IllegalArgumentException("Les réponses du tableau sont requises");
        }
        
        if (headers.size() != answers.size()) {
            throw new IllegalArgumentException("Le nombre d'en-têtes doit correspondre au nombre de réponses");
        }
    }
    
    @SuppressWarnings("unchecked")
    private void validateWordPlacement(QuestionCreateRequest request) {
        if (request.getDragDropWords() == null) {
            throw new IllegalArgumentException("Les données de placement de mots sont requises");
        }
        
        Map<String, Object> dragDrop = request.getDragDropWords();
        if (!dragDrop.containsKey("template") || !dragDrop.containsKey("words")) {
            throw new IllegalArgumentException("Le placement de mots doit avoir 'template' et 'words'");
        }
        
        String template = (String) dragDrop.get("template");
        List<String> words = (List<String>) dragDrop.get("words");
        
        if (template == null || template.trim().isEmpty()) {
            throw new IllegalArgumentException("Le template de placement est requis");
        }
        
        if (words == null || words.isEmpty()) {
            throw new IllegalArgumentException("La liste des mots est requise");
        }
    }
    
    public void validateQuestionOrder(List<Integer> orders) {
        if (orders == null || orders.isEmpty()) {
            return;
        }
        
        Set<Integer> uniqueOrders = new HashSet<>(orders);
        if (uniqueOrders.size() != orders.size()) {
            throw new IllegalArgumentException("Les ordres des questions doivent être uniques");
        }
        
        for (Integer order : orders) {
            if (order == null || order < 1) {
                throw new IllegalArgumentException("L'ordre des questions doit être un nombre positif");
            }
        }
    }
}