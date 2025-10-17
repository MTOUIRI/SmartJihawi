import React from 'react';
import VocabularyHelper from './VocabularyHelper';

const TrueFalseWithJustificationQuestion = ({ 
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
      <div className="space-y-6">
        {question.subQuestions.map((subQ, idx) => (
          <div key={subQ.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            {/* Question text */}
            <div className={`text-gray-700 mb-4 ${showArabic ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-start gap-2 ${showArabic ? 'flex-row-reverse' : ''}`}>
                <span className="font-medium" dir="ltr">{String.fromCharCode(97 + idx)})</span>
                <span className={showArabic ? 'font-arabic' : ''}>
                  {showArabic && subQ.questionArabic ? subQ.questionArabic : subQ.question}
                </span>
              </div>
            </div>
            
            {/* Show both languages when Arabic is enabled */}
            {showArabic && subQ.questionArabic && (
              <div className="text-sm text-gray-500 mb-4 text-left border-t pt-2" dir="ltr">
                {subQ.question}
              </div>
            )}
            
            {/* True/False options */}
            <div className={`flex gap-6 mb-4 ${showArabic ? 'justify-end' : 'justify-start'}`}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q${question.id}_${idx}`}
                  value="true"
                  checked={userAnswers[question.id]?.[subQ.id]?.answer === true}
                  onChange={() => {
                    const newAnswers = {...(userAnswers[question.id] || {})};
                    newAnswers[subQ.id] = {
                      ...newAnswers[subQ.id],
                      answer: true
                    };
                    onAnswerChange(question.id, newAnswers);
                  }}
                  className="text-green-500"
                  disabled={showAnswers[question.id]}
                />
                <span className="text-green-600 font-medium">{showArabic ? 'صحيح' : 'VRAI'}</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q${question.id}_${idx}`}
                  value="false"
                  checked={userAnswers[question.id]?.[subQ.id]?.answer === false}
                  onChange={() => {
                    const newAnswers = {...(userAnswers[question.id] || {})};
                    newAnswers[subQ.id] = {
                      ...newAnswers[subQ.id],
                      answer: false
                    };
                    onAnswerChange(question.id, newAnswers);
                  }}
                  className="text-red-500"
                  disabled={showAnswers[question.id]}
                />
                <span className="text-red-600 font-medium">{showArabic ? 'خطأ' : 'FAUX'}</span>
              </label>
            </div>

            {/* Justification text area */}
            <div className="mt-4">
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${showArabic ? 'text-right' : 'text-left'}`}>
                {showArabic ? 'التبرير:' : 'Justification:'}
              </label>
              
              {showAnswers[question.id] ? (
                <div className={`p-4 bg-blue-50 border border-blue-200 rounded-lg`}>
                  <div className={`mb-2 ${showArabic ? 'text-right' : 'text-left'}`}>
                    <span className="font-medium text-blue-800">
                      {showArabic ? 'الإجابة الصحيحة:' : 'Réponse correcte:'} 
                    </span>
                    <span className={`${showArabic ? 'mr-2' : 'ml-2'} font-bold ${
                      subQ.answer === 'VRAI' || subQ.answer === 'صحيح' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {showArabic && subQ.answerArabic ? subQ.answerArabic : subQ.answer}
                    </span>
                  </div>
                  <div className={showArabic ? 'text-right' : 'text-left'}>
                    <span className="font-medium text-blue-800">
                      {showArabic ? 'التبرير:' : 'Justification:'} 
                    </span>
                    <p className="mt-1 text-blue-700 italic">
                      "{showArabic && subQ.justificationArabic ? subQ.justificationArabic : subQ.justification}"
                    </p>
                  </div>
                </div>
              ) : (
                <textarea
                  value={userAnswers[question.id]?.[subQ.id]?.justification || ''}
                  onChange={(e) => {
                    const newAnswers = {...(userAnswers[question.id] || {})};
                    newAnswers[subQ.id] = {
                      ...newAnswers[subQ.id],
                      justification: e.target.value
                    };
                    onAnswerChange(question.id, newAnswers);
                  }}
                  placeholder={showArabic ? 'اكتب تبريرك هنا...' : 'Écrivez votre justification ici...'}
                  className={`w-full p-3 border border-gray-300 rounded-lg resize-vertical min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    showArabic ? 'text-right' : 'text-left'
                  }`}
                  dir={showArabic ? 'rtl' : 'ltr'}
                />
              )}
            </div>
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

export default TrueFalseWithJustificationQuestion;