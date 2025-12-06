import React from 'react';
import { CheckCircle } from 'lucide-react';
import VocabularyHelper from './VocabularyHelper';

const SingleChoiceQuestion = ({ 
  question, 
  showArabic, 
  showAnswers, 
  userAnswers, 
  onAnswerChange,
  showHelper,
  toggleHelper
}) => {
  // Check if question has multiple correct answers
  const correctAnswers = question.answer ? question.answer.split(' et ') : [];
  const hasMultipleAnswers = correctAnswers.length > 1;
  
  // Get user's selected answers (support both old single and new multiple format)
  const selectedAnswers = userAnswers[question.id] 
    ? (userAnswers[question.id].includes(' et ') 
        ? userAnswers[question.id].split(' et ') 
        : [userAnswers[question.id]])
    : [];
  
  const isCorrectAnswer = (optionId) => correctAnswers.includes(optionId);
  const isSelected = (optionId) => selectedAnswers.includes(optionId);
  
  const handleAnswerToggle = (optionId) => {
    if (hasMultipleAnswers) {
      // Multiple selection mode
      let newAnswers;
      if (isSelected(optionId)) {
        newAnswers = selectedAnswers.filter(id => id !== optionId);
      } else {
        newAnswers = [...selectedAnswers, optionId].sort();
      }
      onAnswerChange(question.id, newAnswers.join(' et '));
    } else {
      // Single selection mode
      onAnswerChange(question.id, optionId);
    }
  };
  
  return (
    <div>
      {hasMultipleAnswers && (
        <p className={`text-xs sm:text-sm text-blue-600 mb-2 sm:mb-3 font-medium px-1 ${showArabic ? 'text-right' : 'text-left'}`} dir={showArabic ? 'rtl' : 'ltr'}>
          ⚠️ {showArabic ? 'عدة إجابات صحيحة - اختر جميع الإجابات الصحيحة' : 'Plusieurs réponses correctes - Sélectionnez toutes les bonnes réponses'}
        </p>
      )}
      
      <div className="space-y-2 sm:space-y-3">
        {question.options.map((option, idx) => (
          <label key={idx} className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
            showAnswers[question.id] && isCorrectAnswer(option.id)
              ? 'bg-green-100 border-2 border-green-500' 
              : 'bg-gray-50 hover:bg-gray-100'
          } ${showArabic ? 'flex-row-reverse' : ''}`}>
            <input
              type={hasMultipleAnswers ? "checkbox" : "radio"}
              name={`q${question.id}`}
              value={option.id}
              checked={isSelected(option.id)}
              onChange={() => handleAnswerToggle(option.id)}
              disabled={showAnswers[question.id]}
              className="text-blue-500 flex-shrink-0"
            />
            <span 
              className={`flex-1 text-sm sm:text-base ${showAnswers[question.id] && isCorrectAnswer(option.id) ? 'font-bold text-green-700' : 'text-gray-700'} ${showArabic ? 'text-right' : 'text-left'}`}
              dir={showArabic ? 'rtl' : 'ltr'}
            >
              <span dir="ltr" className="inline-block">{option.id})</span> {showArabic && option.textArabic ? option.textArabic : option.text}
            </span>
            {showAnswers[question.id] && isCorrectAnswer(option.id) && (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
            )}
          </label>
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
};

export default SingleChoiceQuestion;