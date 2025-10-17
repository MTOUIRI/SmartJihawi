package com.examens.backend.service;

import com.examens.backend.dto.Question.BulkQuestionsRequest;
import com.examens.backend.dto.Question.QuestionCreateRequest;
import com.examens.backend.dto.Question.QuestionResponse;
import com.examens.backend.dto.Question.QuestionUpdateRequest;
import com.examens.backend.dto.Question.QuestionsListResponse;
import com.examens.backend.entity.Question;
import com.examens.backend.entity.Exam;
import com.examens.backend.repository.QuestionRepository;
import com.examens.backend.repository.ExamRepository;
import com.examens.backend.util.QuestionValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private ExamRepository examRepository;
    
    @Autowired
    private QuestionValidationUtil validationUtil;
    
    public QuestionsListResponse getQuestionsByExamId(Long examId) {
        if (!examRepository.existsById(examId)) {
            throw new RuntimeException("Examen non trouvé avec l'ID: " + examId);
        }
        
        List<Question> questions = questionRepository.findByExamIdOrderByOrder(examId);
        List<QuestionResponse> questionResponses = questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        Integer totalPoints = questionRepository.sumPointsByExamId(examId);
        
        return new QuestionsListResponse(
            questionResponses,
            questionResponses.size(),
            totalPoints != null ? totalPoints : 0
        );
    }
    
    public QuestionResponse getQuestionById(Long questionId) {
        Question question = questionRepository.findByIdWithExam(questionId)
                .orElseThrow(() -> new RuntimeException("Question non trouvée avec l'ID: " + questionId));
        return convertToResponse(question);
    }
    
    @Transactional
    public QuestionResponse createQuestion(QuestionCreateRequest request) {
        validationUtil.validateQuestionCreate(request);
        
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'ID: " + request.getExamId()));
        
        Question question = new Question();
        mapRequestToEntity(request, question);
        question.setExam(exam);
        
        if (question.getOrder() == null) {
            Integer maxOrder = questionRepository.getMaxOrderByExamId(request.getExamId());
            question.setOrder((maxOrder != null ? maxOrder : 0) + 1);
        }
        
        question = questionRepository.save(question);
        return convertToResponse(question);
    }

    @Transactional
    public List<QuestionResponse> createBulkQuestions(BulkQuestionsRequest request) {
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'ID: " + request.getExamId()));
        
        for (QuestionCreateRequest questionRequest : request.getQuestions()) {
            validationUtil.validateQuestionCreate(questionRequest);
        }
        
        Integer maxOrder = questionRepository.getMaxOrderByExamId(request.getExamId());
        if (maxOrder == null) {
            maxOrder = 0;
        }
        
        List<Question> questions = new ArrayList<>();
        for (int i = 0; i < request.getQuestions().size(); i++) {
            QuestionCreateRequest questionRequest = request.getQuestions().get(i);
            Question question = new Question();
            mapRequestToEntity(questionRequest, question);
            question.setExam(exam);
            
            if (question.getOrder() == null) {
                question.setOrder(maxOrder + i + 1);
            }
            
            questions.add(question);
        }
        
        questions = questionRepository.saveAll(questions);
        return questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public QuestionResponse updateQuestion(Long questionId, QuestionUpdateRequest request) {
        validationUtil.validateQuestionUpdate(request);
        
        Question question = questionRepository.findByIdWithExam(questionId)
                .orElseThrow(() -> new RuntimeException("Question non trouvée avec l'ID: " + questionId));
        
        mapUpdateRequestToEntity(request, question);
        question = questionRepository.save(question);
        return convertToResponse(question);
    }
    
    @Transactional
    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question non trouvée avec l'ID: " + questionId));
        
        Long examId = question.getExam().getId();
        Integer deletedOrder = question.getOrder();
        
        questionRepository.delete(question);
        
        if (deletedOrder != null) {
            List<Question> questionsToReorder = questionRepository.findQuestionsAfterOrder(examId, deletedOrder);
            for (Question q : questionsToReorder) {
                q.setOrder(q.getOrder() - 1);
            }
            questionRepository.saveAll(questionsToReorder);
        }
    }
    
    @Transactional
    public void deleteAllQuestionsByExamId(Long examId) {
        questionRepository.deleteByExamId(examId);
    }
    
    @Transactional
    public List<QuestionResponse> reorderQuestions(Long examId, List<Long> questionIds) {
        if (!examRepository.existsById(examId)) {
            throw new RuntimeException("Examen non trouvé avec l'ID: " + examId);
        }
        
        List<Question> questions = questionRepository.findByExamIdOrderByOrder(examId);
        
        List<Long> existingIds = questions.stream().map(Question::getId).collect(Collectors.toList());
        for (Long questionId : questionIds) {
            if (!existingIds.contains(questionId)) {
                throw new RuntimeException("Question avec l'ID " + questionId + " n'appartient pas à cet examen");
            }
        }
        
        for (int i = 0; i < questionIds.size(); i++) {
            Long questionId = questionIds.get(i);
            Question question = questions.stream()
                    .filter(q -> q.getId().equals(questionId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Question non trouvée avec l'ID: " + questionId));
            question.setOrder(i + 1);
        }
        
        questions = questionRepository.saveAll(questions);
        return questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<QuestionResponse> getQuestionsByBookId(String bookId) {
        List<Question> questions = questionRepository.findByExamBookId(bookId);
        return questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private void mapRequestToEntity(QuestionCreateRequest request, Question question) {
        question.setType(request.getType());
        question.setQuestion(request.getQuestion());
        question.setQuestionArabic(request.getQuestionArabic());
        question.setInstruction(request.getInstruction());
        question.setInstructionArabic(request.getInstructionArabic());
        question.setPoints(request.getPoints());
        question.setOrder(request.getOrder());
        question.setOptions(request.getOptions());
        question.setSubQuestions(request.getSubQuestions());
        question.setMatchingPairs(request.getMatchingPairs());
        question.setTableContent(request.getTableContent());
        question.setDragDropWords(request.getDragDropWords());
        question.setHelper(request.getHelper());
        question.setAnswer(request.getAnswer());
        question.setAnswerArabic(request.getAnswerArabic());
    }
    
    private void mapUpdateRequestToEntity(QuestionUpdateRequest request, Question question) {
        question.setType(request.getType());
        question.setQuestion(request.getQuestion());
        question.setQuestionArabic(request.getQuestionArabic());
        question.setInstruction(request.getInstruction());
        question.setInstructionArabic(request.getInstructionArabic());
        question.setPoints(request.getPoints());
        question.setOrder(request.getOrder());
        question.setOptions(request.getOptions());
        question.setSubQuestions(request.getSubQuestions());
        question.setMatchingPairs(request.getMatchingPairs());
        question.setTableContent(request.getTableContent());
        question.setDragDropWords(request.getDragDropWords());
        question.setHelper(request.getHelper());
        question.setAnswer(request.getAnswer());
        question.setAnswerArabic(request.getAnswerArabic());
    }
    
    private QuestionResponse convertToResponse(Question question) {
        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setExamId(question.getExam().getId());
        response.setType(question.getType());
        response.setQuestion(question.getQuestion());
        response.setQuestionArabic(question.getQuestionArabic());
        response.setInstruction(question.getInstruction());
        response.setInstructionArabic(question.getInstructionArabic());
        response.setPoints(question.getPoints());
        response.setOrder(question.getOrder());
        response.setOptions(question.getOptions());
        response.setSubQuestions(question.getSubQuestions());
        response.setMatchingPairs(question.getMatchingPairs());
        response.setTableContent(question.getTableContent());
        response.setDragDropWords(question.getDragDropWords());
        response.setHelper(question.getHelper());
        response.setAnswer(question.getAnswer());
        response.setAnswerArabic(question.getAnswerArabic());
        response.setCreatedAt(question.getCreatedAt());
        response.setUpdatedAt(question.getUpdatedAt());
        return response;
    }
}