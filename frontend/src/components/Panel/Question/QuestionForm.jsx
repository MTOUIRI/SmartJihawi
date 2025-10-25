import React from 'react';
import { X, Save, Upload } from 'lucide-react';
import TextQuestionFields from './Types/TextQuestionFields';
import MultipleChoiceFields from './Types/MultipleChoiceFields';
import MultipleChoiceSingleFields from './Types/MultipleChoiceSingleFields';
import TableQuestionFields from './Types/TableQuestionFields';
import MatchingQuestionFields from './Types/MatchingQuestionFields';
import WordPlacementFields from './Types/WordPlacementFields';

const QuestionForm = ({ 
  question, 
  onChange, 
  onSubmit, 
  onClose, 
  loading, 
  error,
  editingQuestion,
  questionMode,
  onModeChange,
  questionTypes,
  showJsonImport,
  setShowJsonImport,
  jsonInput,
  setJsonInput,
  jsonError,
  handleJsonImport
}) => {
  const renderTypeSpecificFields = () => {
    switch (question.type) {
      case 'text':
        return <TextQuestionFields question={question} onChange={onChange} />;
      case 'multiple_choice_single':
        return (
          <MultipleChoiceSingleFields 
            question={question} 
            onChange={onChange}
            questionMode={questionMode}
            onModeChange={onModeChange}
          />
        );
      case 'multiple_choice':
        return <MultipleChoiceFields question={question} onChange={onChange} />;
      case 'table':
        return <TableQuestionFields question={question} onChange={onChange} />;
      case 'matching':
        return <MatchingQuestionFields question={question} onChange={onChange} />;
      case 'word_placement':
        return <WordPlacementFields question={question} onChange={onChange} />;
      default:
        return <TextQuestionFields question={question} onChange={onChange} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 max-h-[95vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingQuestion ? 'Modifier la question' : 'Ajouter une question'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* JSON Import Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-indigo-800 mb-1 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import rapide JSON
                  </h3>
                  <p className="text-sm text-indigo-600">Collez votre JSON pour remplir automatiquement le formulaire</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowJsonImport(!showJsonImport)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  {showJsonImport ? 'Fermer' : 'Importer JSON'}
                </button>
              </div>
              
              {showJsonImport && (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{"type": "text", "question": "Votre question...", "answer": "...", "helper": {"french": [], "arabic": []}}'
                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    rows={8}
                  />
                  {jsonError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      {jsonError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleJsonImport}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    ✓ Charger dans le formulaire
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de question</label>
                <select
                  value={question.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    onChange({
                      ...question, 
                      type: newType,
                      options: [],
                      subQuestions: [],
                      tableContent: null,
                      dragDropWords: newType === 'word_placement' ? { template: '', words: [] } : null
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {questionTypes.map(type => (
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
                  value={question.points}
                  onChange={(e) => onChange({...question, points: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question (Français)</label>
              <textarea
                rows={3}
                value={question.question}
                onChange={(e) => onChange({...question, question: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Saisir la question en français..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question (Arabe)</label>
              <textarea
                rows={3}
                value={question.questionArabic}
                onChange={(e) => onChange({...question, questionArabic: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
                dir="rtl"
                placeholder="أدخل السؤال بالعربية..."
              />
            </div>

            {renderTypeSpecificFields()}
          </div>

          {error && (
            <div className={`mx-6 mb-4 p-4 rounded-lg ${error.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm ${error.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{error}</p>
            </div>
          )}

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
              disabled={loading || !question.question.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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

export default QuestionForm;