import React from 'react';
import { Trash2 } from 'lucide-react';
import VocabularyHelper from './VocabularyHelper';

const MultipleChoiceFields = ({ question, onChange }) => {
  const addSubQuestion = () => {
    const newSubQuestions = [...(question.subQuestions || [])];
    newSubQuestions.push({
      id: Date.now(),
      question: '',
      questionArabic: '',
      answer: 'VRAI',
      answerArabic: 'صحيح'
    });
    onChange({...question, subQuestions: newSubQuestions});
  };

  const updateSubQuestion = (index, field, value) => {
    const newSubQuestions = [...(question.subQuestions || [])];
    newSubQuestions[index][field] = value;
    onChange({...question, subQuestions: newSubQuestions});
  };

  const removeSubQuestion = (index) => {
    const newSubQuestions = (question.subQuestions || []).filter((_, i) => i !== index);
    onChange({...question, subQuestions: newSubQuestions});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-800">Questions Vrai/Faux</h5>
        <button
          type="button"
          onClick={addSubQuestion}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Ajouter question
        </button>
      </div>
      
      {question.subQuestions?.map((subQ, index) => (
        <div key={subQ.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h6 className="font-medium text-gray-700">Question {index + 1}</h6>
            <button
              type="button"
              onClick={() => removeSubQuestion(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={subQ.question}
              onChange={(e) => updateSubQuestion(index, 'question', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Question en français"
            />
            <input
              type="text"
              value={subQ.questionArabic}
              onChange={(e) => updateSubQuestion(index, 'questionArabic', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-right"
              dir="rtl"
              placeholder="السؤال بالعربية"
            />
            <select
              value={subQ.answer}
              onChange={(e) => {
                const value = e.target.value;
                updateSubQuestion(index, 'answer', value);
                updateSubQuestion(index, 'answerArabic', value === 'VRAI' ? 'صحيح' : 'خطأ');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="VRAI">VRAI / صحيح</option>
              <option value="FAUX">FAUX / خطأ</option>
            </select>
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

export default MultipleChoiceFields;