import React from 'react';
import VocabularyHelper from './VocabularyHelper';

const TextQuestionFields = ({ question, onChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Réponse suggérée (Français)
      </label>
      <textarea
        rows={4}
        value={question.answer}
        onChange={(e) => onChange({...question, answer: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Réponse suggérée en français..."
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Réponse suggérée (Arabe)
      </label>
      <textarea
        rows={4}
        value={question.answerArabic}
        onChange={(e) => onChange({...question, answerArabic: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
        dir="rtl"
        placeholder="الإجابة المقترحة بالعربية..."
      />
    </div>
    <VocabularyHelper 
      helper={question.helper} 
      onChange={(helper) => onChange({...question, helper})}
    />
  </div>
);

export default TextQuestionFields;