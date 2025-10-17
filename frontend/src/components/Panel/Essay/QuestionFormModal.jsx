import React from 'react';
import { X, Save } from 'lucide-react';
import JsonImportSection from './JsonImportSection';
import EssaySubjectFields from './EssaySubjectFields';
import ProgressivePhrasesFields from './ProgressivePhrasesFields';

const QuestionFormModal = ({
  show,
  editingQuestion,
  currentQuestion,
  essayTypes,
  loading,
  error,
  showJsonImport,
  jsonInput,
  jsonError,
  onClose,
  onSubmit,
  onChange,
  onJsonToggle,
  onJsonInputChange,
  onJsonImport
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 max-h-[95vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingQuestion ? 'Modifier la question' : 'Ajouter une question d\'expression'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* JSON Import Section */}
            <JsonImportSection
              showJsonImport={showJsonImport}
              jsonInput={jsonInput}
              jsonError={jsonError}
              onToggle={onJsonToggle}
              onInputChange={onJsonInputChange}
              onImport={onJsonImport}
            />

            {/* Type and Points */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de question
                </label>
                <select
                  value={currentQuestion.type}
                  onChange={(e) => onChange({
                    ...currentQuestion,
                    type: e.target.value,
                    progressivePhrases: [],
                    criteria: null,
                    points: e.target.value === 'essay_subject' ? 10 : 2
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {essayTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={currentQuestion.points}
                  onChange={(e) => onChange({ ...currentQuestion, points: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={currentQuestion.type === 'essay_subject'}
                />
              </div>
            </div>

            {/* Conditional Fields */}
            {currentQuestion.type === 'essay_subject' ? (
              <EssaySubjectFields currentQuestion={currentQuestion} onChange={onChange} />
            ) : (
              <>
                {/* Model Answers */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-800 mb-3">Réponses modèles</h5>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Réponse modèle (Français)
                      </label>
                      <textarea
                        rows={4}
                        value={currentQuestion.answer}
                        onChange={(e) => onChange({ ...currentQuestion, answer: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Réponse modèle en français..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Réponse modèle (Arabe)
                      </label>
                      <textarea
                        rows={4}
                        value={currentQuestion.answerArabic}
                        onChange={(e) => onChange({ ...currentQuestion, answerArabic: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
                        dir="rtl"
                        placeholder="الإجابة النموذجية بالعربية..."
                      />
                    </div>
                  </div>
                </div>

                {/* Progressive Phrases */}
                <ProgressivePhrasesFields currentQuestion={currentQuestion} onChange={onChange} />
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mx-6 mb-4 p-4 rounded-lg ${error.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm ${error.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{error}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || (currentQuestion.type === 'essay_subject' && (!currentQuestion.prompt?.trim() || !currentQuestion.promptArabic?.trim()))}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Enregistrement...' : (editingQuestion ? 'Modifier' : 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionFormModal;