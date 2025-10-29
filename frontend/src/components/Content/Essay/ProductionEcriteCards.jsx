import React, { useState, useEffect } from 'react';
import { PenTool, ArrowLeft, BookOpen, Lightbulb, FileText, CheckCircle, Loader2, AlertCircle, ChevronRight, Lock, Sparkles, UserPlus, LogIn } from 'lucide-react';
import EssayViewer from './EssayViewer';
import { isItemLocked } from '../FreemiumWrapper';
import API_URL from '../../../config';

const API_BASE_URL = API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const essayAPI = {
  getExamsByBook: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/exams/book/${bookId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch exams');
    return await response.json();
  },

  getEssayQuestionsByExam: async (examId) => {
    const response = await fetch(`${API_BASE_URL}/essay-questions/exam/${examId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch essay questions');
    const data = await response.json();
    return data.questions || [];
  }
};

const LoadingSpinner = ({ message = 'Chargement...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
    <p className="text-gray-600 font-medium text-sm md:text-base">{message}</p>
  </div>
);

const ErrorAlert = ({ message, onRetry }) => (
  <div className="max-w-2xl mx-auto mb-6">
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1 text-sm md:text-base">Erreur de chargement</h3>
          <p className="text-red-700 text-xs md:text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm font-medium transition-colors"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ESSAY_TYPES = {
  essay_subject: {
    icon: PenTool,
    label: 'Sujet d\'expression',
    labelArabic: 'موضوع التعبير',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800'
  },
  essay_introduction: {
    icon: Lightbulb,
    label: 'Introduction',
    labelArabic: 'المقدمة',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800'
  },
  essay_development: {
    icon: FileText,
    label: 'Développement',
    labelArabic: 'التطوير',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800'
  },
  essay_conclusion: {
    icon: CheckCircle,
    label: 'Conclusion',
    labelArabic: 'الخاتمة',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800'
  }
};

const EssayGroupCard = ({ essayGroup, examTitle, examYear, onClick, showArabic, isLocked, onShowRegistration, index }) => {
  // Get the essay title from any essay that has a title
  const essayTitle = essayGroup.essays.find(e => e.title)?.title || '';
  const essayTitleArabic = essayGroup.essays.find(e => e.titleArabic)?.titleArabic || '';

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 overflow-hidden group text-left w-full relative"
    >
      {/* Lock overlay for locked cards */}
      {isLocked && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-bold text-pink-900">Premium</p>
          </div>
        </div>
      )}

      {index === 0 && (
        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-bold z-20">
          GRATUIT
        </div>
      )}
      
      <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-600" />
      
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
            <PenTool className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
        </div>

        <div className={`mb-3 ${showArabic ? 'text-right' : 'text-left'}`}>
          {/* Display Essay Title if available */}
          {(essayTitle || essayTitleArabic) && (
            <div className="mb-3 flex items-start gap-2">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-pink-600 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors line-clamp-2">
                  {showArabic && essayTitleArabic ? essayTitleArabic : essayTitle}
                </h3>
                {showArabic && essayTitleArabic && essayTitle && (
                  <p className="text-xs text-gray-500 text-left truncate">
                    {essayTitle}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Fallback to regular title if no essay title */}
          {!essayTitle && !essayTitleArabic && (
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">
              {showArabic ? 'الإنتاج الكتابي' : 'Production Écrite'}
            </h3>
          )}
          
          <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
            {showArabic && essayGroup.previewTextArabic 
              ? essayGroup.previewTextArabic.substring(0, 80) + '...'
              : essayGroup.previewText.substring(0, 80) + '...'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 min-w-0 flex-1">
            <p className="font-medium truncate">{examTitle}</p>
            <p>{examYear}</p>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2 text-pink-600 font-semibold flex-shrink-0 ml-2">
            <span className="text-xs md:text-sm">Voir</span>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex gap-1">
            {essayGroup.essays.map((essay) => {
              const typeConfig = ESSAY_TYPES[essay.type] || ESSAY_TYPES.essay_subject;
              return (
                <div
                  key={essay.id}
                  className={`flex-1 h-1 rounded-full bg-gradient-to-r ${typeConfig.color}`}
                  title={showArabic ? typeConfig.labelArabic : typeConfig.label}
                />
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {essayGroup.essays.length} {showArabic ? 'أقسام' : 'sections'}
          </p>
        </div>
      </div>
    </button>
  );
};

const ProductionEcriteCards = ({ book, onBack, showArabic = false, user, onShowLogin, onShowRegistration }) => {
  const [exams, setExams] = useState([]);
  const [essayGroups, setEssayGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEssayGroup, setSelectedEssayGroup] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    loadAllEssays();
  }, [book.id]);

  const loadAllEssays = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const examsData = await essayAPI.getExamsByBook(book.id);
      setExams(examsData);
      
      const essayGroupsData = [];
      
      for (const exam of examsData) {
        try {
          const essays = await essayAPI.getEssayQuestionsByExam(exam.id);
          
          if (essays && essays.length > 0) {
            const sortedEssays = essays.sort((a, b) => {
              const order = ['essay_subject', 'essay_introduction', 'essay_development', 'essay_conclusion'];
              return order.indexOf(a.type) - order.indexOf(b.type);
            });
            
            essayGroupsData.push({
              examId: exam.id,
              examTitle: exam.title,
              examTitleArabic: exam.titleArabic,
              examYear: exam.year,
              essays: sortedEssays,
              previewText: sortedEssays.find(e => e.type === 'essay_subject')?.prompt || '',
              previewTextArabic: sortedEssays.find(e => e.type === 'essay_subject')?.promptArabic || '',
              totalPoints: sortedEssays.reduce((sum, e) => sum + (e.points || 0), 0)
            });
          }
        } catch (err) {
          console.error(`Error loading essays for exam ${exam.id}:`, err);
        }
      }
      
      setEssayGroups(essayGroupsData);
    } catch (err) {
      console.error('Error loading essays:', err);
      setError('Impossible de charger les questions d\'expression. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleEssayGroupClick = (essayGroup, index) => {
    const locked = isItemLocked(index, user, 1);
    if (locked) {
      if (onShowRegistration) {
        onShowRegistration();
      } else if (onShowLogin) {
        onShowLogin();
      }
      return;
    }

    const exam = exams.find(e => e.id === essayGroup.examId);
    if (exam && essayGroup.essays.length > 0) {
      setSelectedExam(exam);
      setSelectedEssayGroup(essayGroup.essays);
    }
  };

  const handleBackFromViewer = () => {
    setSelectedEssayGroup(null);
    setSelectedExam(null);
  };

  if (selectedEssayGroup && selectedExam) {
    return (
      <EssayViewer
        essay={selectedEssayGroup[0]}
        exam={selectedExam}
        book={book}
        onBack={handleBackFromViewer}
        allEssays={selectedEssayGroup}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <LoadingSpinner message="Chargement des questions d'expression..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6 md:mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 md:mb-6 font-medium text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              {showArabic ? 'العودة' : 'Retour'}
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-3 md:mb-4 mx-auto shadow-xl">
                <PenTool className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                {showArabic ? 'الإنتاج الكتابي' : 'Production Écrite'}
              </h1>
              <p className="text-base md:text-xl text-gray-600">
                {book.title}
              </p>
            </div>
          </header>

          {error && <ErrorAlert message={error} onRetry={loadAllEssays} />}

          {!error && (
            <>
              {essayGroups.length > 0 ? (
                <>
                  <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8 md:mb-12">
                    {essayGroups.map((essayGroup, index) => (
                      <EssayGroupCard
                        key={essayGroup.examId}
                        essayGroup={essayGroup}
                        examTitle={essayGroup.examTitle}
                        examYear={essayGroup.examYear}
                        onClick={() => handleEssayGroupClick(essayGroup, index)}
                        showArabic={showArabic}
                        isLocked={isItemLocked(index, user, 1)}
                        onShowRegistration={onShowRegistration}
                        index={index}
                      />
                    ))}
                  </div>

                  {/* Simple Footer Info Banner - Mobile Responsive */}
                  <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 rounded-xl p-4 md:p-6 border border-pink-100 shadow-sm">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <PenTool className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-pink-900 mb-2 text-base md:text-lg">
                          Production écrite guidée
                        </h3>
                        <p className="text-pink-800 text-xs md:text-sm leading-relaxed">
                          Entraînez-vous à la rédaction avec des exercices structurés : introduction, développement et conclusion. 
                          {!user && (
                            <span className="font-semibold"> Inscrivez-vous maintenant pour un accès complet à 200 DH pour toute l'année.</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
                  <PenTool className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                    {showArabic ? 'لا توجد أسئلة تعبيرية' : 'Aucune question d\'expression'}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {showArabic 
                      ? 'لم يتم العثور على أسئلة تعبيرية لهذا الكتاب'
                      : 'Aucune question d\'expression trouvée pour ce livre'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionEcriteCards;