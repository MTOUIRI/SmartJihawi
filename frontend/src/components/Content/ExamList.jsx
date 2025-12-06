import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Clock, MapPin, Calendar, ChevronRight, Lock } from 'lucide-react';
import { getExamsByYear } from './ExamData';

// HYBRID FREEMIUM STRATEGY
// - 2022: All exams FREE (most recent year)
// - 2021: First 2 exams FREE (preview of archive)
// - 2020 and older: All LOCKED (register to access)

const isExamFree = (exam, examIndex, user) => {
  if (user) return true; // All exams free for logged-in users
  
  const yearNum = parseInt(exam.year);
  
  // 2022: All exams free
  if (yearNum === 2022) return true;
  
  // 2021: First 2 exams free
  if (yearNum === 2021 && examIndex < 2) return true;
  
  // All other years: locked
  return false;
};

const ExamList = ({ book, year, onExamSelect, onBack, loading: parentLoading, error: parentError, user, onShowLogin }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadExams = async () => {
      if (!book?.id || !year?.id) return;
      
      setLoading(true);
      setError('');
      
      try {
        const examData = await getExamsByYear(book.id, year.id);
        setExams(examData);
      } catch (err) {
        console.error('Error loading exams:', err);
        setError('Erreur lors du chargement des examens');
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [book?.id, year?.id]);

  const handleExamClick = (exam, index) => {
    // Check if exam is free using hybrid strategy
    const examFree = isExamFree(exam, index, user);
    
    if (!examFree) {
      if (onShowLogin) {
        onShowLogin();
      }
      return;
    }
    onExamSelect(exam);
  };

  const isLoading = loading || parentLoading;
  const displayError = error || parentError;

  // Calculate free and locked counts based on hybrid strategy
  const freeExamsCount = user 
    ? exams.length 
    : exams.filter((exam, index) => isExamFree(exam, index, false)).length;
  
  const lockedExamsCount = exams.length - freeExamsCount;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline text-sm md:text-base">Retour aux années</span>
              <span className="sm:hidden text-sm">Retour</span>
            </button>
            
            <div className="text-center flex-1 mx-4">
              <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${book.color} rounded-full flex items-center justify-center mb-2 md:mb-4 mx-auto shadow-lg`}>
                <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">{book.title}</h1>
              <p className="text-sm md:text-lg text-gray-600">
                Examens de {year?.year}
              </p>
            </div>
            
            <div className="w-16 md:w-24"></div>
          </div>

          {isLoading && (
            <div className="text-center py-12 md:py-16">
              <div className="inline-block animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-sm md:text-base text-gray-600">Chargement des examens...</p>
            </div>
          )}

          {displayError && !isLoading && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm md:text-base text-red-600">{displayError}</p>
            </div>
          )}

          {!isLoading && !displayError && (
            <>
              {exams && exams.length > 0 ? (
                <>
                  <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
                    {exams.map((exam, index) => {
                      // Check if exam is locked using hybrid strategy
                      const locked = !isExamFree(exam, index, user);

                      return (
                        <div
                          key={exam.id}
                          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group cursor-pointer relative"
                          onClick={() => handleExamClick(exam, index)}
                        >
                          {/* Lock overlay for locked exams */}
                          {locked && (
                            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                                  <Lock className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm font-bold text-blue-900">Créer un compte</p>
                              </div>
                            </div>
                          )}

                          {/* Show GRATUIT badge on free exams for non-users */}
                          {!user && !locked && (
                            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-green-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-bold z-20">
                              GRATUIT
                            </div>
                          )}
                          
                          <div className={`h-2 bg-gradient-to-r ${book.color}`}></div>
                          
                          <div className="p-4 md:p-6">
                            <div className="flex items-start justify-between mb-3 md:mb-4">
                              <h3 className="text-base md:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight pr-2">
                                {exam.title}
                              </h3>
                              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                            </div>
                            
                            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                              <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-xs md:text-sm">{exam.region}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                                <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-xs md:text-sm">{exam.year}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                                <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-xs md:text-sm">{exam.duration}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                                <FileText className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-xs md:text-sm">{exam.subject} - {exam.points} points</span>
                              </div>
                            </div>

                            {exam.textExtract?.content && (
                              <div className="mb-3 md:mb-4 p-2 md:p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1 md:mb-2">Extrait du texte:</p>
                                <p className="text-xs md:text-sm text-gray-700 line-clamp-2">
                                  {exam.textExtract.content.substring(0, 120)}...
                                </p>
                              </div>
                            )}

                            {exam.titleArabic && (
                              <div className="mb-3 md:mb-4 text-right">
                                <p className="text-xs md:text-sm text-gray-600" dir="rtl">
                                  {exam.titleArabic}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  {exam.questions ? exam.questions.length : 'N/A'} questions
                                </span>
                                {exam.textExtract?.sourceChapter && (
                                  <span className="px-2 md:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Avec vidéo
                                  </span>
                                )}
                              </div>
                              
                              <button
                                className={`w-full sm:w-auto px-4 py-2 bg-gradient-to-r ${book.color} text-white rounded-lg text-sm md:text-base font-medium transition-all hover:shadow-lg group-hover:scale-105`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExamClick(exam, index);
                                }}
                              >
                                Commencer
                              </button>
                            </div>

                            {exam.createdAt && (
                              <div className="mt-2 text-xs text-gray-400">
                                Créé le: {new Date(exam.createdAt).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!user && lockedExamsCount > 0 && (
                    <div className="mt-6 md:mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6 md:p-8 text-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">
                        {lockedExamsCount} autre{lockedExamsCount > 1 ? 's' : ''} examen{lockedExamsCount > 1 ? 's' : ''} disponible{lockedExamsCount > 1 ? 's' : ''}
                      </h3>
                      <p className="text-sm md:text-base text-blue-800 mb-4 md:mb-6 max-w-lg mx-auto">
                        Accédez à tous les examens ({parseInt(year?.year) === 2022 
                          ? 'archives 2010-2021' 
                          : parseInt(year?.year) === 2021
                            ? 'tous les examens de 2021 + archives'
                            : 'tous les examens et archives'}) avec corrections détaillées, vidéos explicatives et production écrite guidée.
                        <span className="font-semibold block mt-2">200 DH pour toute l'année scolaire 2025-2026</span>
                      </p>
                      <button
                        onClick={onShowLogin}
                        className="px-6 md:px-8 py-2 md:py-3 bg-blue-600 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                      >
                        S'inscrire maintenant
                      </button>
                      <p className="text-xs text-blue-600 mt-2 md:mt-3">
                        Paiement unique • Pas d'abonnement récurrent
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 md:py-16">
                  <div className={`w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br ${book.color} rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 opacity-50`}>
                    <FileText className="w-8 h-8 md:w-12 md:h-12 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-600 mb-2">Aucun examen disponible</h3>
                  <p className="text-sm md:text-base text-gray-500 px-4">
                    Les examens pour "{book.title}" ({year?.year}) seront bientôt disponibles.
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mt-2 px-4">
                    Vérifiez la base de données ou ajoutez des examens via le panel d'administration.
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

export default ExamList;