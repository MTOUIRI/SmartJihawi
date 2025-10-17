import React from 'react';
import { Trash2, X } from 'lucide-react';

const ProgressivePhrasesFields = ({ currentQuestion, onChange }) => {
  const addPhrase = () => {
    const newPhrases = [...(currentQuestion.progressivePhrases || [])];
    newPhrases.push({
      template: '',
      words: [],
      helper: { french: [], arabic: [] }
    });
    onChange({ ...currentQuestion, progressivePhrases: newPhrases });
  };

  const updatePhrase = (index, field, value) => {
    const newPhrases = [...(currentQuestion.progressivePhrases || [])];
    newPhrases[index][field] = value;
    onChange({ ...currentQuestion, progressivePhrases: newPhrases });
  };

  const removePhrase = (index) => {
    const newPhrases = (currentQuestion.progressivePhrases || []).filter((_, i) => i !== index);
    onChange({ ...currentQuestion, progressivePhrases: newPhrases });
  };

  const addHelperWord = (phraseIndex) => {
    const newPhrases = [...(currentQuestion.progressivePhrases || [])];
    if (!newPhrases[phraseIndex].helper) {
      newPhrases[phraseIndex].helper = { french: [], arabic: [] };
    }
    newPhrases[phraseIndex].helper.french.push('');
    newPhrases[phraseIndex].helper.arabic.push('');
    onChange({ ...currentQuestion, progressivePhrases: newPhrases });
  };

  const updateHelperWord = (phraseIndex, helperIndex, lang, value) => {
    const newPhrases = [...(currentQuestion.progressivePhrases || [])];
    newPhrases[phraseIndex].helper[lang][helperIndex] = value;
    onChange({ ...currentQuestion, progressivePhrases: newPhrases });
  };

  const removeHelperWord = (phraseIndex, helperIndex) => {
    const newPhrases = [...(currentQuestion.progressivePhrases || [])];
    newPhrases[phraseIndex].helper.french.splice(helperIndex, 1);
    newPhrases[phraseIndex].helper.arabic.splice(helperIndex, 1);
    onChange({ ...currentQuestion, progressivePhrases: newPhrases });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-800">Phrases progressives</h5>
        <button
          type="button"
          onClick={addPhrase}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Ajouter phrase
        </button>
      </div>

      {currentQuestion.progressivePhrases?.map((phrase, pIndex) => (
        <div key={pIndex} className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h6 className="font-medium text-gray-700">Phrase {pIndex + 1}</h6>
            <button
              type="button"
              onClick={() => removePhrase(pIndex)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template (utilisez [1], [2], etc. pour les emplacements)
              </label>
              <textarea
                rows={3}
                value={phrase.template || ''}
                onChange={(e) => updatePhrase(pIndex, 'template', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Le texte [1] traite de [2]..."
              />
            </div>

            <div className="border-t pt-3">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Aide vocabulaire pour cette phrase (optionnel)
              </label>
              <button
                type="button"
                onClick={() => addHelperWord(pIndex)}
                className="text-blue-600 hover:text-blue-800 text-sm mb-2"
              >
                + Ajouter mot d'aide
              </button>
              {phrase.helper?.french?.map((french, hIndex) => (
                <div key={hIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Français"
                    value={french}
                    onChange={(e) => updateHelperWord(pIndex, hIndex, 'french', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="العربية"
                    value={phrase.helper.arabic[hIndex] || ''}
                    onChange={(e) => updateHelperWord(pIndex, hIndex, 'arabic', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={() => removeHelperWord(pIndex, hIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressivePhrasesFields;