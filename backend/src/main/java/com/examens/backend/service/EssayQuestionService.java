package com.examens.backend.service;

import com.examens.backend.dto.Essay.EssayQuestionCreateRequest;
import com.examens.backend.dto.Essay.EssayQuestionResponse;
import com.examens.backend.dto.Essay.EssayQuestionUpdateRequest;
import com.examens.backend.dto.Essay.EssayQuestionsListResponse;
import com.examens.backend.entity.EssayQuestion;
import com.examens.backend.entity.Exam;
import com.examens.backend.repository.EssayQuestionRepository;
import com.examens.backend.repository.ExamRepository;
import com.examens.backend.util.EssayQuestionValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EssayQuestionService {
    
    @Autowired
    private EssayQuestionRepository essayQuestionRepository;
    
    @Autowired
    private ExamRepository examRepository;
    
    @Autowired
    private EssayQuestionValidationUtil validationUtil;
    
    public EssayQuestionsListResponse getEssayQuestionsByExamId(Long examId) {
        if (!examRepository.existsById(examId)) {
            throw new RuntimeException("Examen non trouvé avec l'ID: " + examId);
        }
        
        List<EssayQuestion> questions = essayQuestionRepository.findByExamIdOrderByOrder(examId);
        List<EssayQuestionResponse> questionResponses = questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        Integer totalPoints = essayQuestionRepository.sumPointsByExamId(examId);
        
        return new EssayQuestionsListResponse(
            questionResponses,
            questionResponses.size(),
            totalPoints != null ? totalPoints : 0
        );
    }
    
    public EssayQuestionResponse getEssayQuestionById(Long questionId) {
        EssayQuestion question = essayQuestionRepository.findByIdWithExam(questionId)
                .orElseThrow(() -> new RuntimeException("Question d'expression non trouvée avec l'ID: " + questionId));
        return convertToResponse(question);
    }
    
    @Transactional
    public EssayQuestionResponse createEssayQuestion(EssayQuestionCreateRequest request) {
        validationUtil.validateEssayQuestionCreate(request);
        
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'ID: " + request.getExamId()));
        
        EssayQuestion question = new EssayQuestion();
        mapRequestToEntity(request, question);
        question.setExam(exam);
        
        if (question.getOrder() == null) {
            Integer maxOrder = essayQuestionRepository.getMaxOrderByExamId(request.getExamId());
            question.setOrder((maxOrder != null ? maxOrder : 0) + 1);
        }
        
        question = essayQuestionRepository.save(question);
        return convertToResponse(question);
    }
    
    @Transactional
    public EssayQuestionResponse updateEssayQuestion(Long questionId, EssayQuestionUpdateRequest request) {
        validationUtil.validateEssayQuestionUpdate(request);
        
        EssayQuestion question = essayQuestionRepository.findByIdWithExam(questionId)
                .orElseThrow(() -> new RuntimeException("Question d'expression non trouvée avec l'ID: " + questionId));
        
        mapUpdateRequestToEntity(request, question);
        question = essayQuestionRepository.save(question);
        return convertToResponse(question);
    }
    
    @Transactional
    public void deleteEssayQuestion(Long questionId) {
        EssayQuestion question = essayQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question d'expression non trouvée avec l'ID: " + questionId));
        
        Long examId = question.getExam().getId();
        Integer deletedOrder = question.getOrder();
        
        essayQuestionRepository.delete(question);
        
        if (deletedOrder != null) {
            List<EssayQuestion> questionsToReorder = essayQuestionRepository.findQuestionsAfterOrder(examId, deletedOrder);
            for (EssayQuestion q : questionsToReorder) {
                q.setOrder(q.getOrder() - 1);
            }
            essayQuestionRepository.saveAll(questionsToReorder);
        }
    }
    
    @Transactional
    public void deleteAllEssayQuestionsByExamId(Long examId) {
        essayQuestionRepository.deleteByExamId(examId);
    }
    
    @Transactional
    public List<EssayQuestionResponse> reorderEssayQuestions(Long examId, List<Long> questionIds) {
        if (!examRepository.existsById(examId)) {
            throw new RuntimeException("Examen non trouvé avec l'ID: " + examId);
        }
        
        List<EssayQuestion> questions = essayQuestionRepository.findByExamIdOrderByOrder(examId);
        
        List<Long> existingIds = questions.stream().map(EssayQuestion::getId).collect(Collectors.toList());
        for (Long questionId : questionIds) {
            if (!existingIds.contains(questionId)) {
                throw new RuntimeException("Question avec l'ID " + questionId + " n'appartient pas à cet examen");
            }
        }
        
        for (int i = 0; i < questionIds.size(); i++) {
            Long questionId = questionIds.get(i);
            EssayQuestion question = questions.stream()
                    .filter(q -> q.getId().equals(questionId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Question non trouvée avec l'ID: " + questionId));
            question.setOrder(i + 1);
        }
        
        questions = essayQuestionRepository.saveAll(questions);
        return questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<EssayQuestionResponse> getEssayQuestionsByBookId(String bookId) {
        List<EssayQuestion> questions = essayQuestionRepository.findByExamBookId(bookId);
        return questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private void mapRequestToEntity(EssayQuestionCreateRequest request, EssayQuestion question) {
        question.setType(request.getType());
        // NEW: Title fields
        question.setTitle(request.getTitle());
        question.setTitleArabic(request.getTitleArabic());
        question.setQuestion(request.getQuestion());
        question.setQuestionArabic(request.getQuestionArabic());
        question.setPoints(request.getPoints());
        question.setOrder(request.getOrder());
        question.setProgressivePhrases(request.getProgressivePhrases());
        question.setHelper(request.getHelper());
        question.setAnswer(request.getAnswer());
        question.setAnswerArabic(request.getAnswerArabic());
        question.setSubTitle(request.getSubTitle());
        question.setSubTitleArabic(request.getSubTitleArabic());
        question.setPrompt(request.getPrompt());
        question.setPromptArabic(request.getPromptArabic());
        question.setCriteria(request.getCriteria());
    }
    
    private void mapUpdateRequestToEntity(EssayQuestionUpdateRequest request, EssayQuestion question) {
        question.setType(request.getType());
        // NEW: Title fields
        question.setTitle(request.getTitle());
        question.setTitleArabic(request.getTitleArabic());
        question.setQuestion(request.getQuestion());
        question.setQuestionArabic(request.getQuestionArabic());
        question.setPoints(request.getPoints());
        question.setOrder(request.getOrder());
        question.setProgressivePhrases(request.getProgressivePhrases());
        question.setHelper(request.getHelper());
        question.setAnswer(request.getAnswer());
        question.setAnswerArabic(request.getAnswerArabic());
        question.setSubTitle(request.getSubTitle());
        question.setSubTitleArabic(request.getSubTitleArabic());
        question.setPrompt(request.getPrompt());
        question.setPromptArabic(request.getPromptArabic());
        question.setCriteria(request.getCriteria());
    }
    
    private EssayQuestionResponse convertToResponse(EssayQuestion question) {
        EssayQuestionResponse response = new EssayQuestionResponse();
        response.setId(question.getId());
        response.setExamId(question.getExam().getId());
        response.setType(question.getType());
        // NEW: Title fields
        response.setTitle(question.getTitle());
        response.setTitleArabic(question.getTitleArabic());
        response.setQuestion(question.getQuestion());
        response.setQuestionArabic(question.getQuestionArabic());
        response.setPoints(question.getPoints());
        response.setOrder(question.getOrder());
        response.setProgressivePhrases(question.getProgressivePhrases());
        response.setHelper(question.getHelper());
        response.setAnswer(question.getAnswer());
        response.setAnswerArabic(question.getAnswerArabic());
        response.setSubTitle(question.getSubTitle());
        response.setSubTitleArabic(question.getSubTitleArabic());
        response.setPrompt(question.getPrompt());
        response.setPromptArabic(question.getPromptArabic());
        response.setCriteria(question.getCriteria());
        response.setCreatedAt(question.getCreatedAt());
        response.setUpdatedAt(question.getUpdatedAt());
        return response;
    }
}