import React, { useEffect } from 'react';
import VocabularyHelper from './VocabularyHelper';

const TableQuestionFields = ({ question, onChange }) => {
  useEffect(() => {
    if (!question.tableContent) {
      onChange({
        ...question,
        tableContent: {
          headers: [''],
          headersArabic: [''],
          answer: ['']
        }
      });
    }
  }, []);

  if (!question.tableContent) {
    return null;
  }

  const addColumn = () => {
    const newContent = { ...question.tableContent };
    newContent.headers.push('');
    newContent.headersArabic.push('');
    newContent.answer.push('');
    onChange({...question, tableContent: newContent});
  };

  const updateHeader = (index, field, value) => {
    const newContent = { ...question.tableContent };
    newContent[field][index] = value;
    onChange({...question, tableContent: newContent});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-800">Configuration du tableau</h5>
        <button
          type="button"
          onClick={addColumn}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Ajouter colonne
        </button>
      </div>
      
      {question.tableContent.headers.map((header, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-3">
            <input
              type="text"
              value={header}
              onChange={(e) => updateHeader(index, 'headers', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="En-tête français"
            />
            <input
              type="text"
              value={question.tableContent.headersArabic[index] || ''}
              onChange={(e) => updateHeader(index, 'headersArabic', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-right"
              dir="rtl"
              placeholder="العنوان بالعربية"
            />
            <input
              type="text"
              value={question.tableContent.answer[index] || ''}
              onChange={(e) => updateHeader(index, 'answer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Réponse attendue"
            />
          </div>
        </div>
      ))}
      
      <VocabularyHelper 
        helper={question.helper} 
        onChange={(helper) => onChange({...question, helper})}
      />
    </div>
  );
};

export default TableQuestionFields;