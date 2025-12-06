import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const VocabularyHelper = ({ question, showArabic, showAnswers, showHelper, toggleHelper }) => {
  // Don't show if no helper or if answers are shown
  if (!question.helper || showAnswers[question.id]) return null;
  
  // Check if helper has actual content
  const hasFrenchWords = question.helper.french && question.helper.french.length > 0;
  const hasArabicWords = question.helper.arabic && question.helper.arabic.length > 0;
  
  // Don't show if helper arrays are empty
  if (!hasFrenchWords && !hasArabicWords) return null;
  
  const isHelperVisible = showHelper[question.id];
  
  return (
    <div className="mt-4 border-t pt-4">
      <button
        onClick={() => toggleHelper(question.id)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-3"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="font-medium">
          {showArabic ? 'مساعدة المفردات' : 'Aide vocabulaire'}
        </span>
        {isHelperVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isHelperVisible && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className={`font-medium text-blue-800 mb-3 ${showArabic ? 'text-right' : 'text-left'}`}>
            {showArabic ? 'مفردات مفيدة:' : 'Vocabulaire utile :'}
          </h4>
          <div className="space-y-2">
            {question.helper.french.map((frenchWord, idx) => {
              const arabicWord = question.helper.arabic[idx] || '';
              return (
                <div key={idx} className={`flex items-center gap-3 p-2 bg-white rounded border ${showArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium min-w-0 flex-1 text-center">
                    {frenchWord}
                  </span>
                  <span className="text-blue-600 font-bold">↔</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium min-w-0 flex-1 text-center" dir="rtl">
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

export default VocabularyHelper;