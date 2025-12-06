import React from 'react';

const EssaySubjectFields = ({ currentQuestion, onChange }) => {
  if (currentQuestion.type !== 'essay_subject') return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sujet (Français) *
        </label>
        <textarea
          rows={6}
          value={currentQuestion.prompt || ''}
          onChange={(e) => onChange({ ...currentQuestion, prompt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Saisissez le sujet de l'expression écrite..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sujet (Arabe) *
        </label>
        <textarea
          rows={6}
          value={currentQuestion.promptArabic || ''}
          onChange={(e) => onChange({ ...currentQuestion, promptArabic: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
          dir="rtl"
          placeholder="أدخل موضوع التعبير الكتابي..."
          required
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border">
        <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Critères d'évaluation (automatiques)
        </h5>
        <p className="text-sm text-gray-600">
          Les critères d'évaluation standard seront appliqués automatiquement :
        </p>
        <div className="mt-2 grid md:grid-cols-2 gap-3 text-xs text-gray-500">
          <div>
            <strong>Discours (5 pts):</strong> Conformité, cohérence, structure
          </div>
          <div>
            <strong>Langue (5 pts):</strong> Vocabulaire, syntaxe, ponctuation, orthographe, conjugaison
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssaySubjectFields;