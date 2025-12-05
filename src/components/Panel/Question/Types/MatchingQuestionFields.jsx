import React from 'react';
import { Trash2 } from 'lucide-react';
import VocabularyHelper from './VocabularyHelper';

const MatchingQuestionFields = ({ question, onChange }) => {
  const addPair = () => {
    onChange({
      ...question,
      matchingPairs: [...(question.matchingPairs || []), { left: '', right: '', rightArabic: '' }]
    });
  };

  const updatePair = (index, field, value) => {
    const newPairs = [...(question.matchingPairs || [])];
    newPairs[index][field] = value;
    onChange({ ...question, matchingPairs: newPairs });
  };

  const removePair = (index) => {
    const newPairs = (question.matchingPairs || []).filter((_, i) => i !== index);
    onChange({ ...question, matchingPairs: newPairs });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-800">Paires de correspondance</h5>
        <button
          type="button"
          onClick={addPair}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Ajouter paire
        </button>
      </div>
      
      {question.matchingPairs?.map((pair, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h6 className="font-medium text-gray-700">Paire {index + 1}</h6>
            <button
              type="button"
              onClick={() => removePair(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              type="text"
              value={pair.left}
              onChange={(e) => updatePair(index, 'left', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Gauche (français)"
            />
            <input
              type="text"
              value={pair.right}
              onChange={(e) => updatePair(index, 'right', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Droite (français)"
            />
            <input
              type="text"
              value={pair.rightArabic || ''}
              onChange={(e) => updatePair(index, 'rightArabic', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-right"
              dir="rtl"
              placeholder="الجانب الأيمن"
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

export default MatchingQuestionFields;