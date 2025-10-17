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
  return (
    <div>
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <label key={idx} className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
            showAnswers[question.id] && option.id === question.answer 
              ? 'bg-green-100 border-2 border-green-500' 
              : 'bg-gray-50 hover:bg-gray-100'
          } ${showArabic ? 'flex-row-reverse' : ''}`}>
            <input
              type="radio"
              name={`q${question.id}`}
              value={option.id}
              checked={userAnswers[question.id] === option.id}
              onChange={() => onAnswerChange(question.id, option.id)}
              disabled={showAnswers[question.id]}
              className="text-blue-500"
            />
            <span className={`flex-1 ${showAnswers[question.id] && option.id === question.answer ? 'font-bold text-green-700' : 'text-gray-700'} ${showArabic ? 'text-right' : 'text-left'}`}>
              {option.id}) {showArabic && option.textArabic ? option.textArabic : option.text}
            </span>
            {showAnswers[question.id] && option.id === question.answer && (
              <CheckCircle className="w-5 h-5 text-green-500" />
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