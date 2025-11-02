
import React, { useState, useEffect, useMemo } from 'react';
import { Check, CheckCircle, X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, AlertCircle, HelpCircle, Sparkles, Trophy, Zap, Star, Volume2, VolumeX, Eye, EyeOff, RotateCcw } from 'lucide-react';

// Utility function to shuffle an array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ProgressivePhrases = ({
  question,
  showArabic,
  currentAnswer,
  onAnswerChange,
  showHelper,
  toggleHelper,
  checkedAnswers,
  onCheckAnswer,
  isIntroduction,
  isDevelopment,
  isConclusion,
  getColorClasses,
  getIcon
}) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [verifiedPhrases, setVerifiedPhrases] = useState(new Set());
  const [showFinalAnswer, setShowFinalAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [phraseValidation, setPhraseValidation] = useState({});

  // Shuffle words for each phrase once when component mounts or question changes
  const shuffledPhraseWords = useMemo(() => {
    return question.progressivePhrases.map(phrase => shuffleArray(phrase.words));
  }, [question.progressivePhrases]);

  // Get current phrase
  const currentPhrase = question.progressivePhrases[currentPhraseIndex];

  // Shuffle helper words to prevent pattern recognition
  const shuffledHelperWords = useMemo(() => {
    if (!currentPhrase.helper?.french) return null;
    
    const combined = currentPhrase.helper.french.map((french, index) => ({
      french,
      arabic: currentPhrase.helper.arabic?.[index] || ''
    }));
    
    return shuffleArray(combined);
  }, [currentPhrase]);

  // Reset state when question changes
  useEffect(() => {
    setCurrentPhraseIndex(0);
    setVerifiedPhrases(new Set());
    setShowFinalAnswer(false);
    setSelectedWord(null);
    setShowAnswer(false);
    setPhraseValidation({});
    stopSpeaking();
  }, [question.id]);

  const handleWordClick = (word) => {
    if (verifiedPhrases.has(currentPhraseIndex)) return;
    setSelectedWord(word);
    // Speak the word when selected
    speakWord(word);
  };

  const speakWord = (word) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSlotClick = (slotIndex) => {
    if (verifiedPhrases.has(currentPhraseIndex)) return;
    if (!selectedWord) return;

    const updatedAnswer = { ...currentAnswer };
    
    if (!updatedAnswer[currentPhraseIndex]) {
      updatedAnswer[currentPhraseIndex] = {};
    }
    
    // Remove word from other slots in the same phrase
    Object.keys(updatedAnswer[currentPhraseIndex]).forEach(slot => {
      if (updatedAnswer[currentPhraseIndex][slot] === selectedWord) {
        delete updatedAnswer[currentPhraseIndex][slot];
      }
    });
    
    updatedAnswer[currentPhraseIndex][slotIndex] = selectedWord;
    onAnswerChange(question.id, updatedAnswer);
    setSelectedWord(null);
  };

  const removeWord = (slotIndex) => {
    const updatedAnswer = { ...currentAnswer };
    
    if (updatedAnswer[currentPhraseIndex]) {
      delete updatedAnswer[currentPhraseIndex][slotIndex];
      if (Object.keys(updatedAnswer[currentPhraseIndex]).length === 0) {
        delete updatedAnswer[currentPhraseIndex];
      }
    }
    
    onAnswerChange(question.id, updatedAnswer);
  };

  const isPhraseCompleted = (phraseIndex) => {
    const phrase = question.progressivePhrases[phraseIndex];
    const template = phrase.template;
    const slots = template.match(/\[(\d+)\]/g) || [];
    const userPhraseAnswer = currentAnswer[phraseIndex] || {};
    
    return slots.every(slot => {
      const slotNumber = parseInt(slot.replace(/[\[\]]/g, ''));
      return userPhraseAnswer[slotNumber] !== undefined;
    });
  };

  const validatePhrase = (phraseIndex) => {
    const phrase = question.progressivePhrases[phraseIndex];
    const expectedWords = phrase.words;
    const userPhraseAnswer = currentAnswer[phraseIndex] || {};
    const slots = phrase.template.match(/\[(\d+)\]/g) || [];
    
    let correctCount = 0;
    const slotResults = {};
    
    slots.forEach((slot, index) => {
      const slotNumber = parseInt(slot.replace(/[\[\]]/g, ''));
      const userWord = userPhraseAnswer[slotNumber];
      const expectedWord = expectedWords[index];
      
      const isCorrect = userWord === expectedWord;
      slotResults[slotNumber] = isCorrect;
      
      if (isCorrect) {
        correctCount++;
      }
    });
    
    const isCorrect = correctCount === slots.length;
    
    return {
      isCorrect,
      correctCount,
      totalCount: slots.length,
      slotResults,
      feedback: isCorrect 
        ? (showArabic ? 'الجملة صحيحة!' : 'Phrase correcte!')
        : (showArabic ? `${correctCount}/${slots.length} كلمات صحيحة` : `${correctCount}/${slots.length} mots corrects`)
    };
  };

  const handleVerifyPhrase = () => {
    const validation = validatePhrase(currentPhraseIndex);
    
    setPhraseValidation(prev => ({
      ...prev,
      [currentPhraseIndex]: validation
    }));
    
    if (validation.isCorrect) {
      const newVerified = new Set(verifiedPhrases);
      newVerified.add(currentPhraseIndex);
      setVerifiedPhrases(newVerified);
      
      setScore(prev => prev + (validation.totalCount * 10));
      setStreak(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      if (currentPhraseIndex === question.progressivePhrases.length - 1) {
        setShowFinalAnswer(true);
      } else {
        setTimeout(() => {
          setCurrentPhraseIndex(currentPhraseIndex + 1);
          setPhraseValidation(prev => {
            const newValidation = { ...prev };
            delete newValidation[currentPhraseIndex];
            return newValidation;
          });
        }, 2000);
      }
    } else {
      setStreak(0);
    }
    
    const phraseCheckKey = `${question.id}-phrase-${currentPhraseIndex}`;
    if (onCheckAnswer) {
      onCheckAnswer(phraseCheckKey, validation);
    }
  };

  const getAvailableWords = (phraseIndex) => {
    const placedWords = Object.values(currentAnswer[phraseIndex] || {});
    return shuffledPhraseWords[phraseIndex].filter(word => !placedWords.includes(word));
  };

  const moveToNextPhrase = () => {
    if (verifiedPhrases.has(currentPhraseIndex) && currentPhraseIndex < question.progressivePhrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    }
  };

  const moveToPreviousPhrase = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(currentPhraseIndex - 1);
    }
  };

  const resetAll = () => {
    setCurrentPhraseIndex(0);
    setVerifiedPhrases(new Set());
    setShowFinalAnswer(false);
    setScore(0);
    setStreak(0);
    setSelectedWord(null);
    setShowAnswer(false);
    setPhraseValidation({});
    stopSpeaking();
    onAnswerChange(question.id, {});
  };

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const getSectionColor = () => {
    if (isIntroduction) return 'from-indigo-500 via-blue-500 to-cyan-500';
    if (isDevelopment) return 'from-teal-500 via-emerald-500 to-green-500';
    if (isConclusion) return 'from-violet-500 via-purple-500 to-fuchsia-500';
    return 'from-purple-500 via-pink-500 to-rose-500';
  };

  const getSectionBgColor = () => {
    if (isIntroduction) return 'from-indigo-50 to-blue-50';
    if (isDevelopment) return 'from-teal-50 to-emerald-50';
    if (isConclusion) return 'from-violet-50 to-purple-50';
    return 'from-purple-50 to-pink-50';
  };

  const getSectionBorderColor = () => {
    if (isIntroduction) return 'border-blue-200';
    if (isDevelopment) return 'border-emerald-200';
    if (isConclusion) return 'border-purple-200';
    return 'border-purple-200';
  };

  const getSectionTextColor = () => {
    if (isIntroduction) return 'blue';
    if (isDevelopment) return 'emerald';
    if (isConclusion) return 'purple';
    return 'purple';
  };

  const handleTryAgain = () => {
    setPhraseValidation(prev => {
      const newValidation = { ...prev };
      delete newValidation[currentPhraseIndex];
      return newValidation;
    });
  };

  const template = currentPhrase.template;
  const availableWords = getAvailableWords(currentPhraseIndex);
  const isCurrentPhraseVerified = verifiedPhrases.has(currentPhraseIndex);
  const isPhraseComplete = isPhraseCompleted(currentPhraseIndex);
  const totalPhrases = question.progressivePhrases.length;
  const overallProgress = (verifiedPhrases.size / totalPhrases) * 100;
  const currentValidation = phraseValidation[currentPhraseIndex];
  const sectionColor = getSectionTextColor();

  // Parse template
  const parts = [];
  let lastIndex = 0;
  const regex = /\[(\d+)\]/g;
  let match;
  
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: template.substring(lastIndex, match.index)
      });
    }
    
    const slotIndex = parseInt(match[1]);
    const userPhraseAnswer = currentAnswer[currentPhraseIndex] || {};
    parts.push({
      type: 'slot',
      slotIndex: slotIndex,
      word: userPhraseAnswer[slotIndex] || null
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < template.length) {
    parts.push({
      type: 'text',
      content: template.substring(lastIndex)
    });
  }

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="space-y-3 sm:space-y-4 relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" />
            </div>
          ))}
        </div>
      )}

      {/* Progress & Stats Header - Responsive */}
      <div className={`bg-gradient-to-r ${getSectionColor()} rounded-lg sm:rounded-xl shadow-md text-white`}>
        <div className="p-3 sm:p-4 md:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-base sm:text-lg font-bold">{score}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-base sm:text-lg font-bold">{streak} 🔥</span>
              </div>
            </div>

            <div className="text-sm sm:text-base font-bold">
              {verifiedPhrases.size} / {totalPhrases}
            </div>

            <button
              onClick={resetAll}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all text-xs sm:text-sm font-medium"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{showArabic ? 'إعادة' : 'Reset'}</span>
              <span className="sm:hidden">↻</span>
            </button>
          </div>

          <div className="mt-2 sm:mt-3 h-2 sm:h-2.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500 ease-out rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Motivational Message */}
        {overallProgress > 0 && overallProgress < 100 && (
          <div className="px-3 sm:px-5 pb-2 sm:pb-3 text-center text-xs sm:text-sm opacity-90">
            {overallProgress < 30 && (showArabic ? '🌱 بداية رائعة!' : '🌱 Super début!')}
            {overallProgress >= 30 && overallProgress < 70 && (showArabic ? '💪 استمر!' : '💪 Continue!')}
            {overallProgress >= 70 && overallProgress < 100 && (showArabic ? '🚀 تقريبا!' : '🚀 Presque fini!')}
          </div>
        )}

        {overallProgress === 100 && (
          <div className="px-3 sm:px-5 pb-2 sm:pb-3 text-center text-sm sm:text-base font-bold">
            🎉 {showArabic ? 'ممتاز!' : 'Excellent!'}
          </div>
        )}
      </div>

      {/* Phrase Navigation - Responsive */}
      <div className={`bg-gradient-to-br ${getSectionBgColor()} rounded-lg sm:rounded-xl p-3 sm:p-4 border ${getSectionBorderColor()} shadow-sm`}>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={moveToPreviousPhrase}
            disabled={currentPhraseIndex === 0}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white rounded-lg hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium hidden sm:inline">{showArabic ? 'السابقة' : 'Précédente'}</span>
            <span className="font-medium sm:hidden">{showArabic ? 'السابق' : 'Préc'}</span>
          </button>
          
          <div className="text-center">
            <p className="text-lg sm:text-xl font-bold">{currentPhraseIndex + 1} / {totalPhrases}</p>
          </div>
          
          <button
            onClick={moveToNextPhrase}
            disabled={!verifiedPhrases.has(currentPhraseIndex) || currentPhraseIndex >= totalPhrases - 1}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${getSectionColor()} text-white rounded-lg hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm`}
          >
            <span className="font-medium hidden sm:inline">{showArabic ? 'التالية' : 'Suivante'}</span>
            <span className="font-medium sm:hidden">{showArabic ? 'التالي' : 'Suiv'}</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3">
          {question.progressivePhrases.map((_, index) => {
            const isVerified = verifiedPhrases.has(index);
            const isCurrent = index === currentPhraseIndex;
            
            return (
              <div
                key={index}
                className={`flex-1 h-2 sm:h-2.5 rounded-full transition-all ${
                  isVerified 
                    ? 'bg-green-500' 
                    : isCurrent 
                      ? `bg-gradient-to-r ${getSectionColor()}` 
                      : 'bg-gray-200'
                }`}
              >
                {isVerified && (
                  <div className="h-full flex items-center justify-center">
                    <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Phrase Template - Always Left-Aligned (French text) */}
      <div className={`bg-gradient-to-br ${getSectionBgColor()} border ${getSectionBorderColor()} rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-sm text-left`}>
        <div className="text-sm sm:text-base md:text-lg leading-loose sm:leading-relaxed">
          {parts.map((part, index) => {
            if (part.type === 'text') {
              return <span key={index} className="text-gray-800">{part.content}</span>;
            } else {
              const isClickable = !isCurrentPhraseVerified && !currentValidation && selectedWord;
              const isCorrectSlot = currentValidation?.slotResults?.[part.slotIndex];
              const isIncorrectSlot = currentValidation && !currentValidation.slotResults?.[part.slotIndex] && part.word;
              
              return (
                <span
                  key={index}
                  onClick={() => isClickable && handleSlotClick(part.slotIndex)}
                  className={`relative inline-flex items-center min-w-[80px] sm:min-w-[100px] md:min-w-[120px] mx-1 my-1 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2.5 border rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300 transform text-xs sm:text-sm md:text-base align-middle
                    ${part.word 
                      ? isCurrentPhraseVerified || isCorrectSlot
                        ? 'border-green-500 bg-gradient-to-r from-green-100 to-green-50 text-green-800 shadow-sm'
                        : isIncorrectSlot
                          ? 'border-red-500 bg-gradient-to-r from-red-100 to-red-50 text-red-800 shadow-sm'
                          : `border-${sectionColor}-500 bg-gradient-to-r from-${sectionColor}-100 to-${sectionColor}-50 text-${sectionColor}-800 shadow-sm hover:shadow-md hover:scale-105`
                      : isClickable
                        ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-md cursor-pointer hover:scale-105 border-dashed'
                        : 'border-gray-300 bg-white border-dashed hover:border-gray-400 hover:bg-gray-50 cursor-default'
                    }
                  `}
                >
                  {part.word ? (
                    <span className="flex items-center justify-between gap-1 sm:gap-2 w-full">
                      <span className="font-medium flex-1 truncate text-xs sm:text-sm md:text-base">{part.word}</span>
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        {(isCurrentPhraseVerified || isCorrectSlot) && (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        )}
                        {isIncorrectSlot && (
                          <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                        )}
                        {!isCurrentPhraseVerified && !currentValidation && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWord(part.slotIndex);
                            }}
                            className="p-0.5 sm:p-1 hover:bg-red-100 rounded transition-colors group"
                          >
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-red-500 group-hover:text-red-700" />
                          </button>
                        )}
                      </div>
                    </span>
                  ) : (
                    <span className="text-gray-400 text-center block w-full font-medium text-xs sm:text-sm md:text-base">
                      {isClickable ? '✨' : part.slotIndex}
                    </span>
                  )}
                </span>
              );
            }
          })}
        </div>
      </div>

      {/* Word Bank - Responsive */}
      {!isCurrentPhraseVerified && availableWords.length > 0 && (
        <div className={`bg-gradient-to-br ${getSectionBgColor()} rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border ${getSectionBorderColor()} shadow-sm`}>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h4 className={`text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2 ${showArabic ? 'text-right flex-row-reverse' : 'text-left'}`}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              {showArabic ? 'بنك الكلمات' : 'Banque de mots'}
            </h4>
            <span className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full bg-${sectionColor}-100 text-${sectionColor}-600`}>
              {availableWords.length}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {availableWords.map((word, index) => (
              <button
                key={`${word}-${index}`}
                onClick={() => handleWordClick(word)}
                className={`
                  px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r text-white rounded-lg sm:rounded-xl 
                  transition-all duration-300 select-none font-medium shadow-md text-xs sm:text-sm
                  hover:shadow-lg hover:scale-105 active:scale-95
                  ${selectedWord === word 
                    ? 'from-yellow-500 to-amber-500 ring-2 sm:ring-3 ring-yellow-300 scale-105' 
                    : `${isIntroduction ? 'from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600' : isDevelopment ? 'from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600' : 'from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600'}`
                  }
                `}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Verify Button - Responsive */}
      {!isCurrentPhraseVerified && isPhraseComplete && !currentValidation && (
        <div className="flex justify-center">
          <button
            onClick={handleVerifyPhrase}
            className={`flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r ${getSectionColor()} text-white rounded-lg sm:rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-bold text-sm sm:text-base`}
          >
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{showArabic ? 'تحقق من الجملة' : 'Vérifier la phrase'}</span>
            <span className="sm:hidden">{showArabic ? 'تحقق' : 'Vérifier'}</span>
          </button>
        </div>
      )}

      {/* Try Again Button - Responsive */}
      {currentValidation && !currentValidation.isCorrect && (
        <div className="flex justify-center">
          <button
            onClick={handleTryAgain}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r ${getSectionColor()} text-white rounded-lg sm:rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-semibold text-sm sm:text-base`}
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            {showArabic ? 'حاول مرة أخرى' : 'Réessayer'}
          </button>
        </div>
      )}

      {/* Validation Result - Responsive */}
      {checkedAnswers[`${question.id}-phrase-${currentPhraseIndex}`] && (
        <div className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 ${
          checkedAnswers[`${question.id}-phrase-${currentPhraseIndex}`].isCorrect
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {checkedAnswers[`${question.id}-phrase-${currentPhraseIndex}`].isCorrect ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            )}
            <span className={`font-medium text-xs sm:text-sm ${
              checkedAnswers[`${question.id}-phrase-${currentPhraseIndex}`].isCorrect
                ? 'text-green-800'
                : 'text-red-800'
            }`}>
              {checkedAnswers[`${question.id}-phrase-${currentPhraseIndex}`].feedback}
            </span>
          </div>
        </div>
      )}

      {/* Complete Answer Display - Responsive */}
      {showFinalAnswer && (question.answer || question.answerArabic) && (
        <div className="border-t pt-3 sm:pt-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => {
                setShowAnswer(!showAnswer);
                if (showAnswer) stopSpeaking();
              }}
              className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r ${getSectionColor()} text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all text-sm sm:text-base`}
            >
              {showAnswer ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span className="font-semibold">
                {showAnswer 
                  ? (showArabic ? 'إخفاء' : 'Masquer')
                  : (showArabic ? 'عرض الإجابة' : 'Afficher')
                }
              </span>
            </button>

            {showAnswer && question.answer && (
              <button
                onClick={() => speakText(question.answer)}
                className={`flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all shadow-md text-sm sm:text-base ${
                  isSpeaking 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                } text-white`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span className="font-semibold">
                  {isSpeaking ? (showArabic ? 'إيقاف' : 'Stop') : (showArabic ? 'استمع' : 'Écouter')}
                </span>
              </button>
            )}
          </div>

          {showAnswer && (
            <div className={`mt-3 sm:mt-4 p-4 sm:p-5 bg-gradient-to-br ${getSectionBgColor()} border ${getSectionBorderColor()} rounded-lg sm:rounded-xl shadow-md`}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <h4 className={`font-bold text-gray-900 text-sm sm:text-base ${showArabic ? 'text-right' : 'text-left'}`}>
                  {showArabic ? 'الإجابة الكاملة' : 'Réponse complète'}
                </h4>
              </div>
              
              {!showArabic && question.answer && (
                <div className="mb-3 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                    {question.answer}
                  </p>
                </div>
              )}
              
              {showArabic && question.answerArabic && (
                <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 text-right shadow-sm" dir="rtl">
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                    {question.answerArabic}
                  </p>
                </div>
              )}

              {!showArabic && question.answerArabic && (
                <div className="mt-3 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 text-right shadow-sm" dir="rtl">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 text-left" dir="ltr">
                    Version arabe :
                  </p>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                    {question.answerArabic}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

{/* Vocabulary Helper - Responsive */}
{currentPhrase.helper && (
  <div className="border-t-2 border-gray-200 pt-3 sm:pt-4 md:pt-6">
    <button
      onClick={() => toggleHelper && toggleHelper(`${question.id}-phrase-${currentPhraseIndex}`)}
      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
    >
      <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="font-semibold">
        {showArabic ? 'مساعدة المفردات' : 'Aide vocabulaire'}
      </span>
      {showHelper && showHelper[`${question.id}-phrase-${currentPhraseIndex}`] ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
    </button>
    
    {showHelper && showHelper[`${question.id}-phrase-${currentPhraseIndex}`] && (() => {
      // Create array of helper words - ensure we only take as many as exist
      const frenchWords = currentPhrase.helper.french || [];
      const arabicWords = currentPhrase.helper.arabic || [];
      
      // Only create pairs for the minimum length to avoid undefined values
      const minLength = Math.min(frenchWords.length, arabicWords.length);
      const helperWords = [];
      
      for (let i = 0; i < minLength; i++) {
        if (frenchWords[i] && arabicWords[i]) {
          helperWords.push({
            french: frenchWords[i],
            arabic: arabicWords[i]
          });
        }
      }
      
      // Shuffle the array
      const shuffledWords = [...helperWords].sort(() => Math.random() - 0.5);
      
      return (
        <div className="mt-3 sm:mt-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-blue-200 shadow-lg animate-fadeIn">
          <h4 className={`font-bold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base md:text-lg ${showArabic ? 'text-right flex-row-reverse' : 'text-left'}`}>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            {showArabic ? 'مفردات مفيدة' : 'Vocabulaire utile'}
          </h4>
          
          <div className="space-y-2 sm:space-y-3">
            {shuffledWords.map((item, idx) => (
              <div key={idx} className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-all hover:shadow-md ${showArabic ? 'flex-row-reverse' : ''}`}>
                <span className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs sm:text-sm font-semibold text-center shadow-sm flex-1 min-w-0">
                  <span className="block truncate">{item.french}</span>
                </span>
                <span className="text-blue-600 font-bold text-sm sm:text-base md:text-lg flex-shrink-0">↔</span>
                <span className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs sm:text-sm font-semibold text-center shadow-sm flex-1 min-w-0" dir="rtl">
                  <span className="block truncate">{item.arabic}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    })()}
  </div>
)}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-confetti {
          animation: confetti 3s ease-in-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProgressivePhrases;