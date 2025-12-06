import React, { useState, useMemo, useEffect, useRef } from 'react';
import {RotateCcw, BookOpen, FileText, Clock, CheckCircle, ArrowLeft, Play, ExternalLink, Volume2, X } from 'lucide-react';
import QuestionRenderers from './QuestionRenderers';
import CompleteEssayDisplay from './Question/Essay/CompleteEssayDisplay';

// Mock components for this demo
const ArabicToggle = ({ showArabic, onToggle }) => (
  <button onClick={onToggle} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
    {showArabic ? 'FR' : 'AR'}
  </button>
);

const AnswerToggle = ({ showAnswer, onToggle, questionId }) => (
  <button onClick={() => onToggle(questionId)} className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
    {showAnswer ? 'Cacher' : 'Réponse'}
  </button>
);

const ProgressBar = ({ currentSlide, totalSlides, bookColor, slideTitle }) => (
  <div className="bg-white border-b p-3 sm:p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium text-sm sm:text-base truncate pr-2">{slideTitle}</h3>
      <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{currentSlide + 1} / {totalSlides}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`bg-gradient-to-r ${bookColor} h-2 rounded-full transition-all`}
        style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
      />
    </div>
  </div>
);

const Navigation = ({ currentSlide, totalSlides, onPrevSlide, onNextSlide, bookColor, showArabic, isLastQuestion, areAllEssaysCompleted, essayQuestions }) => {
  const showCompleteEssayButton = isLastQuestion && areAllEssaysCompleted && essayQuestions && essayQuestions.length > 0;
  
  return (
    <div className="bg-white border-t p-3 sm:p-4 flex justify-between gap-2">
      <button 
        onClick={onPrevSlide} 
        disabled={currentSlide === 0}
        className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 text-sm sm:text-base"
      >
        {showArabic ? 'السابق' : 'Précédent'}
      </button>
      <button 
        onClick={onNextSlide} 
        disabled={currentSlide === totalSlides - 1}
        className={`px-3 sm:px-4 py-2 bg-gradient-to-r ${bookColor} text-white rounded disabled:opacity-50 font-medium text-sm sm:text-base ${showCompleteEssayButton ? 'animate-pulse' : ''}`}
      >
        {showCompleteEssayButton 
          ? (showArabic ? '🎉 عرض المقال الكامل' : '🎉 Voir l\'essai')
          : (showArabic ? 'التالي' : 'Suivant')
        }
      </button>
    </div>
  );
};

