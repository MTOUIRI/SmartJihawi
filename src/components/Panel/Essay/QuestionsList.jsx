import React from 'react';
import { FileText } from 'lucide-react';
import QuestionListItem from './QuestionListItem';

const QuestionsList = ({ questions, selectedExam, essayTypes, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Questions d'Expression - {selectedExam.title}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {questions.length} question{questions.length > 1 ? 's' : ''}
        </p>
      </div>

      {questions.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {questions.map((question, index) => (
            <QuestionListItem
              key={question.id}
              question={question}
              index={index}
              essayTypes={essayTypes}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Aucune question d'expression trouvée</p>
          <p className="text-sm">Commencez par ajouter votre première question</p>
        </div>
      )}
    </div>
  );
};

export default QuestionsList;