import React from 'react';
import VocabularyHelper from './VocabularyHelper';

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
    <div>
      <div className="space-y-4">
        {question.subQuestions.map((subQ, idx) => (
          <div key={subQ.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className={`flex items-start gap-2 flex-1 ${showArabic ? 'flex-row-reverse text-right' : ''}`}>
              <span className="font-medium text-gray-700" dir="ltr">{String.fromCharCode(97 + idx)})</span>
              <span className="text-gray-700 flex-1">
                {showArabic && subQ.questionArabic ? subQ.questionArabic : subQ.question}
              </span>
            </div>
            {showAnswers[question.id] ? (
              <span className={`font-bold ml-4 ${subQ.answer === 'VRAI' || subQ.answer === 'صحيح' ? 'text-green-600' : 'text-red-600'}`}>
                {showArabic && subQ.answerArabic ? subQ.answerArabic : subQ.answer}
              </span>
            ) : (
              <div className={`flex gap-4 ${showArabic ? 'mr-4' : 'ml-4'}`}>
                <label className="flex items-center gap-2 cursor-pointer">
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
                    className="text-green-500"
                  />
                  <span className="text-green-600 font-medium">{showArabic ? 'صحيح' : 'VRAI'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
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
                    className="text-red-500"
                  />
                  <span className="text-red-600 font-medium">{showArabic ? 'خطأ' : 'FAUX'}</span>
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