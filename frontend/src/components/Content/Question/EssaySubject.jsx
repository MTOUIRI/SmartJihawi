import React from 'react';
import { PenTool, Target, Star } from 'lucide-react';

const EssaySubject = ({ question, showArabic }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
        <div className="flex items-center gap-3 mb-4">
          <PenTool className="w-6 h-6 text-purple-600" />
          <h3 className={`text-xl font-bold text-purple-800 ${showArabic ? 'text-right flex-1' : ''}`}>
            {showArabic && question.subTitleArabic ? question.subTitleArabic : question.subTitle}
          </h3>
        </div>
        
        <div className={`text-gray-700 leading-relaxed whitespace-pre-line ${showArabic ? 'text-right' : 'text-left'}`}>
          <p className="mb-4">
            {showArabic && question.promptArabic ? question.promptArabic : question.prompt}
          </p>
          {showArabic && question.promptArabic && (
            <p className="text-sm text-gray-500 border-t pt-4 text-left">
              {question.prompt}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-800">
              {showArabic && question.criteria.discourse.titleArabic 
                ? question.criteria.discourse.titleArabic 
                : question.criteria.discourse.title}
            </h4>
          </div>
          <div className="space-y-3">
            {question.criteria.discourse.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold mt-0.5">
                  {item.points}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-700">
                    {showArabic && item.textArabic ? item.textArabic : item.text}
                  </p>
                  {showArabic && item.textArabic && (
                    <p className="text-xs text-blue-500 mt-1">
                      {item.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-blue-200">
              <span className="font-bold text-blue-800">
                {showArabic ? 'المجموع:' : 'Total:'} {question.criteria.discourse.totalPoints} {showArabic ? 'نقط' : 'points'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-5 border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">
              {showArabic && question.criteria.language.titleArabic 
                ? question.criteria.language.titleArabic 
                : question.criteria.language.title}
            </h4>
          </div>
          <div className="space-y-3">
            {question.criteria.language.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold mt-0.5">
                  {item.points}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-700">
                    {showArabic && item.textArabic ? item.textArabic : item.text}
                  </p>
                  {showArabic && item.textArabic && (
                    <p className="text-xs text-green-500 mt-1">
                      {item.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-green-200">
              <span className="font-bold text-green-800">
                {showArabic ? 'المجموع:' : 'Total:'} {question.criteria.language.totalPoints} {showArabic ? 'نقط' : 'points'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EssaySubject;