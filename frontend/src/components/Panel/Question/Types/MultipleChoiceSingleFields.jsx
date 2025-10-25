import React from 'react';
import { X, Trash2 } from 'lucide-react';
import VocabularyHelper from './VocabularyHelper';

const MultipleChoiceSingleFields = ({ question, onChange, questionMode, onModeChange }) => {
  const addOption = () => {
    onChange({
      ...question,
      options: [...(question.options || []), { id: '', text: '', textArabic: '' }]
    });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...(question.options || [])];
    newOptions[index][field] = value;
    onChange({ ...question, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = (question.options || []).filter((_, i) => i !== index);
    onChange({ ...question, options: newOptions });
  };

  const addSubQuestion = () => {
    const newSubQuestions = [...(question.subQuestions || [])];
    newSubQuestions.push({
      id: Date.now(),
      question: '',
      questionArabic: '',
      options: [
        { id: 'a', text: '', textArabic: '' },
        { id: 'b', text: '', textArabic: '' }
      ],
      answer: ''
    });
    onChange({...question, subQuestions: newSubQuestions});
  };

  const updateSubQuestion = (index, field, value) => {
    const newSubQuestions = [...(question.subQuestions || [])];
    newSubQuestions[index][field] = value;
    onChange({...question, subQuestions: newSubQuestions});
  };

  const updateSubQuestionOption = (subIndex, optIndex, field, value) => {
    const newSubQuestions = [...(question.subQuestions || [])];
    newSubQuestions[subIndex].options[optIndex][field] = value;
    onChange({...question, subQuestions: newSubQuestions});
  };

  const removeSubQuestion = (index) => {
    const newSubQuestions = (question.subQuestions || []).filter((_, i) => i !== index);
    onChange({...question, subQuestions: newSubQuestions});
  };

  // Toggle multiple answer selection
  const toggleMultipleAnswer = (optionId) => {
    const currentAnswers = question.answer ? question.answer.split(' et ') : [];
    let newAnswers;
    
    if (currentAnswers.includes(optionId)) {
      newAnswers = currentAnswers.filter(id => id !== optionId);
    } else {
      newAnswers = [...currentAnswers, optionId].sort();
    }
    
    onChange({...question, answer: newAnswers.join(' et ')});
  };

  const isAnswerSelected = (optionId) => {
    if (!question.answer) return false;
    return question.answer.split(' et ').includes(optionId);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">Mode de question</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="questionMode"
              checked={questionMode === 'simple'}
              onChange={() => onModeChange('simple')}
              className="text-blue-600"
            />
            <span className="text-sm">Question simple (une seule question avec options)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="questionMode"
              checked={questionMode === 'grouped'}
              onChange={() => onModeChange('grouped')}
              className="text-blue-600"
            />
            <span className="text-sm">Questions groupées (plusieurs sous-questions)</span>
          </label>
        </div>
      </div>

      {questionMode === 'simple' ? (
        <>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Options de réponse</label>
            <button
              type="button"
              onClick={addOption}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Ajouter option
            </button>
          </div>
          
          {(question.options || []).map((option, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder="ID (a, b, c...)"
                value={option.id}
                onChange={(e) => updateOption(index, 'id', e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Texte français"
                value={option.text}
                onChange={(e) => updateOption(index, 'text', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Texte arabe"
                value={option.textArabic || ''}
                onChange={(e) => updateOption(index, 'textArabic', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-right"
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {(question.options || []).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réponse(s) correcte(s) - Cochez une ou plusieurs options
              </label>
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                {question.options.map((option, index) => (
                  <label key={index} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnswerSelected(option.id)}
                      onChange={() => toggleMultipleAnswer(option.id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">
                      {option.id}) {option.text}
                    </span>
                  </label>
                ))}
              </div>
              {question.answer && (
                <p className="mt-2 text-sm text-gray-600">
                  Réponse sélectionnée: <span className="font-medium">{question.answer}</span>
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-gray-800">Sous-questions</h5>
            <button
              type="button"
              onClick={addSubQuestion}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Ajouter sous-question
            </button>
          </div>
          
          {(question.subQuestions || []).map((subQ, subIndex) => (
            <div key={subQ.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h6 className="font-medium text-gray-700">Sous-question {subIndex + 1}</h6>
                <button
                  type="button"
                  onClick={() => removeSubQuestion(subIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={subQ.question}
                  onChange={(e) => updateSubQuestion(subIndex, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Question en français (ex: Titre de l'œuvre...)"
                />
                <input
                  type="text"
                  value={subQ.questionArabic || ''}
                  onChange={(e) => updateSubQuestion(subIndex, 'questionArabic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-right"
                  dir="rtl"
                  placeholder="السؤال بالعربية"
                />
                
                <div className="border-t pt-3 mt-3">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Options</label>
                  {(subQ.options || []).map((opt, optIndex) => (
                    <div key={optIndex} className="grid grid-cols-3 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="ID"
                        value={opt.id}
                        onChange={(e) => updateSubQuestionOption(subIndex, optIndex, 'id', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Texte français"
                        value={opt.text}
                        onChange={(e) => updateSubQuestionOption(subIndex, optIndex, 'text', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Texte arabe"
                        value={opt.textArabic || ''}
                        onChange={(e) => updateSubQuestionOption(subIndex, optIndex, 'textArabic', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm text-right"
                        dir="rtl"
                      />
                    </div>
                  ))}
                </div>
                
                <select
                  value={subQ.answer || ''}
                  onChange={(e) => updateSubQuestion(subIndex, 'answer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choisir la bonne réponse</option>
                  {(subQ.options || []).map((opt, optIndex) => (
                    <option key={optIndex} value={opt.id}>
                      {opt.id}) {opt.text}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </>
      )}
      
      <VocabularyHelper 
        helper={question.helper} 
        onChange={(helper) => onChange({...question, helper})}
      />
    </div>
  );
};

export default MultipleChoiceSingleFields;