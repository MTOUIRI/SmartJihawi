package com.examens.backend.service;

import com.examens.backend.dto.QCM.QCMCountResponse;
import com.examens.backend.dto.QCM.QCMQuestionCreateRequest;
import com.examens.backend.dto.QCM.QCMQuestionResponse;
import com.examens.backend.dto.QCM.QCMQuestionUpdateRequest;
import com.examens.backend.entity.QCMQuestion;
import com.examens.backend.entity.Chapter;
import com.examens.backend.repository.QCMQuestionRepository;
import com.examens.backend.repository.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QCMQuestionService {
    
    @Autowired
    private QCMQuestionRepository qcmQuestionRepository;
    
    @Autowired
    private ChapterRepository chapterRepository;
    
    public List<QCMQuestionResponse> getQuestionsByChapter(Long chapterId) {
        if (!chapterRepository.existsById(chapterId)) {
            throw new RuntimeException("Chapitre non trouvé avec l'ID: " + chapterId);
        }
        
        List<QCMQuestion> questions = qcmQuestionRepository.findByChapterId(chapterId);
        return questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public QCMQuestionResponse getQuestionById(Long questionId) {
        QCMQuestion question = qcmQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question QCM non trouvée avec l'ID: " + questionId));
        return convertToResponse(question);
    }
    
    public QCMCountResponse getQuestionCountByChapter(Long chapterId) {
        if (!chapterRepository.existsById(chapterId)) {
            throw new RuntimeException("Chapitre non trouvé avec l'ID: " + chapterId);
        }
        
        Long count = qcmQuestionRepository.countByChapterId(chapterId);
        return new QCMCountResponse(chapterId, count);
    }
    
    @Transactional
    public QCMQuestionResponse createQuestion(QCMQuestionCreateRequest request) {
        Chapter chapter = chapterRepository.findById(request.getChapterId())
                .orElseThrow(() -> new RuntimeException("Chapitre non trouvé avec l'ID: " + request.getChapterId()));
        
        // Validate options format
        validateOptions(request.getOptions());
        
        QCMQuestion question = new QCMQuestion();
        question.setChapter(chapter);
        question.setQuestion(request.getQuestion());
        question.setQuestionArabic(request.getQuestionArabic());
        question.setOptions(request.getOptions());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setExplanation(request.getExplanation());
        question.setExplanationArabic(request.getExplanationArabic());
        
        question = qcmQuestionRepository.save(question);
        return convertToResponse(question);
    }
    
    @Transactional
    public QCMQuestionResponse updateQuestion(Long questionId, QCMQuestionUpdateRequest request) {
        QCMQuestion question = qcmQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question QCM non trouvée avec l'ID: " + questionId));
        
        // Validate options format
        validateOptions(request.getOptions());
        
        question.setQuestion(request.getQuestion());
        question.setQuestionArabic(request.getQuestionArabic());
        question.setOptions(request.getOptions());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setExplanation(request.getExplanation());
        question.setExplanationArabic(request.getExplanationArabic());
        
        question = qcmQuestionRepository.save(question);
        return convertToResponse(question);
    }
    
    @Transactional
    public void deleteQuestion(Long questionId) {
        if (!qcmQuestionRepository.existsById(questionId)) {
            throw new RuntimeException("Question QCM non trouvée avec l'ID: " + questionId);
        }
        qcmQuestionRepository.deleteById(questionId);
    }
    
    @Transactional
    public void deleteAllQuestionsByChapter(Long chapterId) {
        if (!chapterRepository.existsById(chapterId)) {
            throw new RuntimeException("Chapitre non trouvé avec l'ID: " + chapterId);
        }
        qcmQuestionRepository.deleteByChapterId(chapterId);
    }
    
    private void validateOptions(List<java.util.Map<String, String>> options) {
        if (options == null || options.size() != 4) {
            throw new RuntimeException("Exactement 4 options requises");
        }
        
        // Check that all options have required IDs
        List<String> ids = options.stream()
                .map(opt -> opt.get("id"))
                .collect(Collectors.toList());
        
        if (!ids.containsAll(List.of("a", "b", "c", "d"))) {
            throw new RuntimeException("Les options doivent avoir les IDs: a, b, c, d");
        }
        
        // Check that all options have text
        for (java.util.Map<String, String> option : options) {
            if (option.get("text") == null || option.get("text").trim().isEmpty()) {
                throw new RuntimeException("Toutes les options doivent avoir du texte");
            }
        }
    }
    
    private QCMQuestionResponse convertToResponse(QCMQuestion question) {
        QCMQuestionResponse response = new QCMQuestionResponse();
        response.setId(question.getId());
        response.setChapterId(question.getChapter().getId());
        response.setQuestion(question.getQuestion());
        response.setQuestionArabic(question.getQuestionArabic());
        response.setOptions(question.getOptions());
        response.setCorrectAnswer(question.getCorrectAnswer());
        response.setExplanation(question.getExplanation());
        response.setExplanationArabic(question.getExplanationArabic());
        response.setCreatedAt(question.getCreatedAt());
        response.setUpdatedAt(question.getUpdatedAt());
        return response;
    }
}