// Chapter Video Modal Component
const ChapterVideoModal = ({ chapterData, isOpen, onClose, showArabic }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showEndNotification, setShowEndNotification] = useState(false);
  const timerRef = useRef(null);
  const iframeRef = useRef(null);

  const getYouTubeEmbedUrl = (url, startTime) => {
    if (!url) return '';
    
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }
    
    let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
    
    if (startTime) {
      const [minutes, seconds] = startTime.split(':').map(Number);
      const startSeconds = minutes * 60 + seconds;
      embedUrl += `&start=${startSeconds}`;
    }
    
    return embedUrl;
  };

  const convertTimeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  useEffect(() => {
    if (isOpen && chapterData?.timeStart && chapterData?.timeEnd) {
      const startSeconds = convertTimeToSeconds(chapterData.timeStart);
      const endSeconds = convertTimeToSeconds(chapterData.timeEnd);
      const duration = endSeconds - startSeconds;
      
      setTimeRemaining(duration);
      setShowEndNotification(false);

      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setShowEndNotification(true);
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isOpen, chapterData]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    if (iframeRef.current && chapterData?.timeStart && chapterData?.timeEnd) {
      const startSeconds = convertTimeToSeconds(chapterData.timeStart);
      const endSeconds = convertTimeToSeconds(chapterData.timeEnd);
      const duration = endSeconds - startSeconds;
      
      const newSrc = getYouTubeEmbedUrl(chapterData.videoUrl, chapterData.timeStart);
      iframeRef.current.src = newSrc;
      
      setTimeRemaining(duration);
      setShowEndNotification(false);
      
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setShowEndNotification(true);
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  if (!isOpen || !chapterData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className={showArabic ? 'text-right flex-1 pr-2' : 'flex-1 pr-2'}>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800 line-clamp-2">
              {showArabic ? `الفصل ${chapterData.chapterNumber}: ${chapterData.chapterTitleArabic || chapterData.chapterTitle}` 
                         : `Chapitre ${chapterData.chapterNumber}: ${chapterData.chapterTitle}`}
            </h3>
            {chapterData.timeStart && chapterData.timeEnd && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                <span>
                  {showArabic ? 'المقطع:' : 'Passage:'} {chapterData.timeStart} - {chapterData.timeEnd}
                </span>
                {timeRemaining !== null && (
                  <div className={`flex items-center gap-2 ${timeRemaining <= 30 ? 'text-orange-600' : 'text-blue-600'}`}>
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">
                      {timeRemaining > 0 ? formatTime(timeRemaining) : '00:00'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {showEndNotification && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md mx-4 w-full">
              <div className="text-center">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                  {showArabic ? 'انتهى المقطع المطلوب' : 'Fin du passage requis'}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  {showArabic ? 'لقد انتهى الجزء المطلوب من الفيديو للامتحان' 
                             : 'La partie du vidéo requise pour l\'examen est terminée'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRestart}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {showArabic ? 'إعادة التشغيل' : 'Rejouer'}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm sm:text-base"
                  >
                    {showArabic ? 'إغلاق' : 'Fermer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="aspect-video flex-shrink-0">
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            src={getYouTubeEmbedUrl(chapterData.videoUrl, chapterData.timeStart)}
            title={chapterData.chapterTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        <div className="p-3 sm:p-4 bg-gray-50 overflow-y-auto">
          <div className={`flex items-start gap-2 sm:gap-3 ${showArabic ? 'flex-row-reverse text-right' : ''}`}>
            <div className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0">
              {showEndNotification ? <CheckCircle /> : <Clock />}
            </div>
            <div className={showArabic ? 'text-right' : ''}>
              <p className="text-xs sm:text-sm font-medium text-gray-800 mb-1">
                {showArabic ? 'صوت بالعربية مع نص بالفرنسية' : 'Audio en arabe avec texte français'}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {showEndNotification 
                  ? (showArabic ? 'انتهى الجزء المطلوب للامتحان. يمكنك إعادة التشغيل أو الإغلاق.'
                               : 'La partie requise pour l\'examen est terminée. Vous pouvez rejouer ou fermer.')
                  : (showArabic ? 'هذا الفيديو يعرض النص الفرنسي مع السرد بالعربية لمساعدتك على فهم المقطع.'
                               : 'Cette vidéo affiche le texte français avec une narration en arabe pour vous aider à comprendre le passage.')
                }
              </p>
              {timeRemaining !== null && timeRemaining > 0 && (
                <p className="text-xs text-blue-600 mt-2">
                  {showArabic ? `الوقت المتبقي للمقطع: ${formatTime(timeRemaining)}`
                             : `Temps restant du passage: ${formatTime(timeRemaining)}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Text Component with Chapter Link
const TextWithChapterLink = ({ textData, onOpenChapter, showArabic }) => {
  const [showChapterInfo, setShowChapterInfo] = useState(false);
  
  const handleOpenChapter = () => {
    if (onOpenChapter && textData.sourceChapter) {
      onOpenChapter(textData.sourceChapter);
    }
  };

  if (!textData.sourceChapter) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <div className={`text-base sm:text-lg leading-relaxed text-gray-700 whitespace-pre-line ${showArabic ? 'text-right' : 'text-left'}`}>
          {typeof textData === 'string' ? textData : textData.content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4">
        <div className={`flex items-center justify-between ${showArabic ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 sm:gap-3 ${showArabic ? 'flex-row-reverse' : ''} flex-1 min-w-0`}>
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <div className={`${showArabic ? 'text-right' : ''} min-w-0`}>
              <p className="font-medium text-sm sm:text-base truncate">
                {showArabic ? `مقتطف من الفصل ${textData.sourceChapter.chapterNumber}` 
                           : `Extrait du chapitre ${textData.sourceChapter.chapterNumber}`}
              </p>
              <p className="text-blue-100 text-xs sm:text-sm truncate">
                {showArabic && textData.sourceChapter.chapterTitleArabic 
                  ? textData.sourceChapter.chapterTitleArabic 
                  : textData.sourceChapter.chapterTitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowChapterInfo(!showChapterInfo)}
            className="text-blue-100 hover:text-white transition-colors ml-2 flex-shrink-0"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {showChapterInfo && (
        <div className="bg-blue-50 border-b p-3 sm:p-4">
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 ${showArabic ? 'sm:flex-row-reverse' : ''}`}>
            <h4 className={`font-medium text-blue-800 text-sm sm:text-base ${showArabic ? 'text-right' : ''}`}>
              {showArabic ? 'استمع إلى هذا المقطع بالعربية' : 'Écouter ce passage en arabe'}
            </h4>
            <button
              onClick={handleOpenChapter}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm whitespace-nowrap ${showArabic ? 'flex-row-reverse' : ''}`}
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4" />
              {showArabic ? 'افتح الفيديو' : 'Ouvrir la vidéo'}
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm ${showArabic ? 'text-right' : ''}`}>
            {textData.sourceChapter.timeStart && textData.sourceChapter.timeEnd && (
              <div className={`flex items-center gap-2 text-blue-700 ${showArabic ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">
                  {showArabic ? 'المقطع:' : 'Passage:'} {textData.sourceChapter.timeStart} - {textData.sourceChapter.timeEnd}
                </span>
              </div>
            )}
            <div className="text-blue-600 truncate">
              <span>
                {showArabic ? 'الكتاب:' : 'Livre:'} {textData.sourceChapter.bookTitle || textData.sourceChapter.bookId?.replace('-', ' ')}
              </span>
            </div>
          </div>
          
          <div className={`mt-3 p-3 bg-amber-100 rounded border-l-4 border-amber-500 ${showArabic ? 'border-r-4 border-l-0 text-right' : ''}`}>
            <p className="text-amber-800 text-xs sm:text-sm">
              {showArabic ? '💡 نصيحة: استمع أولاً إلى الفيديو بالعربية لفهم السياق بشكل أفضل قبل الإجابة على الأسئلة.'
                         : '💡 Conseil: Écoutez d\'abord la vidéo en arabe pour mieux comprendre le contexte avant de répondre aux questions.'}
            </p>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 md:p-8">
        <div className={`text-base sm:text-lg leading-relaxed text-gray-700 whitespace-pre-line ${showArabic ? 'text-right' : 'text-left'}`}>
          {textData.content || textData}
        </div>
      </div>
    </div>
  );
};

/**
 * Sorts questions so that essay questions always appear at the end
 * Order: essay_subject, essay_introduction, essay_development, essay_conclusion
 */
const sortQuestionsWithEssayLast = (questions) => {
  if (!questions || !Array.isArray(questions)) return [];
  
  const essayTypes = ['essay_subject', 'essay_introduction', 'essay_development', 'essay_conclusion'];
  
  // Separate essay questions from regular questions
  const regularQuestions = questions.filter(q => !essayTypes.includes(q.type));
  const essayQuestions = questions.filter(q => essayTypes.includes(q.type));
  
  // Sort essay questions in the correct order
  const sortedEssayQuestions = essayQuestions.sort((a, b) => {
    const orderA = essayTypes.indexOf(a.type);
    const orderB = essayTypes.indexOf(b.type);
    return orderA - orderB;
  });
  
  // Combine: regular questions first, then essay questions
  return [...regularQuestions, ...sortedEssayQuestions];
};

const GenericExamComponent = ({ 
  examData, 
  book, 
  currentSlide = 0, 
  onSlideChange = () => {}, 
  userAnswers = {}, 
  onAnswerChange = () => {}, 
  onBack = () => {},
  customTextRenderer 
}) => {
  const [showArabic, setShowArabic] = useState(false);
  const [showHelper, setShowHelper] = useState({}); 
  const [showAnswers, setShowAnswers] = useState({});
  const [checkedAnswers, setCheckedAnswers] = useState({});
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  // Sort questions to put essays last
  const sortedQuestions = useMemo(() => {
    if (!examData?.questions) return [];
    return sortQuestionsWithEssayLast(examData.questions);
  }, [examData?.questions]);
  
  // Check if we have essay questions and if they're all completed
  const essayQuestions = useMemo(() => {
    return sortedQuestions.filter(q => 
      ['essay_introduction', 'essay_development', 'essay_conclusion'].includes(q.type)
    );
  }, [sortedQuestions]);

  const areAllEssaysCompleted = useMemo(() => {
    if (essayQuestions.length !== 3) return false;
    
    return essayQuestions.every(q => {
      const answer = userAnswers[q.id];
      if (!answer) return false;
      
      // Check progressive phrases
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
      }
      
      // Check drag-drop
      if (q.dragDropWords && q.dragDropWords.template) {
        const slots = q.dragDropWords.template.match(/\[(\d+)\]/g) || [];
        return slots.every(slot => {
          const slotNumber = parseInt(slot.replace(/[\[\]]/g, ''));
          return answer[slotNumber] !== undefined;
        });
      }
      
      // Check text
      return typeof answer === 'string' && answer.trim().length > 0;
    });
  }, [essayQuestions, userAnswers]);
  
  // Add an extra slide for complete essay if all essays are completed
  const shouldShowCompleteEssay = areAllEssaysCompleted && essayQuestions.length > 0;
  const totalSlides = sortedQuestions.length + 2 + (shouldShowCompleteEssay ? 1 : 0);

  const toggleHelper = (questionId) => {
    setShowHelper(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleAnswer = (questionId) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleCheckAnswer = (questionId, validation) => {
    setCheckedAnswers(prev => ({
      ...prev,
      [questionId]: validation
    }));
  };

  const handleOpenChapter = (chapterData) => {
    setSelectedChapter(chapterData);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedChapter(null);
  };

  const handleNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      onSlideChange(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      onSlideChange(currentSlide - 1);
    }
  };

  // Get the appropriate title for each question
  const getQuestionTitle = (question, questionNumber) => {
    if (question.type === 'essay_introduction') {
      return showArabic ? 'المقدمة' : 'Introduction';
    }
    if (question.type === 'essay_development') {
      return showArabic ? 'التطوير' : 'Développement';
    }
    if (question.type === 'essay_conclusion') {
      return showArabic ? 'الخاتمة' : 'Conclusion';
    }
    if (question.type === 'essay_subject') {
      return showArabic ? 'موضوع الإنشاء' : 'Sujet de l\'essai';
    }
    return showArabic ? `السؤال ${questionNumber}` : `Question ${questionNumber}`;
  };

  const renderTitleSlide = () => (
    <div className="h-full flex flex-col justify-center items-center text-center p-4 sm:p-8">
      <button
        onClick={onBack}
        className="absolute top-4 sm:top-8 left-4 sm:left-8 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">{showArabic ? 'العودة للامتحانات' : 'Retour aux examens'}</span>
        <span className="sm:hidden">{showArabic ? 'رجوع' : 'Retour'}</span>
      </button>
      
      <div className="absolute top-4 sm:top-8 right-4 sm:right-8">
        <ArabicToggle showArabic={showArabic} onToggle={() => setShowArabic(!showArabic)} />
      </div>

      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-2xl">
        <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
      </div>
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
        {showArabic && examData.titleArabic ? examData.titleArabic : examData.title}
      </h1>
      <h2 className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-2">La Boîte à Merveilles</h2>
      <p className="text-base sm:text-lg text-gray-500 mb-4 sm:mb-6">{showArabic ? 'بقلم' : 'par'} Ahmed Sefrioui</p>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2">
          <FileText className="w-4 h-4" />
          <span>
            {showArabic && examData.subjectArabic ? examData.subjectArabic : examData.subject} - {examData.points} {showArabic ? 'نقط' : 'points'}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{examData.duration}</span>
        </div>
      </div>
    </div>
  );

  const renderTextSlide = () => {
    if (examData.textExtract && examData.textExtract.sourceChapter) {
      return (
        <div className="h-full p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {showArabic ? 'النص' : 'Texte'}
              </h2>
              <ArabicToggle showArabic={showArabic} onToggle={() => setShowArabic(!showArabic)} />
            </div>
            
            <TextWithChapterLink 
              textData={examData.textExtract}
              onOpenChapter={handleOpenChapter}
              showArabic={showArabic}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="h-full p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {showArabic ? 'النص' : 'Texte'}
            </h2>
            <ArabicToggle showArabic={showArabic} onToggle={() => setShowArabic(!showArabic)} />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            <div className={`text-base sm:text-lg leading-relaxed text-gray-700 whitespace-pre-line ${showArabic ? 'text-right' : 'text-left'}`}>
              {typeof examData.textExtract === 'string' ? examData.textExtract : examData.textExtract.content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionSlide = () => {
    const question = sortedQuestions[currentSlide - 2];
    
    return (
      <div className="h-full p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {getQuestionTitle(question, currentSlide - 1)}
            </h2>
            <div className="flex items-center gap-2 sm:gap-3">
              <ArabicToggle showArabic={showArabic} onToggle={() => setShowArabic(!showArabic)} />
              <AnswerToggle 
                showAnswer={showAnswers[question.id]} 
                onToggle={toggleAnswer} 
                questionId={question.id} 
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-xs sm:text-sm">{currentSlide - 1}</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  {question.points} {showArabic ? (question.points > 0 ? 'نقط' : 'نقطة') : (question.points > 0 ? 'points' : 'point')}
                </span>
              </div>
            </div>

            <QuestionRenderers
              question={question}
              showArabic={showArabic}
              showAnswers={showAnswers}
              userAnswers={userAnswers}
              onAnswerChange={onAnswerChange}
              showHelper={showHelper}
              toggleHelper={toggleHelper}
              checkedAnswers={checkedAnswers}
              onCheckAnswer={handleCheckAnswer}
              allUserAnswers={userAnswers}
              allQuestions={sortedQuestions}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderCompleteEssaySlide = () => {
    return (
      <div className="h-full p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {showArabic ? '🎉 مقالك الكامل' : '🎉 Votre Essai Complet'}
            </h2>
            <ArabicToggle showArabic={showArabic} onToggle={() => setShowArabic(!showArabic)} />
          </div>
          <CompleteEssayDisplay
            essayQuestions={essayQuestions}
            userAnswers={userAnswers}
          />
        </div>
      </div>
    );
  };

  const getSlideTitle = () => {
    if (currentSlide === 0) {
      return showArabic ? 'صفحة العنوان' : 'Page de titre';
    } else if (currentSlide === 1) {
      return showArabic ? 'النص' : 'Texte';
    } else if (currentSlide === totalSlides - 1 && areAllEssaysCompleted && essayQuestions.length > 0) {
      return showArabic ? 'المقال الكامل' : 'Essai Complet';
    } else {
      const question = sortedQuestions[currentSlide - 2];
      return getQuestionTitle(question, currentSlide - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ProgressBar 
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        bookColor="from-emerald-500 to-teal-600"
        slideTitle={getSlideTitle()}
      />
      
      <div className="flex-1 bg-gray-50 relative overflow-hidden">
        {currentSlide === 0 && renderTitleSlide()}
        {currentSlide === 1 && renderTextSlide()}
        {currentSlide >= 2 && currentSlide <= sortedQuestions.length + 1 && renderQuestionSlide()}
        {shouldShowCompleteEssay && currentSlide === totalSlides - 1 && renderCompleteEssaySlide()}
      </div>

      <Navigation
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onPrevSlide={handlePrevSlide}
        onNextSlide={handleNextSlide}
        bookColor="from-emerald-500 to-teal-600"
        showArabic={showArabic}
        isLastQuestion={currentSlide === sortedQuestions.length + 1}
        areAllEssaysCompleted={areAllEssaysCompleted}
        essayQuestions={essayQuestions}
      />

      <ChapterVideoModal 
        chapterData={selectedChapter}
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        showArabic={showArabic}
      />
    </div>
  );
};

export default GenericExamComponent;