import React from 'react';
import VocabularyHelper from './VocabularyHelper';

const TextArea = ({
  question,
  showArabic,
  currentAnswer,
  onAnswerChange,
  showHelper,
  toggleHelper
}) => {
  const wordCount = typeof currentAnswer === 'string' 
    ? currentAnswer.trim().split(/\s+/).filter(word => word.length > 0).length
    : 0;

  return (
    <div className="space-y-4">
      <textarea
        value={typeof currentAnswer === 'string' ? currentAnswer : ''}
        onChange={(e) => onAnswerChange(question.id, e.target.value)}
        placeholder={showArabic ? 'اكتب إجابتك هنا...' : 'Rédigez votre réponse ici...'}
        className={`w-full h-48 p-4 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          showArabic ? 'text-right' : 'text-left'
        }`}
        dir={showArabic ? 'rtl' : 'ltr'}
      />
      
      <div className="text-sm text-gray-500">
        {showArabic ? 'عدد الكلمات:' : 'Nombre de mots :'} {wordCount}
      </div>

      <VocabularyHelper
        question={question}
        showArabic={showArabic}
        showHelper={showHelper}
        toggleHelper={toggleHelper}
        isProgressive={false}
      />
    </div>
  );
};

export default TextArea;