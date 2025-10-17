import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import VocabularyHelper from './VocabularyHelper';

const WordPlacementFields = ({ question, onChange }) => {
  useEffect(() => {
    if (!question.dragDropWords || Array.isArray(question.dragDropWords)) {
      onChange({
        ...question,
        dragDropWords: {
          template: '',
          words: []
        }
      });
    }
  }, []);

  if (!question.dragDropWords || Array.isArray(question.dragDropWords)) {
    return null;
  }

  const addWord = () => {
    const newWords = [...(question.dragDropWords.words || []), ''];
    onChange({
      ...question,
      dragDropWords: { ...question.dragDropWords, words: newWords }
    });
  };

  const updateWord = (index, value) => {
    const newWords = [...(question.dragDropWords.words || [])];
    newWords[index] = value;
    onChange({ 
      ...question, 
      dragDropWords: { ...question.dragDropWords, words: newWords }
    });
  };

  const removeWord = (index) => {
    const newWords = (question.dragDropWords.words || []).filter((_, i) => i !== index);
    onChange({ 
      ...question, 
      dragDropWords: { ...question.dragDropWords, words: newWords }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phrase avec emplacements (utilisez [0], [1], [2]... pour les espaces) *
        </label>
        <textarea
          rows={3}
          value={question.dragDropWords.template || ''}
          onChange={(e) => onChange({
            ...question, 
            dragDropWords: { ...question.dragDropWords, template: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Le comportement de Rahma est [0] et [1]. Malgré le [2]..."
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          💡 Utilisez [0], [1], [2], etc. pour indiquer où placer les mots (commence à 0)
        </p>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Mots à placer *</label>
          <button
            type="button"
            onClick={addWord}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Ajouter mot
          </button>
        </div>
        
        {question.dragDropWords.words?.map((word, index) => (
          <div key={index} className="flex gap-3 mb-2">
            <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded font-mono text-sm">
              [{index}]
            </span>
            <input
              type="text"
              value={word}
              onChange={(e) => updateWord(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder={`Mot pour position [${index}]`}
              required
            />
            <button
              type="button"
              onClick={() => removeWord(index)}
              className="text-red-600 hover:text-red-800 p-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {(!question.dragDropWords.words || question.dragDropWords.words.length === 0) && (
          <p className="text-sm text-gray-500 italic">
            Aucun mot ajouté. Cliquez sur "+ Ajouter mot" pour commencer.
          </p>
        )}
      </div>

      <div className="border-t pt-4 space-y-4">
        <h5 className="font-medium text-gray-700">Réponse complète (optionnel)</h5>
        <p className="text-xs text-gray-500">
          💡 La phrase complète avec les mots placés - sera affichée aux étudiants après complétion
        </p>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Réponse en français
          </label>
          <textarea
            rows={3}
            value={question.answer || ''}
            onChange={(e) => onChange({...question, answer: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Le comportement de Rahma est calme et réfléchi. Malgré le conflit..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Réponse en arabe
          </label>
          <textarea
            rows={3}
            value={question.answerArabic || ''}
            onChange={(e) => onChange({...question, answerArabic: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
            dir="rtl"
            placeholder="مثال: سلوك رحمة هادئ ومتأني. رغم الصراع..."
          />
        </div>
      </div>
      
      <VocabularyHelper 
        helper={question.helper} 
        onChange={(helper) => onChange({...question, helper})}
      />
    </div>
  );
};

export default WordPlacementFields;