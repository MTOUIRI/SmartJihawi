import React from 'react';
import VocabularyHelper from './VocabularyHelper';
import { MoveHorizontal } from 'lucide-react';

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
      <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm sm:text-base">
          {showArabic ? 'بيانات الجدول غير متوفرة' : 'Données du tableau non disponibles'}
        </p>
      </div>
    );
  }

  const headers = showArabic && question.tableContent.headersArabic 
    ? question.tableContent.headersArabic 
    : question.tableContent.headers;
    
  const answers = showAnswers[question.id] 
    ? (showArabic && question.tableContent.answerArabic 
        ? question.tableContent.answerArabic 
        : question.tableContent.answer)
    : question.tableContent.answer;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Scroll hint for mobile */}
      <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
        <MoveHorizontal className="w-4 h-4" />
        <span>{showArabic ? 'مرر أفقيًا لرؤية جميع الأعمدة' : 'Faites défiler horizontalement pour voir toutes les colonnes'}</span>
      </div>

      {/* Responsive Table with Horizontal Scroll */}
      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                {headers.map((header, idx) => (
                  <th 
                    key={idx} 
                    className={`border-r border-gray-300 last:border-r-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-gray-700 text-xs sm:text-sm md:text-base whitespace-nowrap ${showArabic ? 'text-right' : 'text-left'}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-gray-50 transition-colors">
                {answers.map((cell, idx) => (
                  <td 
                    key={idx} 
                    className={`border-r border-t border-gray-300 last:border-r-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 ${showArabic ? 'text-right' : 'text-left'}`}
                  >
                    {showAnswers[question.id] ? (
                      <div className="min-w-[120px] sm:min-w-[150px]">
                        <span className="text-green-600 font-medium text-xs sm:text-sm md:text-base inline-block">
                          {cell}
                        </span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className={`w-full min-w-[120px] sm:min-w-[150px] p-2 sm:p-2.5 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm md:text-base ${showArabic ? 'text-right' : 'text-left'}`}
                        placeholder={showArabic ? "إجابتك..." : "Réponse..."}
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
      </div>

      {/* Mobile tip */}
      <div className="md:hidden text-center">
        <p className="text-xs text-gray-500 italic">
          {showArabic ? '💡 نصيحة: استخدم إصبعين للتمرير' : '💡 Astuce: Utilisez deux doigts pour faire défiler'}
        </p>
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