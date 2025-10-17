import React from 'react';
import VocabularyHelper from './VocabularyHelper';

const SingleChoiceGroupedQuestion = ({ 
  question, 
  showArabic, 
  showAnswers, 
  userAnswers, 
  onAnswerChange,
  showHelper,
  toggleHelper
}) => {
  const handleOptionSelect = (subQuestionId, optionId) => {
    const newAnswers = {...(userAnswers[question.id] || {})};
    newAnswers[subQuestionId] = optionId;
    onAnswerChange(question.id, newAnswers);
  };

  return (
    <div className="space-y-6">
      {question.subQuestions && question.subQuestions.map((subQ, subIndex) => (
        <div key={subQ.id} className="border border-gray-200 rounded-lg p-4">
          <div className={`mb-4 flex items-start gap-2 ${showArabic ? 'flex-row-reverse text-right' : ''}`}>
            <span className="font-semibold text-gray-700" dir="ltr">
              {String.fromCharCode(97 + subIndex)}) 
            </span>
            <span className="text-gray-700 flex-1">
              {showArabic && subQ.questionArabic ? subQ.questionArabic : subQ.question}
            </span>
          </div>

          <div className={`space-y-2 ${showArabic ? 'mr-6' : 'ml-6'}`}>
            {subQ.options && subQ.options.map((option, optIndex) => (
              <div key={optIndex} className={`flex items-start gap-3 ${showArabic ? 'flex-row-reverse' : ''}`}>
                <input
                  type="radio"
                  name={`q${question.id}_sub${subIndex}`}
                  value={option.id}
                  checked={userAnswers[question.id]?.[subQ.id] === option.id}
                  onChange={() => handleOptionSelect(subQ.id, option.id)}
                  disabled={showAnswers[question.id]}
                  className="mt-1 text-blue-600"
                />
                <label className={`flex-1 cursor-pointer ${showArabic ? 'text-right' : 'text-left'}`}>
                  <span className="font-medium text-gray-600" dir="ltr">{option.id})</span>
                  <span className={showArabic ? 'mr-2' : 'ml-2'}>
                    {showArabic && option.textArabic ? option.textArabic : option.text}
                  </span>
                </label>
                {showAnswers[question.id] && subQ.answer === option.id && (
                  <span className="text-green-600 font-semibold">✓</span>
                )}
              </div>
            ))}
          </div>

          {showAnswers[question.id] && (
            <div className={`mt-3 p-3 rounded-lg ${
              userAnswers[question.id]?.[subQ.id] === subQ.answer 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm font-medium ${
                userAnswers[question.id]?.[subQ.id] === subQ.answer 
                  ? 'text-green-800' 
                  : 'text-red-800'
              }`}>
                {userAnswers[question.id]?.[subQ.id] === subQ.answer 
                  ? (showArabic ? 'إجابة صحيحة!' : 'Bonne réponse!')
                  : (showArabic ? `الإجابة الصحيحة: ${subQ.answer}` : `Réponse correcte: ${subQ.answer}`)
                }
              </p>
            </div>
          )}
        </div>
      ))}

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

export default SingleChoiceGroupedQuestion;