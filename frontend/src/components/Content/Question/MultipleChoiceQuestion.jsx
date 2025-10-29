import React from 'react';
import VocabularyHelper from './VocabularyHelper';
import { Check, X } from 'lucide-react';

const MultipleChoiceQuestion = ({ 
  question, 
  showArabic, 
  showAnswers, 
  userAnswers, 
  onAnswerChange,
  showHelper,
  toggleHelper
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        {question.subQuestions.map((subQ, idx) => (
          <div 
            key={subQ.id} 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            {/* Question Text */}
            <div className={`flex items-start gap-2 flex-1 ${showArabic ? 'flex-row-reverse text-right' : ''}`}>
              <span className="font-bold text-blue-600 text-sm sm:text-base flex-shrink-0" dir="ltr">
                {String.fromCharCode(97 + idx)})
              </span>
              <span className="text-gray-700 flex-1 text-sm sm:text-base leading-relaxed">
                {showArabic && subQ.questionArabic ? subQ.questionArabic : subQ.question}
              </span>
            </div>

            {/* Answer Display or Radio Buttons */}
            {showAnswers[question.id] ? (
              <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base ${
                subQ.answer === 'VRAI' || subQ.answer === 'صحيح' 
                  ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                  : 'bg-red-100 text-red-700 border-2 border-red-300'
              } ${showArabic ? 'sm:mr-0' : 'sm:ml-0'}`}>
                {subQ.answer === 'VRAI' || subQ.answer === 'صحيح' ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span>{showArabic && subQ.answerArabic ? subQ.answerArabic : subQ.answer}</span>
              </div>
            ) : (
              <div className={`flex gap-3 sm:gap-4 ${showArabic ? 'flex-row-reverse sm:mr-0' : 'sm:ml-0'}`}>
                {/* VRAI / صحيح Button */}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name={`q${question.id}_${idx}`}
                      value="true"
                      checked={userAnswers[question.id]?.[subQ.id] === true}
                      onChange={() => {
                        const newAnswers = {...(userAnswers[question.id] || {})};
                        newAnswers[subQ.id] = true;
                        onAnswerChange(question.id, newAnswers);
                      }}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 focus:ring-2 focus:ring-green-400 cursor-pointer"
                    />
                  </div>
                  <span className="text-green-600 font-semibold group-hover:text-green-700 transition-colors text-sm sm:text-base">
                    {showArabic ? 'صحيح' : 'VRAI'}
                  </span>
                </label>

                {/* FAUX / خطأ Button */}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name={`q${question.id}_${idx}`}
                      value="false"
                      checked={userAnswers[question.id]?.[subQ.id] === false}
                      onChange={() => {
                        const newAnswers = {...(userAnswers[question.id] || {})};
                        newAnswers[subQ.id] = false;
                        onAnswerChange(question.id, newAnswers);
                      }}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 focus:ring-2 focus:ring-red-400 cursor-pointer"
                    />
                  </div>
                  <span className="text-red-600 font-semibold group-hover:text-red-700 transition-colors text-sm sm:text-base">
                    {showArabic ? 'خطأ' : 'FAUX'}
                  </span>
                </label>
              </div>
            )}
          </div>
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

export default MultipleChoiceQuestion;