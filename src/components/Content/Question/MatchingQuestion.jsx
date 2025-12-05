import React from 'react';
import VocabularyHelper from './VocabularyHelper';

const MatchingQuestion = ({ 
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
      <div>
        {showAnswers[question.id] ? (
          <div className={`p-4 bg-green-50 border-l-4 border-green-500 rounded ${showArabic ? 'border-r-4 border-l-0 text-right' : ''}`}>
            <p className="text-green-800 font-medium mb-4">
              {showArabic ? 'الإجابات المقترحة:' : 'Réponses suggérées :'}
            </p>
            <div className="space-y-3">
              {question.matchingPairs.map((pair, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-3 bg-white rounded border ${showArabic ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-1 font-medium text-blue-800 ${showArabic ? 'text-right' : 'text-left'}`}>
                    {showArabic && pair.leftArabic ? pair.leftArabic : pair.left}
                  </div>
                  <div className="text-green-600 font-bold text-lg">→</div>
                  <div className={`flex-1 text-green-700 ${showArabic ? 'text-right' : 'text-left'}`}>
                    {showArabic && pair.rightArabic ? pair.rightArabic : pair.right}
                  </div>
                </div>
              ))}
            </div>
            {showArabic && question.matchingPairs[0].leftArabic && (
              <div className="mt-4 pt-4 border-t border-green-200 text-left">
                <p className="text-green-600 text-sm mb-3">Version française:</p>
                <div className="space-y-2">
                  {question.matchingPairs.map((pair, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-sm text-green-600">
                      <span className="flex-1">{pair.left}</span>
                      <span>→</span>
                      <span className="flex-1">{pair.right}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`text-gray-600 mb-4 ${showArabic ? 'text-right' : 'text-left'}`}>
              <p className="font-medium">
                {showArabic ? 'اربط كل عبارة من العمود الأيسر بالمعنى المقابل في العمود الأيمن:' 
                           : 'Reliez chaque énoncé de la colonne de gauche à sa signification correspondante à droite :'}
              </p>
            </div>
            
            {question.matchingPairs.map((pair, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg ${showArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-start gap-2 flex-1 ${showArabic ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="font-medium text-gray-800" dir="ltr">{String.fromCharCode(97 + idx)})</span>
                  <span className="flex-1">
                    {showArabic && pair.leftArabic ? pair.leftArabic : pair.left}
                  </span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1">
                  <select
                    className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${showArabic ? 'text-right' : 'text-left'}`}
                    value={userAnswers[question.id]?.[idx] || ''}
                    onChange={(e) => {
                      const newAnswers = {...(userAnswers[question.id] || {})};
                      newAnswers[idx] = e.target.value;
                      onAnswerChange(question.id, newAnswers);
                    }}
                    dir={showArabic ? 'rtl' : 'ltr'}
                  >
                    <option value="">{showArabic ? 'اختر الإجابة...' : 'Choisissez une réponse...'}</option>
                    {question.options.map((option, optIdx) => (
                      <option key={optIdx} value={option.id}>
                        {option.id}. {showArabic && option.textArabic ? option.textArabic : option.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
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
export default MatchingQuestion;