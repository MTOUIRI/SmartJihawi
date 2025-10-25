import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const WordPlacementQuestion = ({ 
  question, 
  showArabic, 
  userAnswers, 
  onAnswerChange 
}) => {
  const [draggedWord, setDraggedWord] = React.useState(null);
  const [availableWords, setAvailableWords] = React.useState([]);
  const [placedWords, setPlacedWords] = React.useState({});

  React.useEffect(() => {
    const allWords = question.dragDropWords?.words || [];
    const currentPlacedWords = userAnswers[question.id] || {};
    
    const usedWords = Object.values(currentPlacedWords);
    const remainingWords = allWords.filter(word => !usedWords.includes(word));
    
    setAvailableWords(remainingWords);
    setPlacedWords(currentPlacedWords);
  }, [question.id, userAnswers, question.dragDropWords?.words]);

  const templateParts = (question.dragDropWords?.template || question.answer || '').split(/\[(\d+)\]/);
  
  const handleDragStart = (e, word, wordIndex) => {
    setDraggedWord({ word, wordIndex, source: 'available' });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragStartFromPlaced = (e, word, slotIndex) => {
    setDraggedWord({ word, slotIndex, source: 'placed' });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnSlot = (e, slotIndex) => {
    e.preventDefault();
    if (!draggedWord) return;

    const newPlacedWords = { ...placedWords };
    const newAvailableWords = [...availableWords];

    if (draggedWord.source === 'available') {
      if (placedWords[slotIndex]) {
        newAvailableWords.push(placedWords[slotIndex]);
      }
      newAvailableWords.splice(draggedWord.wordIndex, 1);
      newPlacedWords[slotIndex] = draggedWord.word;
    } else if (draggedWord.source === 'placed') {
      if (placedWords[slotIndex]) {
        newPlacedWords[draggedWord.slotIndex] = placedWords[slotIndex];
      } else {
        delete newPlacedWords[draggedWord.slotIndex];
      }
      newPlacedWords[slotIndex] = draggedWord.word;
    }

    setAvailableWords(newAvailableWords);
    setPlacedWords(newPlacedWords);
    setDraggedWord(null);
    onAnswerChange(question.id, newPlacedWords);
  };

  const handleDropOnAvailable = (e) => {
    e.preventDefault();
    if (!draggedWord || draggedWord.source !== 'placed') return;

    const newPlacedWords = { ...placedWords };
    const newAvailableWords = [...availableWords];

    newAvailableWords.push(draggedWord.word);
    delete newPlacedWords[draggedWord.slotIndex];

    setAvailableWords(newAvailableWords);
    setPlacedWords(newPlacedWords);
    setDraggedWord(null);
    onAnswerChange(question.id, newPlacedWords);
  };

  const handleDoubleClick = (word, wordIndex) => {
    const emptySlot = templateParts.findIndex((part, index) => 
      index % 2 === 1 && !placedWords[parseInt(part)]
    );
    
    if (emptySlot !== -1) {
      const slotIndex = parseInt(templateParts[emptySlot]);
      const newPlacedWords = { ...placedWords };
      const newAvailableWords = [...availableWords];
      
      newAvailableWords.splice(wordIndex, 1);
      newPlacedWords[slotIndex] = word;
      
      setAvailableWords(newAvailableWords);
      setPlacedWords(newPlacedWords);
      onAnswerChange(question.id, newPlacedWords);
    }
  };

  const handleSlotDoubleClick = (slotIndex) => {
    if (placedWords[slotIndex]) {
      const newPlacedWords = { ...placedWords };
      const newAvailableWords = [...availableWords];
      
      newAvailableWords.push(placedWords[slotIndex]);
      delete newPlacedWords[slotIndex];
      
      setAvailableWords(newAvailableWords);
      setPlacedWords(newPlacedWords);
      onAnswerChange(question.id, newPlacedWords);
    }
  };

  const totalWords = question.dragDropWords?.words?.length || 0;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className={`font-medium text-gray-700 ${showArabic ? 'text-right' : 'text-left'}`}>
          {showArabic ? 'الكلمات المتاحة:' : 'Mots disponibles :'}
        </h4>
        <div 
          className="min-h-[80px] p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
          onDragOver={handleDragOver}
          onDrop={handleDropOnAvailable}
        >
          <div className={`flex flex-wrap gap-2 ${showArabic ? 'justify-end' : 'justify-start'}`}>
            {availableWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, word, index)}
                onDoubleClick={() => handleDoubleClick(word, index)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-move hover:shadow-md transition-shadow select-none text-gray-700 hover:bg-blue-50 hover:border-blue-300"
              >
                {word}
              </span>
            ))}
          </div>
          {availableWords.length === 0 && (
            <p className={`text-gray-500 text-center py-4 ${showArabic ? 'text-right' : 'text-left'}`}>
              {showArabic ? 'تم استخدام جميع الكلمات' : 'Tous les mots ont été utilisés'}
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
        <div className={`text-lg leading-relaxed ${showArabic ? 'text-right' : 'text-left'}`}>
          {templateParts.map((part, index) => {
            if (index % 2 === 0) {
              return <span key={index}>{part}</span>;
            } else {
              const slotIndex = parseInt(part);
              const placedWord = placedWords[slotIndex];
              
              return (
                <span
                  key={index}
                  className={`inline-block min-w-[100px] mx-1 px-3 py-1 border-2 border-dashed rounded transition-all ${
                    placedWord
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : 'bg-white border-gray-400 text-gray-400'
                  } ${draggedWord ? 'border-blue-400 bg-blue-50' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSlot(e, slotIndex)}
                  onDoubleClick={() => handleSlotDoubleClick(slotIndex)}
                >
                  {placedWord ? (
                    <span
                      draggable
                      onDragStart={(e) => handleDragStartFromPlaced(e, placedWord, slotIndex)}
                      className="cursor-move select-none"
                    >
                      {placedWord}
                    </span>
                  ) : (
                    <span className="select-none text-center block">___</span>
                  )}
                </span>
              );
            }
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {showArabic ? 'التقدم:' : 'Progression :'} {Object.keys(placedWords).length} / {totalWords}
        </span>
        {Object.keys(placedWords).length === totalWords && (
          <span className="text-green-600 font-medium">
            {showArabic ? 'مكتمل!' : 'Terminé!'}
          </span>
        )}
      </div>
    </div>
  );
};

const VocabularyHelper = ({ question, showArabic, showAnswers, showHelper, toggleHelper }) => {
  if (!question.helper || showAnswers[question.id]) return null;
  
  const isHelperVisible = showHelper[question.id];
  
  return (
    <div className="mt-4 border-t pt-4">
      <button
        onClick={() => toggleHelper(question.id)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-3"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="font-medium">
          {showArabic ? 'مساعدة المفردات' : 'Aide vocabulaire'}
        </span>
        {isHelperVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isHelperVisible && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className={`font-medium text-blue-800 mb-3 ${showArabic ? 'text-right' : 'text-left'}`}>
            {showArabic ? 'مفردات مفيدة:' : 'Vocabulaire utile :'}
          </h4>
          <div className="space-y-2">
            {question.helper.french.map((frenchWord, idx) => {
              const arabicWord = question.helper.arabic[idx] || '';
              return (
                <div key={idx} className={`flex items-center gap-3 p-2 bg-white rounded border ${showArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium min-w-0 flex-1 text-center">
                    {frenchWord}
                  </span>
                  <span className="text-blue-600 font-bold">↔</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium min-w-0 flex-1 text-center" dir="rtl">
                    {arabicWord}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const SubQuestionItem = ({ subQuestion, showArabic, showAnswers, questionId, userAnswer, onAnswerChange }) => {
  const currentAnswer = userAnswer?.[subQuestion.id] || '';
  
  return (
    <div className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
          {subQuestion.label}
        </div>
        <div className="flex-1">
          <div className={`font-medium text-gray-800 mb-2 ${showArabic ? 'text-right' : 'text-left'}`}>
            <p className="mb-1">
              {showArabic && subQuestion.questionArabic ? subQuestion.questionArabic : subQuestion.question}
            </p>
            {showArabic && subQuestion.questionArabic && (
              <p className="text-sm text-gray-500 border-t pt-1 text-left">
                {subQuestion.question}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>{subQuestion.points} {showArabic ? (subQuestion.points > 1 ? 'نقط' : 'نقطة') : (subQuestion.points > 1 ? 'points' : 'point')}</span>
          </div>

          {showAnswers[questionId] ? (
            <div className={`p-4 bg-green-50 border-l-4 border-green-500 rounded ${showArabic ? 'border-r-4 border-l-0 text-right' : ''}`}>
              <p className="text-green-800 font-medium mb-2">
                {showArabic ? 'الإجابة المقترحة:' : 'Réponse suggérée :'}
              </p>
              <p className="text-green-700 whitespace-pre-line">
                {showArabic && subQuestion.answerArabic ? subQuestion.answerArabic : subQuestion.answer}
              </p>
              {showArabic && subQuestion.answerArabic && (
                <p className="text-green-600 text-sm mt-3 pt-3 border-t border-green-200 text-left whitespace-pre-line">
                  {subQuestion.answer}
                </p>
              )}
            </div>
          ) : (
            <textarea
              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${showArabic ? 'text-right' : 'text-left'}`}
              rows={3}
              placeholder={showArabic ? "اكتب إجابتك هنا..." : "Écrivez votre réponse ici..."}
              value={currentAnswer}
              onChange={(e) => {
                const newAnswer = {...(userAnswer || {})};
                newAnswer[subQuestion.id] = e.target.value;
                onAnswerChange(questionId, newAnswer);
              }}
              dir={showArabic ? 'rtl' : 'ltr'}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TextQuestion = ({ 
  question, 
  showArabic, 
  showAnswers, 
  userAnswers, 
  onAnswerChange,
  showHelper,
  toggleHelper
}) => {
  // Check if this is a word placement question
  if (question.dragDropWords && !showAnswers[question.id]) {
    return (
      <div>
        <WordPlacementQuestion
          question={question}
          showArabic={showArabic}
          userAnswers={userAnswers}
          onAnswerChange={onAnswerChange}
        />
        <VocabularyHelper
          question={question}
          showArabic={showArabic}
          showAnswers={showAnswers}
          showHelper={showHelper}
          toggleHelper={toggleHelper}
        />
      </div>
    );
  }

  // Check if this question has sub-questions
  const hasSubQuestions = question.subQuestions && question.subQuestions.length > 0;

  // Calculate completion status for sub-questions
  const getCompletionStatus = () => {
    if (!hasSubQuestions) {
      const answer = userAnswers[question.id];
      return typeof answer === 'string' && answer.trim().length > 0;
    }
    
    const userAnswer = userAnswers[question.id] || {};
    const completedCount = question.subQuestions.filter(subQ => {
      const answer = userAnswer[subQ.id];
      return answer && answer.trim().length > 0;
    }).length;
    
    return {
      completed: completedCount,
      total: question.subQuestions.length,
      isComplete: completedCount === question.subQuestions.length
    };
  };

  const completionStatus = getCompletionStatus();

  // Render sub-questions if they exist
  if (hasSubQuestions) {
    return (
      <div className="space-y-4">
        {/* Progress indicator */}
        {!showAnswers[question.id] && typeof completionStatus === 'object' && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${showArabic ? 'text-right' : 'text-left'}`}>
                {showArabic ? 'تقدم الإجابة:' : 'Progression des réponses :'}
              </span>
              <span className="text-sm font-bold text-purple-700">
                {completionStatus.completed} / {completionStatus.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completionStatus.completed / completionStatus.total) * 100}%` }}
              />
            </div>
            {completionStatus.isComplete && (
              <div className="flex items-center gap-2 mt-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {showArabic ? 'اكتملت جميع الإجابات!' : 'Toutes les réponses sont complètes!'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Sub-questions */}
        <div className="space-y-4">
          {question.subQuestions.map((subQ) => (
            <SubQuestionItem
              key={subQ.id}
              subQuestion={subQ}
              showArabic={showArabic}
              showAnswers={showAnswers}
              questionId={question.id}
              userAnswer={userAnswers[question.id]}
              onAnswerChange={onAnswerChange}
            />
          ))}
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
  }

  // Regular text question (no sub-questions)
  return (
    <div>
      {showAnswers[question.id] ? (
        <div className={`p-4 bg-green-50 border-l-4 border-green-500 rounded ${showArabic ? 'border-r-4 border-l-0 text-right' : ''}`}>
          <p className="text-green-800 font-medium">
            {showArabic ? 'الإجابة المقترحة:' : 'Réponse suggérée :'}
          </p>
          <p className="text-green-700 mt-2 whitespace-pre-line">
            {showArabic && question.answerArabic ? question.answerArabic : question.answer}
          </p>
          {showArabic && question.answerArabic && (
            <p className="text-green-600 text-sm mt-3 pt-3 border-t border-green-200 text-left whitespace-pre-line">
              {question.answer}
            </p>
          )}
        </div>
      ) : (
        <textarea
          className={`w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${showArabic ? 'text-right' : 'text-left'}`}
          rows={question.type === 'essay' ? 6 : 4}
          placeholder={showArabic ? "اكتب إجابتك هنا..." : "Écrivez votre réponse ici..."}
          value={userAnswers[question.id] || ''}
          onChange={(e) => onAnswerChange(question.id, e.target.value)}
          dir={showArabic ? 'rtl' : 'ltr'}
        />
      )}
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

export default TextQuestion;