import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const WordPlacementQuestion = ({ 
  question, 
  showArabic, 
  userAnswers, 
  onAnswerChange 
}) => {
  const [draggedWord, setDraggedWord] = React.useState(null);
  const [availableWords, setAvailableWords] = React.useState([]);
  const [placedWords, setPlacedWords] = React.useState({});

  // Initialize states properly with useEffect to handle prop changes
  React.useEffect(() => {
    const allWords = question.dragDropWords?.words || [];
    const currentPlacedWords = userAnswers[question.id] || {};
    
    // Calculate which words are still available
    const usedWords = Object.values(currentPlacedWords);
    const remainingWords = allWords.filter(word => !usedWords.includes(word));
    
    setAvailableWords(remainingWords);
    setPlacedWords(currentPlacedWords);
  }, [question.id, userAnswers, question.dragDropWords?.words]);

  // Create the template with blanks
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
      // Moving from available words to slot
      if (placedWords[slotIndex]) {
        // If slot already has a word, return it to available words
        newAvailableWords.push(placedWords[slotIndex]);
      }
      // Remove word from available and place in slot
      newAvailableWords.splice(draggedWord.wordIndex, 1);
      newPlacedWords[slotIndex] = draggedWord.word;
    } else if (draggedWord.source === 'placed') {
      // Moving from one slot to another
      if (placedWords[slotIndex]) {
        // Swap words if target slot is occupied
        newPlacedWords[draggedWord.slotIndex] = placedWords[slotIndex];
      } else {
        // Clear the source slot
        delete newPlacedWords[draggedWord.slotIndex];
      }
      newPlacedWords[slotIndex] = draggedWord.word;
    }

    setAvailableWords(newAvailableWords);
    setPlacedWords(newPlacedWords);
    setDraggedWord(null);

    // Update parent component
    onAnswerChange(question.id, newPlacedWords);
  };

  const handleDropOnAvailable = (e) => {
    e.preventDefault();
    if (!draggedWord || draggedWord.source !== 'placed') return;

    const newPlacedWords = { ...placedWords };
    const newAvailableWords = [...availableWords];

    // Return word to available words
    newAvailableWords.push(draggedWord.word);
    delete newPlacedWords[draggedWord.slotIndex];

    setAvailableWords(newAvailableWords);
    setPlacedWords(newPlacedWords);
    setDraggedWord(null);

    onAnswerChange(question.id, newPlacedWords);
  };

  const handleDoubleClick = (word, wordIndex) => {
    // Find first empty slot
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

  // Calculate total words count for progress
  const totalWords = question.dragDropWords?.words?.length || 0;

  return (
    <div className="space-y-6">

      {/* Available words */}
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

      {/* Text with drop zones */}
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
        <div className={`text-lg leading-relaxed ${showArabic ? 'text-right' : 'text-left'}`}>
          {templateParts.map((part, index) => {
            if (index % 2 === 0) {
              // Regular text
              return <span key={index}>{part}</span>;
            } else {
              // Drop slot
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
                    <span className="select-none text-center block">
                      ___
                    </span>
                  )}
                </span>
              );
            }
          })}
        </div>
      </div>

      

      {/* Progress indicator */}
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

const TextQuestion = ({ 
  question, 
  showArabic, 
  showAnswers, 
  userAnswers, 
  onAnswerChange,
  showHelper,
  toggleHelper
}) => {
  // Check if this is a word placement question (has dragDropWords property)
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