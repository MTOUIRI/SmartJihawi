import React, { useState } from 'react';
import { ArrowLeft, PenTool, Lightbulb, FileText, CheckCircle, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import EssaySubject from '../Question/EssaySubject';
import EssaySection from '../Question/Essay/EssaySection';

// Essay Type Configuration
const ESSAY_TYPES = {
  essay_subject: {
    icon: PenTool,
    label: 'Sujet d\'expression',
    labelArabic: 'موضوع التعبير',
    color: 'from-purple-500 to-purple-600',
  },
  essay_introduction: {
    icon: Lightbulb,
    label: 'Introduction',
    labelArabic: 'المقدمة',
    color: 'from-yellow-500 to-yellow-600',
  },
  essay_development: {
    icon: FileText,
    label: 'Développement',
    labelArabic: 'التطوير',
    color: 'from-blue-500 to-blue-600',
  },
  essay_conclusion: {
    icon: CheckCircle,
    label: 'Conclusion',
    labelArabic: 'الخاتمة',
    color: 'from-green-500 to-green-600',
  }
};

// Arabic Toggle Component
const ArabicToggle = ({ showArabic, onToggle }) => (
  <button
    onClick={onToggle}
    className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
  >
    {showArabic ? 'Français' : 'العربية'}
  </button>
);

// Progress Bar Component
const ProgressBar = ({ current, total, color }) => (
  <div className="bg-white border-b p-3 md:p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs md:text-sm text-gray-600">Question {current} sur {total}</span>
      <span className="text-xs md:text-sm font-medium text-gray-700">{Math.round((current / total) * 100)}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  </div>
);

// Main Essay Viewer Component
const EssayViewer = ({ essay, exam, book, onBack, allEssays = [] }) => {
  const [showArabic, setShowArabic] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState({});
  const [showHelper, setShowHelper] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [checkedAnswers, setCheckedAnswers] = useState({});

  // Find current essay index in allEssays array
  React.useEffect(() => {
    if (allEssays.length > 0) {
      const index = allEssays.findIndex(e => e.id === essay.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    } else {
      setCurrentIndex(0);
    }
  }, [essay.id, allEssays]);

  const currentEssay = allEssays.length > 0 ? allEssays[currentIndex] : essay;
  const typeConfig = ESSAY_TYPES[currentEssay.type] || ESSAY_TYPES.essay_subject;
  const Icon = typeConfig.icon;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentIndex < allEssays.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleAnswer = (questionId) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleHelper = (helperId) => {
    setShowHelper(prev => ({
      ...prev,
      [helperId]: !prev[helperId]
    }));
  };

  const handleAnswerChange = (questionId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckAnswer = (questionId, validation) => {
    setCheckedAnswers(prev => ({
      ...prev,
      [questionId]: validation
    }));
  };

  const renderEssayContent = () => {
    if (currentEssay.type === 'essay_subject') {
      return (
        <div dir={showArabic ? 'rtl' : 'ltr'}>
          <EssaySubject question={currentEssay} showArabic={showArabic} />
        </div>
      );
    }
    
    // For introduction, development, and conclusion - use EssaySection component
    if (['essay_introduction', 'essay_development', 'essay_conclusion'].includes(currentEssay.type)) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <EssaySection
            question={currentEssay}
            showArabic={showArabic}
            showAnswers={showAnswers}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            showHelper={showHelper}
            toggleHelper={toggleHelper}
            checkedAnswers={checkedAnswers}
            onCheckAnswer={handleCheckAnswer}
            hideQuestionBox={true}
          />
        </div>
      );
    }

    return (
      <div className={`${showArabic ? 'text-right' : 'text-left'}`}>
        <p className="text-base md:text-lg text-gray-700">
          {showArabic && currentEssay.questionArabic ? currentEssay.questionArabic : currentEssay.question}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header Section */}
      <div className="bg-white shadow-md">
        {/* Progress Bar */}
        {allEssays.length > 0 && (
          <ProgressBar 
            current={currentIndex + 1} 
            total={allEssays.length} 
            color={typeConfig.color} 
          />
        )}

        {/* Compact Header - Mobile Responsive */}
        <div className="border-b px-3 py-2 md:px-6 md:py-3">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Layout */}
            <div className="md:hidden">
              {/* Top row: Back button and Arabic toggle */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">{showArabic ? 'العودة' : 'Retour'}</span>
                </button>
                
                {currentEssay.type === 'essay_subject' && (
                  <ArabicToggle showArabic={showArabic} onToggle={() => setShowArabic(!showArabic)} />
                )}
              </div>
              
              {/* Bottom row: Icon and title */}
              <div className={`flex items-center gap-2 ${showArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 bg-gradient-to-br ${typeConfig.color} rounded-lg flex items-center justify-center shadow flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                <div className={`flex-1 min-w-0 ${showArabic ? 'text-right' : ''}`}>
                  <h1 className="text-sm font-bold text-gray-900 truncate">
                    {currentEssay.type === 'essay_subject' 
                      ? (showArabic && currentEssay.titleArabic ? currentEssay.titleArabic : currentEssay.title || typeConfig.label)
                      : (showArabic ? typeConfig.labelArabic : typeConfig.label)}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="truncate">{exam?.title || 'Examen'}</span>
                    <span>•</span>
                    <span>{exam?.year || new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between gap-4">
              {/* Left: Back button and Title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors font-medium flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">{showArabic ? 'العودة' : 'Retour'}</span>
                </button>
                
                <div className="w-px h-6 bg-gray-300"></div>
                
                <div className={`flex items-center gap-2 flex-1 min-w-0 ${showArabic ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 bg-gradient-to-br ${typeConfig.color} rounded-lg flex items-center justify-center shadow flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className={`flex-1 min-w-0 ${showArabic ? 'text-right' : ''}`}>
                    <h1 className="text-base font-bold text-gray-900 truncate">
                      {currentEssay.type === 'essay_subject' 
                        ? (showArabic && currentEssay.titleArabic ? currentEssay.titleArabic : currentEssay.title || typeConfig.label)
                        : (showArabic ? typeConfig.labelArabic : typeConfig.label)}
                    </h1>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="truncate">{exam?.title || 'Examen'}</span>
                      <span>•</span>
                      <span>{exam?.year || new Date().getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right: Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {currentEssay.type === 'essay_subject' && (
                  <ArabicToggle showArabic={showArabic} onToggle={() => setShowArabic(!showArabic)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="p-3 md:p-6">
        <div className="max-w-6xl mx-auto">
          {renderEssayContent()}

          {/* Navigation between essays - Mobile Responsive */}
          {allEssays.length > 1 && (
            <div className="flex items-center justify-between mt-4 md:mt-6 bg-white rounded-lg shadow-md p-3 md:p-4 gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{showArabic ? 'السابق' : 'Précédent'}</span>
              </button>
              
              <span className="text-xs md:text-sm text-gray-600 font-medium">
                {currentIndex + 1} / {allEssays.length}
              </span>
              
              <button
                onClick={handleNext}
                disabled={currentIndex === allEssays.length - 1}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-gradient-to-r ${typeConfig.color} text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
              >
                <span className="hidden sm:inline">{showArabic ? 'التالي' : 'Suivant'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Footer Info - Mobile Responsive */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-4 md:mt-6">
            <div className={`flex items-start gap-3 text-sm ${showArabic ? 'flex-row-reverse text-right' : ''}`}>
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className={showArabic ? 'text-right' : ''}>
                <p className="text-gray-700 font-medium">{book?.title || 'Livre'}</p>
                <p className="text-gray-600 text-xs md:text-sm">
                  {showArabic ? 'تمرن على كتابة إجابة منظمة ومنطقية' 
                             : 'Entraînez-vous à rédiger une réponse structurée et argumentée'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayViewer;