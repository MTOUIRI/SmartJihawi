import React from 'react';
import { Edit, Trash2, PenTool } from 'lucide-react';

const QuestionListItem = ({ question, index, essayTypes, onEdit, onDelete }) => {
  const typeInfo = essayTypes.find(t => t.value === question.type);
  const Icon = typeInfo?.icon || PenTool;
  
  return (
    <div className="p-6 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-4 h-4 text-purple-600" />
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
              Q{index + 1}
            </span>
            <span className="text-sm text-gray-500">{typeInfo?.label}</span>
            <span className="text-sm text-gray-500">{question.points} pts</span>
          </div>
          
          {question.type === 'essay_subject' ? (
            <div>
              <p className="text-gray-700 mb-2 font-medium">
                {question.question} - {question.subTitle}
              </p>
              <p className="text-gray-600 text-sm">
                {question.prompt?.substring(0, 150)}
                {question.prompt?.length > 150 && '...'}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-2">{question.question}</p>
              {question.progressivePhrases && question.progressivePhrases.length > 0 ? (
                <p className="text-gray-600 text-sm">
                  {question.progressivePhrases.length} phrase{question.progressivePhrases.length > 1 ? 's' : ''} progressive{question.progressivePhrases.length > 1 ? 's' : ''}
                </p>
              ) : (
                <p className="text-gray-600 text-sm">Réponse modèle disponible</p>
              )}
            </div>
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
};

export default QuestionListItem;