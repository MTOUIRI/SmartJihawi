import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, RotateCcw, X, Eye, EyeOff, HelpCircle, ChevronUp, ChevronDown, Sparkles, Trophy, Zap, Star, Volume2, VolumeX } from 'lucide-react';

const SingleWordPlacement = ({
  question,
  showArabic,
  currentAnswer,
  onAnswerChange,
  showHelper,
  toggleHelper,
  resetPlacements
}) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [celebrateSlot, setCelebrateSlot] = useState(null);
  const [shakeSlot, setShakeSlot] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedWord(null);
    setShowAnswer(false);
    setCelebrateSlot(null);
    setShakeSlot(null);
    setIsVerified(false);
    setVerificationResult({});
    stopSpeaking();
  }, [question.id]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffledWords = useMemo(() => {
    return shuffleArray(question.dragDropWords.words);
  }, [question.dragDropWords.words]);

  const shuffledHelperWords = useMemo(() => {
    if (!question.helper?.french) return null;
    
    const combined = question.helper.french.map((french, index) => ({
      french,
      arabic: question.helper.arabic?.[index] || ''
    }));
    
    return shuffleArray(combined);
  }, [question.helper]);

  const template = question.dragDropWords.template;
  
 const handleWordClick = (word) => {
    if (isVerified) return;
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
    if (isVerified) return;
    
    if (!selectedWord) return;

    const updatedAnswer = { ...currentAnswer };
    
    // Remove word from other slots
    Object.keys(updatedAnswer).forEach(slot => {
      if (updatedAnswer[slot] === selectedWord) {
        delete updatedAnswer[slot];
      }
    });
    
    updatedAnswer[slotIndex] = selectedWord;
    onAnswerChange(question.id, updatedAnswer);
    
    // Reset verification when answer changes
    setIsVerified(false);
    setVerificationResult({});
    setSelectedWord(null);
  };

  const removeWord = (slotIndex) => {
    const updatedAnswer = { ...currentAnswer };
    delete updatedAnswer[slotIndex];
    onAnswerChange(question.id, updatedAnswer);
    setIsVerified(false);
    setVerificationResult({});
  };

  const getAvailableWords = () => {
    const placedWords = Object.values(currentAnswer);
    return shuffledWords.filter(word => !placedWords.includes(word));
  };

  const validateAnswer = () => {
    const template = question.dragDropWords.template;
    const slots = template.match(/\[(\d+)\]/g) || [];
    const expectedWords = question.dragDropWords.words;
    
    if (Object.keys(currentAnswer).length < slots.length) {
      return { isComplete: false, correctCount: 0, results: {} };
    }
    
    let correctCount = 0;
    const results = {};
    
    slots.forEach((slot, index) => {
      const slotIndex = parseInt(slot.replace(/[\[\]]/g, ''));
      const userWord = currentAnswer[slotIndex];
      const expectedWord = expectedWords[index];
      const isCorrect = userWord === expectedWord;
      
      results[slotIndex] = isCorrect;
      if (isCorrect) correctCount++;
    });
    
    return { 
      isComplete: true, 
      isCorrect: correctCount === slots.length,
      correctCount,
      totalCount: slots.length,
      results 
    };
  };

  const handleVerifyAnswer = () => {
    const validation = validateAnswer();
    
    if (!validation.isComplete) return;
    
    setIsVerified(true);
    setVerificationResult(validation);
    
    if (validation.isCorrect) {
      setScore(prev => prev + (validation.totalCount * 10));
      setStreak(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setStreak(0);
    }
  };

  const handleTryAgain = () => {
    setIsVerified(false);
    setVerificationResult({});
  };

  const speakText = (text) => {
    // Stop any ongoing speech
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
    parts.push({
      type: 'slot',
      slotIndex: slotIndex,
      word: currentAnswer[slotIndex] || null
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < template.length) {
    parts.push({
      type: 'text',
      content: template.substring(lastIndex)
    });
  }

  const totalSlots = (template.match(/\[(\d+)\]/g) || []).length;
  const filledSlots = Object.keys(currentAnswer).length;
  const availableWords = getAvailableWords();
  const isHelperVisible = showHelper && showHelper[question.id];
  const allSlotsFilled = filledSlots === totalSlots;
  const progress = (filledSlots / totalSlots) * 100;

  // Trigger confetti when completed correctly
  useEffect(() => {
    if (isVerified && verificationResult.isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isVerified, verificationResult]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 relative">
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

      {/* Progress & Stats Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg text-white">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 sm:p-3">
              <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm opacity-90">{showArabic ? 'النقاط' : 'Score'}</p>
              <p className="text-lg sm:text-2xl font-bold">{score}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 sm:p-3">
              <Zap className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm opacity-90">{showArabic ? 'السلسلة' : 'Série'}</p>
              <p className="text-lg sm:text-2xl font-bold">{streak} 🔥</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetPlacements();
              setScore(0);
              setStreak(0);
              setIsVerified(false);
              setVerificationResult({});
              setSelectedWord(null);
              stopSpeaking();
            }}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all text-sm sm:text-base"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium hidden sm:inline">{showArabic ? 'إعادة' : 'Reset'}</span>
            <span className="font-medium sm:hidden">↻</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span>{showArabic ? 'التقدم' : 'Progression'}</span>
            <span className="font-bold">{filledSlots} / {totalSlots}</span>
          </div>
          <div className="h-2 sm:h-3 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500 ease-out rounded-full shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Motivational Message */}
        {progress > 0 && progress < 100 && (
          <div className="mt-2 sm:mt-3 text-center text-xs sm:text-sm opacity-90">
            {progress < 30 && (showArabic ? '🌱 بداية رائعة!' : '🌱 Super début!')}
            {progress >= 30 && progress < 70 && (showArabic ? '💪 استمر!' : '💪 Continue comme ça!')}
            {progress >= 70 && progress < 100 && (showArabic ? '🚀 تقريبا انتهيت!' : '🚀 Presque terminé!')}
          </div>
        )}

        {isVerified && verificationResult.isCorrect && (
          <div className="mt-2 sm:mt-3 text-center animate-bounce">
            <p className="text-base sm:text-lg font-bold">
              🎉 {showArabic ? 'ممتاز! إجابة صحيحة!' : 'Excellent! Réponse correcte!'}
            </p>
          </div>
        )}

        {isVerified && !verificationResult.isCorrect && (
          <div className="mt-2 sm:mt-3 text-center">
            <p className="text-xs sm:text-sm font-medium">
              😊 {showArabic 
                ? `${verificationResult.correctCount} من ${verificationResult.totalCount} صحيح - حاول مرة أخرى!` 
                : `${verificationResult.correctCount} sur ${verificationResult.totalCount} correct - Réessayez!`}
            </p>
          </div>
        )}
      </div>

     {/* Main Template Area with Clickable Slots - Always Left-Aligned (French text) */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-md text-left">
        <div className="text-sm sm:text-base md:text-lg leading-loose sm:leading-relaxed">
          {parts.map((part, index) => {
            if (part.type === 'text') {
              return <span key={index} className="text-gray-800">{part.content}</span>;
            } else {
              const isCorrectWord = isVerified && verificationResult.results?.[part.slotIndex];
              const isIncorrectWord = isVerified && !verificationResult.results?.[part.slotIndex] && part.word;
              const isCelebrating = celebrateSlot === part.slotIndex;
              const isShaking = shakeSlot === part.slotIndex;
              const isClickable = !isVerified && selectedWord;
              
              return (
                <span
                  key={index}
                  onClick={() => isClickable && handleSlotClick(part.slotIndex)}
                  className={`relative inline-flex items-center min-w-[80px] sm:min-w-[100px] md:min-w-[120px] mx-1 my-1 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 border rounded-md sm:rounded-lg transition-all duration-300 transform text-xs sm:text-sm md:text-base align-middle
                    ${part.word 
                      ? isVerified
                        ? isCorrectWord
                          ? 'border-green-500 bg-gradient-to-r from-green-100 to-green-50 text-green-800 shadow-sm'
                          : 'border-red-500 bg-gradient-to-r from-red-100 to-red-50 text-red-800 shadow-sm'
                        : 'border-purple-500 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 shadow-sm hover:shadow-md hover:scale-105'
                      : isClickable
                        ? 'border-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-50 shadow-md cursor-pointer hover:scale-105 border-dashed'
                        : 'border-gray-300 bg-white border-dashed hover:border-gray-400 hover:bg-gray-50 cursor-default'
                    }
                    ${isCelebrating ? 'animate-celebrate' : ''}
                    ${isShaking ? 'animate-shake' : ''}
                  `}
                >
                  {part.word ? (
                    <span className="flex items-center justify-between gap-1 sm:gap-2 w-full">
                      <span className="font-medium flex-1 text-xs sm:text-sm md:text-base truncate">{part.word}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {isVerified && (
                          isCorrectWord ? (
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                          )
                        )}
                        {!isVerified && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWord(part.slotIndex);
                            }}
                            className="p-0.5 sm:p-1 hover:bg-red-100 rounded transition-colors group"
                          >
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500 group-hover:text-red-700" />
                          </button>
                        )}
                      </div>
                    </span>
                  ) : (
                    <span className="text-gray-400 text-center block w-full text-xs sm:text-sm md:text-base">
                      {isClickable ? '✨' : `[${part.slotIndex}]`}
                    </span>
                  )}
                </span>
              );
            }
          })}
        </div>
      </div>

      {/* Enhanced Word Bank */}
      {availableWords.length > 0 && !isVerified && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-purple-200 shadow-md">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h4 className={`font-bold text-purple-800 flex items-center gap-2 text-sm sm:text-base ${showArabic ? 'text-right flex-row-reverse' : 'text-left'}`}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              {showArabic ? 'بنك الكلمات' : 'Banque de mots'}
            </h4>
            <span className="text-xs sm:text-sm text-purple-600 font-medium bg-purple-100 px-2 sm:px-3 py-1 rounded-full">
              {availableWords.length} {showArabic ? 'متبقي' : 'restant'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {availableWords.map((word, index) => (
              <button
                key={`${word}-${index}`}
                onClick={() => handleWordClick(word)}
                className={`
                  px-3 sm:px-4 md:px-5 py-2 sm:py-3 bg-gradient-to-r text-white rounded-lg sm:rounded-xl 
                  transition-all duration-300 select-none font-medium shadow-md text-xs sm:text-sm md:text-base
                  hover:shadow-xl hover:scale-110 active:scale-95
                  ${selectedWord === word 
                    ? 'from-yellow-500 to-orange-500 ring-2 sm:ring-4 ring-yellow-300 scale-110' 
                    : 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:-translate-y-1'
                  }
                `}
              >
                {word}
              </button>
            ))}
          </div>
          
          <p className="text-xs sm:text-sm text-purple-600 mt-3 sm:mt-4 text-center italic">
            {showArabic ? '🎯 انقر على كلمة ثم انقر على الفراغ لوضعها' : '🎯 Cliquez sur un mot puis sur un espace pour le placer'}
          </p>
        </div>
      )}

      {/* Verify Button */}
      {allSlotsFilled && !isVerified && (
        <div className="flex justify-center">
          <button
            onClick={handleVerifyAnswer}
            className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm sm:text-base md:text-lg"
          >
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            {showArabic ? 'تحقق من الإجابة' : 'Vérifier'}
          </button>
        </div>
      )}

      {/* Try Again Button */}
      {isVerified && !verificationResult.isCorrect && (
        <div className="flex justify-center gap-4">
          <button
            onClick={handleTryAgain}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            {showArabic ? 'حاول مرة أخرى' : 'Réessayer'}
          </button>
        </div>
      )}

      {/* Complete Answer Display */}
      {isVerified && verificationResult.isCorrect && (question.answer || question.answerArabic) && (
        <div className="border-t-2 border-gray-200 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setShowAnswer(!showAnswer);
                if (showAnswer) stopSpeaking();
              }}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg sm:rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
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
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all shadow-md hover:shadow-lg text-sm sm:text-base ${
                  isSpeaking 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                } text-white`}
                title={isSpeaking ? 'Arrêter la lecture' : 'Lire la réponse'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span className="font-semibold">
                  {isSpeaking ? (showArabic ? 'إيقاف' : 'Stop') : (showArabic ? 'استمع' : 'Écouter')}
                </span>
              </button>
            )}
          </div>

          {showAnswer && (
            <div className="mt-3 sm:mt-4 p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg sm:rounded-xl shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <h4 className={`font-bold text-purple-900 text-base sm:text-lg ${showArabic ? 'text-right' : 'text-left'}`}>
                  {showArabic ? 'الإجابة الكاملة' : 'Réponse complète'}
                </h4>
              </div>
              
              {!showArabic && question.answer && (
                <div className="mb-3 p-3 sm:p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                    {question.answer}
                  </p>
                </div>
              )}
              
              {showArabic && question.answerArabic && (
                <div className="p-3 sm:p-4 bg-white rounded-lg border border-purple-200 text-right shadow-sm" dir="rtl">
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                    {question.answerArabic}
                  </p>
                </div>
              )}

              {!showArabic && question.answerArabic && (
                <div className="mt-3 p-3 sm:p-4 bg-white rounded-lg border border-purple-200 text-right shadow-sm" dir="rtl">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 text-left" dir="ltr">
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

      {/* Vocabulary Helper */}
      {question.helper && (
        <div className="border-t-2 border-gray-200 pt-4 sm:pt-6">
          <button
            onClick={() => toggleHelper && toggleHelper(question.id)}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold">
              {showArabic ? 'مساعدة المفردات' : 'Aide vocabulaire'}
            </span>
            {isHelperVisible ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          
          {isHelperVisible && (
            <div className="mt-3 sm:mt-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-blue-200 shadow-lg animate-fadeIn">
              <h4 className={`font-bold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base md:text-lg ${showArabic ? 'text-right flex-row-reverse' : 'text-left'}`}>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                {showArabic ? 'مفردات مفيدة' : 'Vocabulaire utile'}
              </h4>
              
              <div className="space-y-2 sm:space-y-3">
                {shuffledHelperWords && shuffledHelperWords.map((item, idx) => {
                  return (
                    <div key={idx} className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-all hover:shadow-md ${showArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs sm:text-sm font-semibold text-center shadow-sm flex-1 min-w-0">
                        <span className="block truncate">{item.french}</span>
                      </span>
                      <span className="text-blue-600 font-bold text-sm sm:text-base md:text-lg flex-shrink-0">↔</span>
                      <span className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs sm:text-sm font-semibold text-center shadow-sm flex-1 min-w-0" dir="rtl">
                        <span className="block truncate">{item.arabic}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes celebrate {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-5deg); }
          50% { transform: scale(1.3) rotate(5deg); }
          75% { transform: scale(1.2) rotate(-5deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-celebrate {
          animation: celebrate 1s ease-in-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
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

export default SingleWordPlacement;