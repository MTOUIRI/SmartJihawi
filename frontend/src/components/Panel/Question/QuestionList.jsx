import React from 'react';
import { Edit, Trash2, FileText, PenTool, Target } from 'lucide-react';

const QuestionList = ({ questions, questionTypes, onEdit, onDelete }) => {
  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Aucune question trouvée</p>
        <p className="text-sm">Commencez par ajouter votre première question</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {questions.map((question, index) => {
        const typeInfo = questionTypes.find(t => t.value === question.type);
        const Icon = typeInfo?.icon || PenTool;
        
        return (
          <div key={question.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                    Q{index + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    {typeInfo?.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {question.points} pts
                  </span>
                </div>
                <p className="text-gray-700 mb-2">
                  {question.question.substring(0, 150)}
                  {question.question.length > 150 && '...'}
                </p>
                {question.questionArabic && (
                  <p className="text-gray-600 text-sm text-right" dir="rtl">
                    {question.questionArabic.substring(0, 150)}
                    {question.questionArabic.length > 150 && '...'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onEdit(question)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(question.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;