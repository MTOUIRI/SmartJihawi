import React from 'react';
import { HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';

const VocabularyHelper = ({
  question,
  showArabic,
  showHelper,
  toggleHelper,
  phraseIndex = null,
  isProgressive = false
}) => {
  // Don't show if no helper data
  if (!question.helper) return null;

  // For progressive phrases, get phrase-specific helper or fall back to global
  let helperData = question.helper;
  let helperKey = question.id;
  let titleSuffix = '';

  if (isProgressive && phraseIndex !== null) {
    const currentPhrase = question.progressivePhrases[phraseIndex];
    if (currentPhrase?.helper) {
      helperData = currentPhrase.helper;
    }
    helperKey = `${question.id}-phrase-${phraseIndex}`;
    titleSuffix = ` - ${showArabic ? `الجملة ${phraseIndex + 1}` : `Phrase ${phraseIndex + 1}`}`;
  }

  const isHelperVisible = showHelper && showHelper[helperKey];

  return (
    <div className="mt-4 border-t pt-4">
      <button
        onClick={() => toggleHelper && toggleHelper(helperKey)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-3"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="font-medium">
          {showArabic ? 'مساعدة المفردات' : 'Aide vocabulaire'}{titleSuffix}
        </span>
        {isHelperVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isHelperVisible && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className={`font-medium text-blue-800 mb-3 ${showArabic ? 'text-right' : 'text-left'}`}>
            {showArabic ? 'مفردات مفيدة:' : 'Vocabulaire utile :'}
          </h4>
          
          {/* Show phrase description if available */}
          {isProgressive && phraseIndex !== null && question.progressivePhrases[phraseIndex]?.description && (
            <div className={`mb-3 p-2 bg-indigo-100 rounded text-sm ${showArabic ? 'text-right' : 'text-left'}`}>
              <span className="font-medium text-indigo-800">
                {showArabic ? 'الهدف:' : 'Objectif:'} 
              </span>
              <span className="text-indigo-700 ml-2">
                {showArabic && question.progressivePhrases[phraseIndex].descriptionArabic 
                  ? question.progressivePhrases[phraseIndex].descriptionArabic 
                  : question.progressivePhrases[phraseIndex].description}
              </span>
            </div>
          )}
          
          <div className="space-y-2">
            {helperData.french && helperData.french.map((frenchWord, idx) => {
              const arabicWord = helperData.arabic?.[idx] || '';
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
          
          {/* Show available words for progressive phrases */}
          {isProgressive && phraseIndex !== null && question.progressivePhrases[phraseIndex]?.words && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <h5 className={`text-sm font-medium text-blue-700 mb-2 ${showArabic ? 'text-right' : 'text-left'}`}>
                {showArabic ? 'الكلمات المتاحة لهذه الجملة:' : 'Mots disponibles pour cette phrase:'}
              </h5>
              <div className="flex flex-wrap gap-1">
                {question.progressivePhrases[phraseIndex].words.map((word, idx) => (
                  <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default VocabularyHelper;