import React, { useState, useEffect } from 'react';
import { Lightbulb, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import ProgressivePhrases from './ProgressivePhrases';
import SingleWordPlacement from './SingleWordPlacement';
import TextArea from './TextArea';
import CompleteEssayDisplay from './CompleteEssayDisplay';

const EssaySection = ({ 
  question, 
  showArabic, 
  showAnswers, 
  userAnswers, 
  onAnswerChange,
  showHelper,
  toggleHelper,
  checkedAnswers = {},
  onCheckAnswer,
  hideQuestionBox = false,
  allEssayQuestions = []
}) => {
  useEffect(() => {
    // This will trigger child components to reset when question changes
  }, [question.id]);

  const isIntroduction = question.type === 'essay_introduction';
  const isDevelopment = question.type === 'essay_development';
  const isConclusion = question.type === 'essay_conclusion';
  
  const currentAnswer = userAnswers[question.id] || (question.dragDropWords || question.progressivePhrases ? {} : '');
  
  // Check if this is a progressive phrase system or single phrase
  const isProgressivePhrases = question.progressivePhrases && Array.isArray(question.progressivePhrases);
  const isWordPlacement = isProgressivePhrases || (question.dragDropWords && question.dragDropWords.template);
  
  const getIcon = () => {
    if (isIntroduction) return <Lightbulb className="w-5 h-5" />;
    if (isDevelopment) return <FileText className="w-5 h-5" />;
    if (isConclusion) return <CheckCircle className="w-5 h-5" />;
  };
  
  const getColorClasses = () => {
    if (isIntroduction) return 'from-yellow-100 to-yellow-50 border-yellow-500 text-yellow-800';
    if (isDevelopment) return 'from-blue-100 to-blue-50 border-blue-500 text-blue-800';
    if (isConclusion) return 'from-green-100 to-green-50 border-green-500 text-green-800';
  };

  const resetPlacements = () => {
    onAnswerChange(question.id, {});
  };

  const checkIfAllSectionsCompleted = () => {
    const intro = allEssayQuestions.find(q => q.type === 'essay_introduction');
    const dev = allEssayQuestions.find(q => q.type === 'essay_development');
    const conc = allEssayQuestions.find(q => q.type === 'essay_conclusion');

    const isIntroCompleted = intro && isQuestionCompleted(intro, userAnswers[intro.id]);
    const isDevCompleted = dev && isQuestionCompleted(dev, userAnswers[dev.id]);
    const isConcCompleted = conc && isQuestionCompleted(conc, userAnswers[conc.id]);

    return isIntroCompleted && isDevCompleted && isConcCompleted;
  };

  const isQuestionCompleted = (q, answer) => {
    if (!answer) return false;

    if (q.progressivePhrases && Array.isArray(q.progressivePhrases)) {
      return q.progressivePhrases.every((phrase, index) => {
        const phraseAnswer = answer[index];
        if (!phraseAnswer) return false;
        
        const slots = phrase.template.match(/\[(\d+)\]/g) || [];
        return slots.every(slot => {
          const slotNumber = parseInt(slot.replace(/[\[\]]/g, ''));
          return phraseAnswer[slotNumber] !== undefined;
        });
      });
    } else if (q.dragDropWords && q.dragDropWords.template) {
      const slots = q.dragDropWords.template.match(/\[(\d+)\]/g) || [];
      return slots.every(slot => {
        const slotNumber = parseInt(slot.replace(/[\[\]]/g, ''));
        return answer[slotNumber] !== undefined;
      });
    } else {
      return typeof answer === 'string' && answer.trim().length > 0;
    }
  };

  const renderContent = () => {
    if (isProgressivePhrases) {
      return (
        <ProgressivePhrases
          question={question}
          showArabic={showArabic}
          currentAnswer={currentAnswer}
          onAnswerChange={onAnswerChange}
          showHelper={showHelper}
          toggleHelper={toggleHelper}
          checkedAnswers={checkedAnswers}
          onCheckAnswer={onCheckAnswer}
          isIntroduction={isIntroduction}
          isDevelopment={isDevelopment}
          isConclusion={isConclusion}
          getColorClasses={getColorClasses}
          getIcon={getIcon}
        />
      );
    }
    
    if (isWordPlacement) {
      return (
        <SingleWordPlacement
          question={question}
          showArabic={showArabic}
          currentAnswer={currentAnswer}
          onAnswerChange={onAnswerChange}
          showHelper={showHelper}
          toggleHelper={toggleHelper}
          resetPlacements={resetPlacements}
        />
      );
    }
    
    return (
      <TextArea
        question={question}
        showArabic={showArabic}
        currentAnswer={currentAnswer}
        onAnswerChange={onAnswerChange}
        showHelper={showHelper}
        toggleHelper={toggleHelper}
      />
    );
  };

  const showCompleteEssay = isConclusion && checkIfAllSectionsCompleted();
  const shouldHideQuestionBox = hideQuestionBox || isProgressivePhrases;

  return (
    <div className="space-y-6">
      {/* Show completion banner if all sections are done */}
      {showCompleteEssay && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-4 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <p className="font-bold text-lg">
              {showArabic 
                ? '🎉 رائع! لقد أكملت جميع أقسام المقال. اضغط على "التالي" لرؤية مقالك الكامل!' 
                : '🎉 Excellent ! Vous avez terminé toutes les sections. Cliquez sur "Suivant" pour voir votre essai complet !'}
            </p>
          </div>
        </div>
      )}
      
      {/* Only show question box if not progressive phrases and hideQuestionBox is false */}
      {!shouldHideQuestionBox && (
        <div className={`bg-gradient-to-r ${getColorClasses()} rounded-lg p-4 border-l-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getIcon()}
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${showArabic ? 'text-right' : ''}`}>
                  {showArabic && question.questionArabic ? question.questionArabic : question.question}
                </h3>
                {showArabic && question.questionArabic && (
                  <p className="text-sm opacity-75 text-left mt-1">
                    {question.question}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {question.points} {showArabic ? (question.points > 1 ? 'نقط' : 'نقطة') : (question.points > 1 ? 'points' : 'point')}
              </span>
              
              {question.helper && !isProgressivePhrases && (
                <button
                  onClick={() => toggleHelper && toggleHelper(question.id)}
                  className={`p-1 transition-colors ${
                    showHelper && showHelper[question.id]
                      ? 'text-blue-600 bg-blue-50 rounded'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title={showArabic ? 'مساعدة المفردات' : 'Aide vocabulaire'}
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!shouldHideQuestionBox && question.instruction && (
        <div className={`text-gray-700 ${showArabic ? 'text-right' : 'text-left'}`}>
          <p className="font-medium">
            {showArabic && question.instructionArabic ? question.instructionArabic : question.instruction}
          </p>
          {showArabic && question.instructionArabic && (
            <p className="text-sm text-gray-500 border-t pt-2 text-left mt-2">
              {question.instruction}
            </p>
          )}
        </div>
      )}

      {renderContent()}

      {showAnswers && showAnswers[question.id] && (
        <div className={`mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded ${showArabic ? 'border-r-4 border-l-0 text-right' : ''}`}>
          <p className="text-green-800 font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {showArabic ? 'الإجابة النموذجية:' : 'Réponse modèle :'}
          </p>
          <div className="text-green-700 mt-2 whitespace-pre-line">
            {showArabic && question.answerArabic ? question.answerArabic : question.answer}
          </div>
          {showArabic && question.answerArabic && question.answer && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-green-600 text-sm font-medium">English/French:</p>
              <div className="text-green-600 text-sm mt-1 whitespace-pre-line">
                {question.answer}
              </div>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EssaySection;