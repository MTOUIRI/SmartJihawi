import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const VocabularyHelper = ({ question, showArabic, showAnswers, showHelper, toggleHelper }) => {
  if (!question.helper || showAnswers[question.id]) return null;
  
  const isHelperVisible = showHelper[question.id];
  
  return (
    <div className="mt-3 sm:mt-4 border-t pt-3 sm:pt-4">
      <button
        onClick={() => toggleHelper(question.id)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-3"
      >
        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-medium text-sm sm:text-base">
          {showArabic ? 'مساعدة المفردات' : 'Aide vocabulaire'}
        </span>
        {isHelperVisible ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>
      
      {isHelperVisible && (
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
          <h4 className={`font-medium text-blue-800 mb-3 text-sm sm:text-base ${showArabic ? 'text-right' : 'text-left'}`}>
            {showArabic ? 'مفردات مفيدة' : 'Vocabulaire utile'}
          </h4>
          <div className="space-y-2">
            {question.helper.french.map((frenchWord, idx) => {
              const arabicWord = question.helper.arabic[idx] || '';
              return (
                <div key={idx} className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded border ${showArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="px-2 py-1 sm:px-3 sm:py-2 bg-blue-100 text-blue-800 rounded text-xs sm:text-sm font-medium min-w-0 flex-1 text-center truncate">
                    {frenchWord}
                  </span>
                  <span className="text-blue-600 font-bold text-sm sm:text-base flex-shrink-0">↔</span>
                  <span className="px-2 py-1 sm:px-3 sm:py-2 bg-green-100 text-green-800 rounded text-xs sm:text-sm font-medium min-w-0 flex-1 text-center truncate" dir="rtl">
                    {arabicWord}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const SubQuestionItem = ({ subQuestion, showArabic, showAnswers, questionId, userAnswer, onAnswerChange }) => {
  const currentAnswer = userAnswer?.[subQuestion.id] || '';
  
  // Format points display for Arabic
  const pointsDisplay = showArabic 
    ? `${subQuestion.points > 1 ? 'نقط' : 'نقطة'} ${subQuestion.points}`
    : `${subQuestion.points} ${subQuestion.points > 1 ? 'points' : 'point'}`;
  
  return (
    <div className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-3 sm:p-4 space-y-3">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm sm:text-base">
          {subQuestion.label}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-medium text-gray-800 mb-2 ${showArabic ? 'text-right' : 'text-left'}`} dir={showArabic ? 'rtl' : 'ltr'}>
            <p className="mb-1 text-sm sm:text-base">
              {showArabic && subQuestion.questionArabic ? subQuestion.questionArabic : subQuestion.question}
            </p>
            {showArabic && subQuestion.questionArabic && (
              <p className="text-xs sm:text-sm text-gray-500 border-t pt-1" dir="ltr" style={{ textAlign: 'left' }}>
                {subQuestion.question}
              </p>
            )}
          </div>
          
          <div className={`flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-3 ${showArabic ? 'flex-row-reverse' : ''}`}>
            <span dir={showArabic ? 'rtl' : 'ltr'}>{pointsDisplay}</span>
          </div>

          {showAnswers[questionId] ? (
            <div className={`p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded ${showArabic ? 'border-r-4 border-l-0' : ''}`}>
              <p className={`text-green-800 font-medium mb-2 text-sm sm:text-base ${showArabic ? 'text-right' : 'text-left'}`} dir={showArabic ? 'rtl' : 'ltr'}>
                {showArabic ? 'الإجابة المقترحة' : 'Réponse suggérée'}
              </p>
              <p className={`text-green-700 whitespace-pre-line text-sm sm:text-base ${showArabic ? 'text-right' : 'text-left'}`} dir={showArabic ? 'rtl' : 'ltr'}>
                {showArabic && subQuestion.answerArabic ? subQuestion.answerArabic : subQuestion.answer}
              </p>
              {showArabic && subQuestion.answerArabic && (
                <p className="text-green-600 text-xs sm:text-sm mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-200 whitespace-pre-line" dir="ltr" style={{ textAlign: 'left' }}>
                  {subQuestion.answer}
                </p>
              )}
            </div>
          ) : (
            <textarea
              className={`w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm sm:text-base ${showArabic ? 'text-right' : 'text-left'}`}
              rows={3}
              placeholder={showArabic ? "اكتب إجابتك هنا" : "Écrivez votre réponse ici"}
              value={currentAnswer}
              onChange={(e) => {
                const newAnswer = {...(userAnswer || {})};
                newAnswer[subQuestion.id] = e.target.value;
                onAnswerChange(questionId, newAnswer);
              }}
              dir={showArabic ? 'rtl' : 'ltr'}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TextQuestion = ({ 
  question, 
  showArabic, 
  showAnswers, 
  userAnswers, 
  onAnswerChange,
  showHelper,
  toggleHelper
}) => {
  // Check if this question has sub-questions
  const hasSubQuestions = question.subQuestions && question.subQuestions.length > 0;

  // Calculate completion status for sub-questions
  const getCompletionStatus = () => {
    if (!hasSubQuestions) {
      const answer = userAnswers[question.id];
      return typeof answer === 'string' && answer.trim().length > 0;
    }
    
    const userAnswer = userAnswers[question.id] || {};
    const completedCount = question.subQuestions.filter(subQ => {
      const answer = userAnswer[subQ.id];
      return answer && answer.trim().length > 0;
    }).length;
    
    return {
      completed: completedCount,
      total: question.subQuestions.length,
      isComplete: completedCount === question.subQuestions.length
    };
  };

  const completionStatus = getCompletionStatus();

  // Render sub-questions if they exist
  if (hasSubQuestions) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {/* Progress indicator */}
        {!showAnswers[question.id] && typeof completionStatus === 'object' && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 sm:p-4">
            <div className={`flex items-center justify-between mb-2 ${showArabic ? 'flex-row-reverse' : ''}`}>
              <span className={`text-xs sm:text-sm font-medium ${showArabic ? 'text-right' : 'text-left'}`} dir={showArabic ? 'rtl' : 'ltr'}>
                {showArabic ? 'تقدم الإجابة' : 'Progression des réponses'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-purple-700" dir="ltr">
                {completionStatus.completed} / {completionStatus.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completionStatus.completed / completionStatus.total) * 100}%` }}
              />
            </div>
            {completionStatus.isComplete && (
              <div className={`flex items-center gap-2 mt-2 text-green-600 ${showArabic ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium" dir={showArabic ? 'rtl' : 'ltr'}>
                  {showArabic ? 'اكتملت جميع الإجابات' : 'Toutes les réponses sont complètes'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Sub-questions */}
        <div className="space-y-3 sm:space-y-4">
          {question.subQuestions.map((subQ) => (
            <SubQuestionItem
              key={subQ.id}
              subQuestion={subQ}
              showArabic={showArabic}
              showAnswers={showAnswers}
              questionId={question.id}
              userAnswer={userAnswers[question.id]}
              onAnswerChange={onAnswerChange}
            />
          ))}
        </div>

        <VocabularyHelper
          question={question}
          showArabic={showArabic}
          showAnswers={showAnswers}
          showHelper={showHelper}
          toggleHelper={toggleHelper}
        />
      </div>
    );
  }

  // Regular text question (no sub-questions)
  return (
    <div>
      {showAnswers[question.id] ? (
        <div className={`p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded ${showArabic ? 'border-r-4 border-l-0' : ''}`}>
          <p className={`text-green-800 font-medium text-sm sm:text-base mb-2 ${showArabic ? 'text-right' : 'text-left'}`} dir={showArabic ? 'rtl' : 'ltr'}>
            {showArabic ? 'الإجابة المقترحة' : 'Réponse suggérée'}
          </p>
          <p className={`text-green-700 mt-2 whitespace-pre-line text-sm sm:text-base ${showArabic ? 'text-right' : 'text-left'}`} dir={showArabic ? 'rtl' : 'ltr'}>
            {showArabic && question.answerArabic ? question.answerArabic : question.answer}
          </p>
          {showArabic && question.answerArabic && (
            <p className="text-green-600 text-xs sm:text-sm mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-200 whitespace-pre-line" dir="ltr" style={{ textAlign: 'left' }}>
              {question.answer}
            </p>
          )}
        </div>
      ) : (
        <textarea
          className={`w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base ${showArabic ? 'text-right' : 'text-left'}`}
          rows={question.type === 'essay' ? 6 : 4}
          placeholder={showArabic ? "اكتب إجابتك هنا" : "Écrivez votre réponse ici"}
          value={userAnswers[question.id] || ''}
          onChange={(e) => onAnswerChange(question.id, e.target.value)}
          dir={showArabic ? 'rtl' : 'ltr'}
        />
      )}
      <VocabularyHelper
        question={question}
        showArabic={showArabic}
        showAnswers={showAnswers}
        showHelper={showHelper}
        toggleHelper={toggleHelper}
      />
    </div>
  );
};

export default TextQuestion;