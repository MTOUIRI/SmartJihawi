import React from 'react';
import { CheckCircle, Check, X, AlertCircle } from 'lucide-react';
import TextQuestion from './Question/TextQuestion';
import EssaySection from './Question/Essay/EssaySection';
import EssaySubject from './Question/EssaySubject';
import MatchingQuestion from './Question/MatchingQuestion';
import MultipleChoiceQuestion from './Question/MultipleChoiceQuestion';
import SingleChoiceQuestion from './Question/SingleChoiceQuestion';
import SingleChoiceGroupedQuestion from './Question/SingleChoiceGroupedQuestion';
import TableQuestion from './Question/TableQuestion';
import TrueFalseWithJustificationQuestion from './Question/TrueFalseWithJustif';
import SingleWordPlacement from './Question/Essay/SingleWordPlacement';

const QuestionRenderers = ({ 
  question, 
  showArabic, 
  showAnswers, 
  userAnswers, 
  onAnswerChange,
  showHelper,
  toggleHelper,
  checkedAnswers = {},
  onCheckAnswer,
  allUserAnswers = {},
  allQuestions = []
}) => {
  const validateAnswer = (question, userAnswer) => {
    if (!userAnswer) return { isCorrect: false, feedback: showArabic ? 'لم يتم تقديم إجابة' : 'Aucune réponse fournie' };

    switch (question.type) {
      case 'multiple_choice_single':
        if (question.subQuestions && question.subQuestions.length > 0) {
          if (!userAnswer || typeof userAnswer !== 'object') {
            return { isCorrect: false, feedback: showArabic ? 'إجابة غير مكتملة' : 'Réponse incomplète' };
          }
          
          const correctCount = question.subQuestions.filter(subQ => {
            return userAnswer[subQ.id] === subQ.answer;
          }).length;

          const isAllCorrect = correctCount === question.subQuestions.length;
          return {
            isCorrect: isAllCorrect,
            feedback: isAllCorrect 
              ? (showArabic ? 'جميع الإجابات صحيحة!' : 'Toutes les réponses sont correctes!')
              : (showArabic ? `${correctCount}/${question.subQuestions.length} إجابات صحيحة` : `${correctCount}/${question.subQuestions.length} réponses correctes`)
          };
        }
        
        return {
          isCorrect: userAnswer === question.answer,
          feedback: userAnswer === question.answer 
            ? (showArabic ? 'إجابة صحيحة!' : 'Bonne réponse!')
            : (showArabic ? 'إجابة خاطئة' : 'Réponse incorrecte')
        };

      case 'multiple_choice':
        if (!question.subQuestions || !userAnswer) return { isCorrect: false, feedback: showArabic ? 'إجابة غير مكتملة' : 'Réponse incomplète' };
        
        const correctCount = question.subQuestions.filter(subQ => {
          const expectedAnswer = subQ.answer === 'VRAI' || subQ.answer === 'صحيح';
          const userGaveAnswer = userAnswer[subQ.id];
          return userGaveAnswer === expectedAnswer;
        }).length;

        const isAllCorrect = correctCount === question.subQuestions.length;
        return {
          isCorrect: isAllCorrect,
          feedback: isAllCorrect 
            ? (showArabic ? 'جميع الإجابات صحيحة!' : 'Toutes les réponses sont correctes!')
            : (showArabic ? `${correctCount}/${question.subQuestions.length} إجابات صحيحة` : `${correctCount}/${question.subQuestions.length} réponses correctes`)
        };

      case 'multiple_choice_with_justification':
        if (!question.subQuestions || !userAnswer) return { isCorrect: false, feedback: showArabic ? 'إجابة غير مكتملة' : 'Réponse incomplète' };
        
        const correctAnswersWithJustification = question.subQuestions.filter(subQ => {
          const userSubAnswer = userAnswer[subQ.id];
          if (!userSubAnswer || typeof userSubAnswer !== 'object') return false;
          
          const expectedAnswer = subQ.answer === 'VRAI' || subQ.answer === 'صحيح';
          const hasCorrectAnswer = userSubAnswer.answer === expectedAnswer;
          const hasJustification = userSubAnswer.justification && userSubAnswer.justification.trim().length > 0;
          
          return hasCorrectAnswer && hasJustification;
        }).length;

        const isAllCorrectWithJustification = correctAnswersWithJustification === question.subQuestions.length;
        return {
          isCorrect: isAllCorrectWithJustification,
          feedback: isAllCorrectWithJustification 
            ? (showArabic ? 'جميع الإجابات والتبريرات صحيحة!' : 'Toutes les réponses et justifications sont correctes!')
            : (showArabic ? `${correctAnswersWithJustification}/${question.subQuestions.length} إجابات مكتملة` : `${correctAnswersWithJustification}/${question.subQuestions.length} réponses complètes`),
          isText: true
        };

      case 'matching':
        if (!question.matchingPairs || !userAnswer) return { isCorrect: false, feedback: showArabic ? 'إجابة غير مكتملة' : 'Réponse incomplète' };
        
        const correctMatches = question.matchingPairs.filter((pair, idx) => {
          const correctOption = question.options.find(opt => 
            (showArabic && opt.textArabic ? opt.textArabic : opt.text) === (showArabic && pair.rightArabic ? pair.rightArabic : pair.right)
          );
          return userAnswer[idx] === correctOption?.id;
        }).length;

        const isAllMatched = correctMatches === question.matchingPairs.length;
        return {
          isCorrect: isAllMatched,
          feedback: isAllMatched 
            ? (showArabic ? 'جميع المطابقات صحيحة!' : 'Toutes les correspondances sont correctes!')
            : (showArabic ? `${correctMatches}/${question.matchingPairs.length} مطابقات صحيحة` : `${correctMatches}/${question.matchingPairs.length} correspondances correctes`)
        };

      case 'table':
        if (!question.content?.answer || !userAnswer) return { isCorrect: false, feedback: showArabic ? 'إجابة غير مكتملة' : 'Réponse incomplète' };
        
        const correctCells = question.content.answer.filter((correctCell, idx) => {
          const userCell = userAnswer[idx];
          if (!userCell || typeof userCell !== 'string') return false;
          return userCell.toLowerCase().trim() === correctCell.toLowerCase().trim();
        }).length;

        const isTableComplete = correctCells === question.content.answer.length;
        return {
          isCorrect: isTableComplete,
          feedback: isTableComplete 
            ? (showArabic ? 'جدول مكتمل بشكل صحيح!' : 'Tableau complété correctement!')
            : (showArabic ? `${correctCells}/${question.content.answer.length} خلايا صحيحة` : `${correctCells}/${question.content.answer.length} cellules correctes`)
        };

      case 'word_placement':
        if (!question.dragDropWords || !userAnswer) return { isCorrect: false, feedback: showArabic ? 'إجابة غير مكتملة' : 'Réponse incomplète' };
        
        const template = question.dragDropWords.template || '';
        const slots = template.match(/\[(\d+)\]/g) || [];
        const expectedWords = question.dragDropWords.words || [];
        
        const filledSlots = Object.keys(userAnswer).length;
        if (filledSlots < slots.length) {
          return {
            isCorrect: false,
            feedback: showArabic 
              ? `${filledSlots}/${slots.length} كلمات موضوعة` 
              : `${filledSlots}/${slots.length} mots placés`
          };
        }
        
        let correctPlacements = 0;
        slots.forEach((slot, index) => {
          const slotIndex = parseInt(slot.replace(/[\[\]]/g, ''));
          const userWord = userAnswer[slotIndex];
          const expectedWord = expectedWords[index];
          
          if (userWord === expectedWord) {
            correctPlacements++;
          }
        });

        const isAllPlacementsCorrect = correctPlacements === slots.length;
        return {
          isCorrect: isAllPlacementsCorrect,
          feedback: isAllPlacementsCorrect 
            ? (showArabic ? 'جميع الكلمات في المكان الصحيح!' : 'Tous les mots sont placés correctement!')
            : (showArabic ? `${correctPlacements}/${slots.length} كلمات صحيحة` : `${correctPlacements}/${slots.length} mots corrects`)
        };

      case 'text':
      case 'essay':
        if (question.dragDropWords && typeof userAnswer === 'object') {
          const template = question.dragDropWords.template || '';
          const slots = template.match(/\[(\d+)\]/g) || [];
          const expectedWords = question.dragDropWords.words || [];
          
          if (question.answer && typeof question.answer === 'string') {
            let wordIndex = 0;
            const expectedPlacements = {};
            
            slots.forEach(slot => {
              const slotNumber = parseInt(slot.replace(/[\[\]]/g, ''));
              if (wordIndex < expectedWords.length) {
                expectedPlacements[slotNumber] = expectedWords[wordIndex];
                wordIndex++;
              }
            });
            
            let correctPlacements = 0;
            let totalSlots = slots.length;
            
            slots.forEach(slot => {
              const slotNumber = parseInt(slot.replace(/[\[\]]/g, ''));
              const userWord = userAnswer[slotNumber];
              const expectedWord = expectedPlacements[slotNumber];
              
              if (userWord && expectedWord && userWord === expectedWord) {
                correctPlacements++;
              }
            });
            
            const isAllCorrect = correctPlacements === totalSlots && Object.keys(userAnswer).length === totalSlots;
            
            return {
              isCorrect: isAllCorrect,
              feedback: isAllCorrect 
                ? (showArabic ? 'جميع الكلمات في المكان الصحيح!' : 'Tous les mots sont placés correctement!')
                : (showArabic ? `${correctPlacements}/${totalSlots} كلمات صحيحة` : `${correctPlacements}/${totalSlots} mots corrects`),
              isText: false
            };
          } else {
            const filledSlots = Object.keys(userAnswer).length;
            const isComplete = filledSlots === slots.length;
            
            return {
              isCorrect: isComplete,
              feedback: isComplete 
                ? (showArabic ? 'تم ملء جميع الفراغات!' : 'Tous les espaces sont remplis!')
                : (showArabic ? `${filledSlots}/${slots.length} فراغات مملوءة` : `${filledSlots}/${slots.length} espaces remplis`),
              isText: true
            };
          }
        }
        
        if (typeof userAnswer !== 'string') {
          return {
            isCorrect: false,
            feedback: showArabic ? 'نوع إجابة غير صحيح' : 'Type de réponse incorrect'
          };
        }
        
        const wordCount = userAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;
        const hasAnswer = wordCount > 0;
        
        return {
          isCorrect: hasAnswer,
          feedback: hasAnswer 
            ? (showArabic ? `تم تقديم إجابة (${wordCount} كلمة)` : `Réponse fournie (${wordCount} mots)`)
            : (showArabic ? 'لم يتم تقديم إجابة' : 'Aucune réponse fournie'),
          isText: true
        };

      default:
        return { isCorrect: false, feedback: showArabic ? 'نوع سؤال غير مدعوم' : 'Type de question non supporté' };
    }
  };

  const handleCheckAnswer = () => {
    const userAnswer = userAnswers[question.id];
    const validation = validateAnswer(question, userAnswer);
    if (onCheckAnswer) {
      onCheckAnswer(question.id, validation);
    }
  };

  const renderCheckAnswerSection = () => {
    const userAnswer = userAnswers[question.id];
    const isChecked = checkedAnswers[question.id];

    return (
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={handleCheckAnswer}
            disabled={!userAnswer || showAnswers[question.id]}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              !userAnswer || showAnswers[question.id]
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {showArabic ? 'تحقق من الإجابة' : 'Vérifier la réponse'}
          </button>

          {isChecked && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isChecked.isCorrect 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isChecked.isCorrect ? (
                <Check className="w-4 h-4" />
              ) : (
                isChecked.isText ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )
              )}
              <span className="text-sm font-medium">{isChecked.feedback}</span>
            </div>
          )}
        </div>

        {isChecked && isChecked.isText && (
          <div className={`mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg ${showArabic ? 'text-right' : 'text-left'}`}>
            <p className="text-amber-800 text-sm">
              {showArabic 
                ? '💡 هذا السؤال يتطلب تقييماً يدوياً. راجع الإجابة المقترحة للمقارنة.'
                : '💡 Cette question nécessite une évaluation manuelle. Consultez la réponse suggérée pour comparer.'
              }
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderQuestion = () => {
    if (question.type === 'essay_subject') {
      return (
        <EssaySubject 
          question={question}
          showArabic={showArabic}
        />
      );
    }
    
    if (['essay_introduction', 'essay_development', 'essay_conclusion'].includes(question.type)) {
      // Find all essay questions from the allQuestions array
      const essayQuestions = allQuestions.filter(q => 
        ['essay_introduction', 'essay_development', 'essay_conclusion'].includes(q.type)
      );
      
      return (
        <EssaySection
          question={question}
          showArabic={showArabic}
          showAnswers={showAnswers}
          userAnswers={allUserAnswers}
          onAnswerChange={onAnswerChange}
          showHelper={showHelper}
          toggleHelper={toggleHelper}
          checkedAnswers={checkedAnswers}
          onCheckAnswer={onCheckAnswer}
          allEssayQuestions={essayQuestions}
        />
      );
    }
    
    return (
      <>
        <div className={`text-lg text-gray-700 mb-6 ${showArabic ? 'text-right' : 'text-left'}`}>
          <p className="mb-2">
            {showArabic && question.questionArabic ? question.questionArabic : question.question}
          </p>
          {showArabic && question.questionArabic && (
            <p className="text-sm text-gray-500 border-t pt-2 text-left">
              {question.question}
            </p>
          )}
        </div>

        {question.type === 'table' && (
          <div>
            <TableQuestion
              question={question}
              showArabic={showArabic}
              showAnswers={showAnswers}
              userAnswers={userAnswers}
              onAnswerChange={onAnswerChange}
              showHelper={showHelper}
              toggleHelper={toggleHelper}
            />
            {!showAnswers[question.id] && renderCheckAnswerSection()}
          </div>
        )}
        
        {question.type === 'multiple_choice' && question.subQuestions && (
          <div>
            <MultipleChoiceQuestion
              question={question}
              showArabic={showArabic}
              showAnswers={showAnswers}
              userAnswers={userAnswers}
              onAnswerChange={onAnswerChange}
              showHelper={showHelper}
              toggleHelper={toggleHelper}
            />
            {!showAnswers[question.id] && renderCheckAnswerSection()}
          </div>
        )}
        
        {question.type === 'multiple_choice_with_justification' && question.subQuestions && (
          <div>
            <TrueFalseWithJustificationQuestion
              question={question}
              showArabic={showArabic}
              showAnswers={showAnswers}
              userAnswers={userAnswers}
              onAnswerChange={onAnswerChange}
              showHelper={showHelper}
              toggleHelper={toggleHelper}
            />
            {!showAnswers[question.id] && renderCheckAnswerSection()}
          </div>
        )}
        
        {question.type === 'multiple_choice_single' && (
          <div>
            {question.subQuestions && question.subQuestions.length > 0 ? (
              <SingleChoiceGroupedQuestion
                question={question}
                showArabic={showArabic}
                showAnswers={showAnswers}
                userAnswers={userAnswers}
                onAnswerChange={onAnswerChange}
                showHelper={showHelper}
                toggleHelper={toggleHelper}
              />
            ) : (
              <SingleChoiceQuestion
                question={question}
                showArabic={showArabic}
                showAnswers={showAnswers}
                userAnswers={userAnswers}
                onAnswerChange={onAnswerChange}
                showHelper={showHelper}
                toggleHelper={toggleHelper}
              />
            )}
            {!showAnswers[question.id] && renderCheckAnswerSection()}
          </div>
        )}
        
        {question.type === 'matching' && (
          <div>
            <MatchingQuestion
              question={question}
              showArabic={showArabic}
              showAnswers={showAnswers}
              userAnswers={userAnswers}
              onAnswerChange={onAnswerChange}
              showHelper={showHelper}
              toggleHelper={toggleHelper}
            />
            {!showAnswers[question.id] && renderCheckAnswerSection()}
          </div>
        )}

        {question.type === 'word_placement' && question.dragDropWords && (
          <div>
            <SingleWordPlacement
              question={question}
              showArabic={showArabic}
              currentAnswer={userAnswers[question.id] || {}}
              onAnswerChange={onAnswerChange}
              showHelper={showHelper}
              toggleHelper={toggleHelper}
              resetPlacements={() => onAnswerChange(question.id, {})}
            />
          </div>
        )}
        
        {(question.type === 'text' || question.type === 'essay') && (
          <div>
            <TextQuestion
              question={question}
              showArabic={showArabic}
              showAnswers={showAnswers}
              userAnswers={userAnswers}
              onAnswerChange={onAnswerChange}
              showHelper={showHelper}
              toggleHelper={toggleHelper}
            />
            {!showAnswers[question.id] && renderCheckAnswerSection()}
          </div>
        )}
      </>
    );
  };

  return renderQuestion();
};

export default QuestionRenderers;