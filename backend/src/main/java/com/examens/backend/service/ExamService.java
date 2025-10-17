package com.examens.backend.service;

import com.examens.backend.dto.Exam.ExamCreateRequest;
import com.examens.backend.dto.Exam.ExamResponse;
import com.examens.backend.dto.Exam.ExamUpdateRequest;
import com.examens.backend.dto.Exam.SourceChapterRequest;
import com.examens.backend.dto.Exam.SourceChapterResponse;
import com.examens.backend.dto.Exam.TextExtractRequest;
import com.examens.backend.dto.Exam.TextExtractResponse;
import com.examens.backend.dto.Question.QuestionResponse;
import com.examens.backend.entity.Exam;
import com.examens.backend.entity.TextExtract;
import com.examens.backend.entity.Chapter;
import com.examens.backend.entity.Question;
import com.examens.backend.entity.EssayQuestion;
import com.examens.backend.repository.ExamRepository;
import com.examens.backend.repository.TextExtractRepository;
import com.examens.backend.repository.ChapterRepository;
import com.examens.backend.repository.QuestionRepository;
import com.examens.backend.repository.EssayQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExamService {
    
    @Autowired
    private ExamRepository examRepository;
    
    @Autowired
    private TextExtractRepository textExtractRepository;
    
    @Autowired
    private ChapterRepository chapterRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private EssayQuestionRepository essayQuestionRepository;
    
    // Book titles mapping
    private static final Map<String, String> BOOK_TITLES = Map.of(
        "dernier-jour", "Le Dernier Jour d'un Condamné",
        "antigone", "Antigone", 
        "boite-merveilles", "La Boîte à Merveilles"
    );

    public List<ExamResponse> getAllExams() {
    List<Exam> exams = examRepository.findAll();
    return exams.stream()
        .map(this::convertToResponse)
        .collect(Collectors.toList());
}
    
    public List<ExamResponse> getAllExamsByBook(String bookId) {
        List<Exam> exams = examRepository.findByBookIdWithTextExtract(bookId);
        return exams.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public ExamResponse getExamById(Long examId) {
        Exam exam = examRepository.findByIdWithTextExtract(examId)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'ID: " + examId));
        return convertToResponse(exam);
    }
    
    // New method to get complete exam with questions and essay questions
    public ExamWithQuestionsResponse getCompleteExamById(Long examId) {
        Exam exam = examRepository.findByIdWithTextExtract(examId)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'ID: " + examId));
        
        List<Question> questions = questionRepository.findByExamIdOrderByOrder(examId);
        List<EssayQuestion> essayQuestions = essayQuestionRepository.findByExamIdOrderByOrder(examId);
        
        // Combine both question types into a unified response list
        List<QuestionResponse> allQuestions = new ArrayList<>();
        allQuestions.addAll(questions.stream()
                .map(this::convertQuestionToResponse)
                .collect(Collectors.toList()));
        allQuestions.addAll(essayQuestions.stream()
                .map(this::convertEssayQuestionToResponse)
                .collect(Collectors.toList()));
        
        // Calculate total points from both question types
        int regularPoints = questions.stream().mapToInt(Question::getPoints).sum();
        int essayPoints = essayQuestions.stream().mapToInt(EssayQuestion::getPoints).sum();
        
        ExamWithQuestionsResponse response = new ExamWithQuestionsResponse();
        response.setExam(convertToResponse(exam));
        response.setQuestions(allQuestions);
        response.setTotalQuestions(questions.size() + essayQuestions.size());
        response.setTotalPoints(regularPoints + essayPoints);
        
        return response;
    }
    
    @Transactional
    public ExamResponse createExam(ExamCreateRequest request) {
        // Check for duplicate
        if (examRepository.existsByBookIdAndTitleAndYear(request.getBookId(), request.getTitle(), request.getYear())) {
            throw new RuntimeException("Un examen avec ce titre existe déjà pour cette année et ce livre");
        }
        
        // Create exam entity
        Exam exam = new Exam();
        exam.setBookId(request.getBookId());
        exam.setTitle(request.getTitle());
        exam.setTitleArabic(request.getTitleArabic());
        exam.setYear(request.getYear());
        exam.setRegion(request.getRegion());
        exam.setSubject(request.getSubject());
        exam.setSubjectArabic(request.getSubjectArabic());
        exam.setPoints(request.getPoints());
        exam.setDuration(request.getDuration());
        
        // Save exam first to get ID
        exam = examRepository.save(exam);
        
        // Create and save text extract
        TextExtract textExtract = createTextExtract(exam, request.getTextExtract());
        exam.setTextExtract(textExtract);
        
        return convertToResponse(exam);
    }
    
    @Transactional
    public ExamResponse updateExam(Long examId, ExamUpdateRequest request) {
        Exam exam = examRepository.findByIdWithTextExtract(examId)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'ID: " + examId));
        
        // Update exam fields
        exam.setTitle(request.getTitle());
        exam.setTitleArabic(request.getTitleArabic());
        exam.setYear(request.getYear());
        exam.setRegion(request.getRegion());
        exam.setSubject(request.getSubject());
        exam.setSubjectArabic(request.getSubjectArabic());
        exam.setPoints(request.getPoints());
        exam.setDuration(request.getDuration());
        
        // Update text extract
        if (exam.getTextExtract() != null) {
            updateTextExtract(exam.getTextExtract(), request.getTextExtract());
        } else {
            TextExtract textExtract = createTextExtract(exam, request.getTextExtract());
            exam.setTextExtract(textExtract);
        }
        
        exam = examRepository.save(exam);
        return convertToResponse(exam);
    }
    
    @Transactional
    public void deleteExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'ID: " + examId));
        
        // Questions and essay questions will be deleted automatically due to CASCADE
        examRepository.delete(exam);
    }
    
    // New method to get exam statistics (including both question types)
    public ExamStatisticsResponse getExamStatistics(Long examId) {
        if (!examRepository.existsById(examId)) {
            throw new RuntimeException("Examen non trouvé avec l'ID: " + examId);
        }
        
        Long totalQuestions = questionRepository.countByExamId(examId);
        Long totalEssayQuestions = essayQuestionRepository.countByExamId(examId);
        
        Integer regularPoints = questionRepository.sumPointsByExamId(examId);
        Integer essayPoints = essayQuestionRepository.sumPointsByExamId(examId);
        
        // Count questions by type (regular questions)
        Map<String, Long> questionsByType = questionRepository.findByExamIdOrderByOrder(examId)
                .stream()
                .collect(Collectors.groupingBy(Question::getType, Collectors.counting()));
        
        // Count essay questions by type
        Map<String, Long> essayQuestionsByType = essayQuestionRepository.findByExamIdOrderByOrder(examId)
                .stream()
                .collect(Collectors.groupingBy(EssayQuestion::getType, Collectors.counting()));
        
        // Merge both maps
        questionsByType.putAll(essayQuestionsByType);
        
        ExamStatisticsResponse stats = new ExamStatisticsResponse();
        stats.setExamId(examId);
        stats.setTotalPoints((regularPoints != null ? regularPoints : 0) + (essayPoints != null ? essayPoints : 0));
        stats.setTotalPoints((regularPoints != null ? regularPoints : 0) + (essayPoints != null ? essayPoints : 0));
        stats.setQuestionsByType(questionsByType);
        
        return stats;
    }
    
    private TextExtract createTextExtract(Exam exam, TextExtractRequest request) {
        TextExtract textExtract = new TextExtract();
        textExtract.setExam(exam);
        textExtract.setContent(request.getContent());
        
        // Handle source chapter if provided
        if (request.getSourceChapter() != null) {
            setSourceChapterData(textExtract, request.getSourceChapter());
        }
        
        return textExtractRepository.save(textExtract);
    }
    
    private void updateTextExtract(TextExtract textExtract, TextExtractRequest request) {
        textExtract.setContent(request.getContent());
        
        // Clear existing chapter data
        clearSourceChapterData(textExtract);
        
        // Set new source chapter if provided
        if (request.getSourceChapter() != null) {
            setSourceChapterData(textExtract, request.getSourceChapter());
        }
        
        textExtractRepository.save(textExtract);
    }
    
    private void setSourceChapterData(TextExtract textExtract, SourceChapterRequest sourceChapter) {
        // If referencing existing chapter
        if (sourceChapter.getChapterId() != null) {
            Chapter chapter = chapterRepository.findById(sourceChapter.getChapterId())
                    .orElseThrow(() -> new RuntimeException("Chapitre non trouvé avec l'ID: " + sourceChapter.getChapterId()));
            
            textExtract.setChapterRef(chapter);
            textExtract.setSourceChapterId(chapter.getId());
            textExtract.setChapterNumber(chapter.getChapterNumber());
            textExtract.setChapterTitle(chapter.getTitle());
            textExtract.setVideoUrl(chapter.getVideoUrl());
        } else {
            // Use provided chapter details directly
            textExtract.setChapterNumber(sourceChapter.getChapterNumber());
            textExtract.setChapterTitle(sourceChapter.getChapterTitle());
            textExtract.setChapterTitleArabic(sourceChapter.getChapterTitleArabic());
            textExtract.setVideoUrl(sourceChapter.getVideoUrl());
        }
        
        textExtract.setTimeStart(sourceChapter.getTimeStart());
        textExtract.setTimeEnd(sourceChapter.getTimeEnd());
    }
    
    private void clearSourceChapterData(TextExtract textExtract) {
        textExtract.setChapterRef(null);
        textExtract.setSourceChapterId(null);
        textExtract.setChapterNumber(null);
        textExtract.setChapterTitle(null);
        textExtract.setChapterTitleArabic(null);
        textExtract.setVideoUrl(null);
        textExtract.setTimeStart(null);
        textExtract.setTimeEnd(null);
    }
    
    private ExamResponse convertToResponse(Exam exam) {
        ExamResponse response = new ExamResponse();
        response.setId(exam.getId());
        response.setBookId(exam.getBookId());
        response.setTitle(exam.getTitle());
        response.setTitleArabic(exam.getTitleArabic());
        response.setYear(exam.getYear());
        response.setRegion(exam.getRegion());
        response.setSubject(exam.getSubject());
        response.setSubjectArabic(exam.getSubjectArabic());
        response.setPoints(exam.getPoints());
        response.setDuration(exam.getDuration());
        response.setCreatedAt(exam.getCreatedAt());
        response.setUpdatedAt(exam.getUpdatedAt());
        
        // Convert text extract if present
        if (exam.getTextExtract() != null) {
            response.setTextExtract(convertTextExtractToResponse(exam.getTextExtract()));
        }
        
        return response;
    }
    
    private TextExtractResponse convertTextExtractToResponse(TextExtract textExtract) {
        TextExtractResponse response = new TextExtractResponse();
        response.setId(textExtract.getId());
        response.setContent(textExtract.getContent());
        
        // Convert source chapter if present
        if (hasSourceChapterData(textExtract)) {
            response.setSourceChapter(convertSourceChapterToResponse(textExtract));
        }
        
        return response;
    }
    
    private boolean hasSourceChapterData(TextExtract textExtract) {
        return textExtract.getChapterNumber() != null || 
               textExtract.getSourceChapterId() != null ||
               textExtract.getChapterTitle() != null;
    }
    
    private SourceChapterResponse convertSourceChapterToResponse(TextExtract textExtract) {
        SourceChapterResponse response = new SourceChapterResponse();
        response.setChapterId(textExtract.getSourceChapterId());
        response.setChapterNumber(textExtract.getChapterNumber());
        response.setChapterTitle(textExtract.getChapterTitle());
        response.setChapterTitleArabic(textExtract.getChapterTitleArabic());
        response.setVideoUrl(textExtract.getVideoUrl());
        response.setTimeStart(textExtract.getTimeStart());
        response.setTimeEnd(textExtract.getTimeEnd());
        
        // Set book title from the exam's bookId
        if (textExtract.getExam() != null) {
            response.setBookTitle(BOOK_TITLES.get(textExtract.getExam().getBookId()));
        }
        
        return response;
    }
    
    // Convert regular Question to QuestionResponse
    private QuestionResponse convertQuestionToResponse(Question question) {
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
    
    // Convert EssayQuestion to QuestionResponse (unified format)
    private QuestionResponse convertEssayQuestionToResponse(EssayQuestion essayQuestion) {
        QuestionResponse response = new QuestionResponse();
        response.setId(essayQuestion.getId());
        response.setExamId(essayQuestion.getExam().getId());
        response.setType(essayQuestion.getType());
        response.setQuestion(essayQuestion.getQuestion());
        response.setQuestionArabic(essayQuestion.getQuestionArabic());
        response.setPoints(essayQuestion.getPoints());
        response.setOrder(essayQuestion.getOrder());
        response.setHelper(essayQuestion.getHelper());
        response.setAnswer(essayQuestion.getAnswer());
        response.setAnswerArabic(essayQuestion.getAnswerArabic());
        // Essay-specific fields (these need to exist in QuestionResponse for backwards compatibility)
        // If QuestionResponse doesn't have these fields, you may need to add them or create a separate method
        response.setCreatedAt(essayQuestion.getCreatedAt());
        response.setUpdatedAt(essayQuestion.getUpdatedAt());
        return response;
    }
}

// Additional DTOs for new functionality
@lombok.Data
@lombok.NoArgsConstructor 
@lombok.AllArgsConstructor
class ExamWithQuestionsResponse {
    private ExamResponse exam;
    private List<QuestionResponse> questions;
    private Integer totalQuestions;
    private Integer totalPoints;
}

@lombok.Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor  
class ExamStatisticsResponse {
    private Long examId;
    private Integer totalQuestions;
    private Integer totalPoints;
    private Map<String, Long> questionsByType;
}