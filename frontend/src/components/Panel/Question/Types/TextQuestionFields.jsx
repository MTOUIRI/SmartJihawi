import React from 'react';
import { Plus, Trash2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const VocabularyHelper = ({ helper, onChange }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h4 className="font-medium text-blue-800 mb-3">Aide vocabulaire</h4>
    <div className="space-y-3">
      {(helper?.french || []).map((frenchWord, idx) => (
        <div key={idx} className="flex gap-3 items-center">
          <input
            type="text"
            value={frenchWord}
            onChange={(e) => {
              const newFrench = [...(helper?.french || [])];
              newFrench[idx] = e.target.value;
              onChange({...helper, french: newFrench});
            }}
            className="flex-1 px-3 py-2 border border-blue-300 rounded-lg"
            placeholder="Mot français"
          />
          <input
            type="text"
            value={helper?.arabic?.[idx] || ''}
            onChange={(e) => {
              const newArabic = [...(helper?.arabic || [])];
              newArabic[idx] = e.target.value;
              onChange({...helper, arabic: newArabic});
            }}
            className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-right"
            dir="rtl"
            placeholder="الكلمة بالعربية"
          />
          <button
            type="button"
            onClick={() => {
              const newFrench = (helper?.french || []).filter((_, i) => i !== idx);
              const newArabic = (helper?.arabic || []).filter((_, i) => i !== idx);
              onChange({french: newFrench, arabic: newArabic});
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          onChange({
            french: [...(helper?.french || []), ''],
            arabic: [...(helper?.arabic || []), '']
          });
        }}
        className="w-full px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
      >
        + Ajouter un mot
      </button>
    </div>
  </div>
);

const TextQuestionFields = ({ question, onChange }) => {
  const [showHelper, setShowHelper] = React.useState(false);
  const [hasSubQuestions, setHasSubQuestions] = React.useState(
    question.subQuestions && question.subQuestions.length > 0
  );

  const handleToggleSubQuestions = () => {
    const newValue = !hasSubQuestions;
    setHasSubQuestions(newValue);
    
    if (!newValue) {
      // Remove sub-questions if toggling off
      onChange({
        ...question,
        subQuestions: []
      });
    } else if (!question.subQuestions || question.subQuestions.length === 0) {
      // Add first sub-question if toggling on
      onChange({
        ...question,
        subQuestions: [{
          id: Date.now(),
          label: 'a',
          question: '',
          questionArabic: '',
          answer: '',
          answerArabic: '',
          points: 0.5
        }]
      });
    }
  };

  const handleAddSubQuestion = () => {
    const subQuestions = question.subQuestions || [];
    const labels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    const nextLabel = labels[subQuestions.length] || `${subQuestions.length + 1}`;
    
    onChange({
      ...question,
      subQuestions: [
        ...subQuestions,
        {
          id: Date.now() + Math.random(),
          label: nextLabel,
          question: '',
          questionArabic: '',
          answer: '',
          answerArabic: '',
          points: 0.5
        }
      ]
    });
  };

  const handleRemoveSubQuestion = (index) => {
    const newSubQuestions = question.subQuestions.filter((_, i) => i !== index);
    onChange({
      ...question,
      subQuestions: newSubQuestions
    });
  };

  const handleUpdateSubQuestion = (index, field, value) => {
    const newSubQuestions = [...question.subQuestions];
    newSubQuestions[index] = {
      ...newSubQuestions[index],
      [field]: value
    };
    onChange({
      ...question,
      subQuestions: newSubQuestions
    });
  };

  return (
    <div className="space-y-6">
      {/* Toggle for sub-questions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-purple-800 mb-1">Question avec sous-parties</h3>
            <p className="text-sm text-purple-600">
              Ajoutez des sous-questions (a-, b-, c-) avec leurs réponses individuelles
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium text-purple-700">
              {hasSubQuestions ? 'Activé' : 'Désactivé'}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={hasSubQuestions}
                onChange={handleToggleSubQuestions}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </div>
          </label>
        </div>
      </div>

      {/* Sub-questions section */}
      {hasSubQuestions && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-700">Sous-questions</h4>
            <button
              type="button"
              onClick={handleAddSubQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Ajouter une sous-question
            </button>
          </div>

          {question.subQuestions && question.subQuestions.length > 0 ? (
            <div className="space-y-4">
              {question.subQuestions.map((subQ, index) => (
                <div key={subQ.id} className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                        {subQ.label}
                      </span>
                      <input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={subQ.points}
                        onChange={(e) => handleUpdateSubQuestion(index, 'points', parseFloat(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="pts"
                      />
                      <span className="text-sm text-gray-500">points</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubQuestion(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sous-question (Français)
                      </label>
                      <textarea
                        rows={2}
                        value={subQ.question}
                        onChange={(e) => handleUpdateSubQuestion(index, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Ex: Quelle figure de style reconnaissez-vous..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sous-question (Arabe)
                      </label>
                      <textarea
                        rows={2}
                        value={subQ.questionArabic}
                        onChange={(e) => handleUpdateSubQuestion(index, 'questionArabic', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-right"
                        dir="rtl"
                        placeholder="مثال: ما هي الصورة البلاغية..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Réponse suggérée (Français)
                      </label>
                      <textarea
                        rows={2}
                        value={subQ.answer}
                        onChange={(e) => handleUpdateSubQuestion(index, 'answer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Réponse en français..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Réponse suggérée (Arabe)
                      </label>
                      <textarea
                        rows={2}
                        value={subQ.answerArabic}
                        onChange={(e) => handleUpdateSubQuestion(index, 'answerArabic', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-right"
                        dir="rtl"
                        placeholder="الإجابة بالعربية..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Aucune sous-question. Cliquez sur "Ajouter une sous-question" pour commencer.</p>
            </div>
          )}
        </div>
      )}

      {/* Global answer (only shown if no sub-questions) */}
      {!hasSubQuestions && (
        <>
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
        </>
      )}

      {/* Vocabulary Helper */}
      <div>
        <button
          type="button"
          onClick={() => setShowHelper(!showHelper)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-3"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="font-medium">Aide vocabulaire (optionnel)</span>
          {showHelper ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showHelper && (
          <VocabularyHelper 
            helper={question.helper} 
            onChange={(helper) => onChange({...question, helper})}
          />
        )}
      </div>
    </div>
  );
};

export default TextQuestionFields;