import React from 'react';
import VocabularyHelper from './VocabularyHelper';

const TableQuestion = ({ 
  question, 
  showArabic, 
  showAnswers, 
  userAnswers, 
  onAnswerChange,
  showHelper,
  toggleHelper
}) => {
  // Add safety check
  if (!question.tableContent || !question.tableContent.headers) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800">
          {showArabic ? 'بيانات الجدول غير متوفرة' : 'Données du tableau non disponibles'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              {(showArabic && question.tableContent.headersArabic 
                ? question.tableContent.headersArabic 
                : question.tableContent.headers
              ).map((header, idx) => (
                <th key={idx} className={`border border-gray-300 p-3 font-semibold ${showArabic ? 'text-right' : 'text-left'}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {(showAnswers[question.id] 
                ? (showArabic && question.tableContent.answerArabic 
                    ? question.tableContent.answerArabic 
                    : question.tableContent.answer)
                : question.tableContent.answer
              ).map((cell, idx) => (
                <td key={idx} className={`border border-gray-300 p-3 ${showArabic ? 'text-right' : 'text-left'}`}>
                  {showAnswers[question.id] ? (
                    <span className="text-green-600 font-medium">{cell}</span>
                  ) : (
                    <input
                      type="text"
                      className={`w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${showArabic ? 'text-right' : 'text-left'}`}
                      placeholder={showArabic ? "إجابتك..." : "Votre réponse..."}
                      value={userAnswers[question.id]?.[idx] || ''}
                      onChange={(e) => {
                        const newAnswers = [...(userAnswers[question.id] || [])];
                        newAnswers[idx] = e.target.value;
                        onAnswerChange(question.id, newAnswers);
                      }}
                      dir={showArabic ? 'rtl' : 'ltr'}
                    />
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <VocabularyHelper 
        question={question}
        showArabic={showArabic}
        showAnswers={showAnswers}
        showHelper={showHelper}
        toggleHelper={toggleHelper}
      />
    </div>
  );
};

export default TableQuestion;