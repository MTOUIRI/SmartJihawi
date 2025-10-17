import React from 'react';
import { X } from 'lucide-react';

const VocabularyHelper = ({ helper, onChange }) => {
  const addWord = () => {
    const newHelper = { ...helper };
    newHelper.french.push('');
    newHelper.arabic.push('');
    onChange(newHelper);
  };

  const updateWord = (index, field, value) => {
    const newHelper = { ...helper };
    newHelper[field][index] = value;
    onChange(newHelper);
  };

  const removeWord = (index) => {
    const newHelper = { ...helper };
    newHelper.french.splice(index, 1);
    newHelper.arabic.splice(index, 1);
    onChange(newHelper);
  };

  return (
    <div className="border-t pt-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">
          Aide vocabulaire (optionnel)
        </label>
        <button
          type="button"
          onClick={addWord}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Ajouter mot
        </button>
      </div>
      
      {helper.french.map((frenchWord, index) => (
        <div key={index} className="flex gap-3 mb-2">
          <input
            type="text"
            placeholder="Mot français"
            value={frenchWord}
            onChange={(e) => updateWord(index, 'french', e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="ترجمة بالعربية"
            value={helper.arabic[index] || ''}
            onChange={(e) => updateWord(index, 'arabic', e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-right"
            dir="rtl"
          />
          <button
            type="button"
            onClick={() => removeWord(index)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default VocabularyHelper;