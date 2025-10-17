import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Clock, MapPin, Calendar, ChevronRight, Lock } from 'lucide-react';
import { getExamsByYear } from './ExamData';
import { isItemLocked, LockedCard } from './FreemiumWrapper';

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
    if (isItemLocked(index, user, 1)) {
      if (onShowLogin) {
        onShowLogin();
      }
      return;
    }
    onExamSelect(exam);
  };

  const isLoading = loading || parentLoading;
  const displayError = error || parentError;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour aux années
            </button>
            
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${book.color} rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
              <p className="text-lg text-gray-600">
                Examens de {year?.year} - {exams.length} examen{exams.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="w-24"></div>
          </div>

          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Chargement des examens...</p>
            </div>
          )}

          {displayError && !isLoading && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{displayError}</p>
            </div>
          )}

          {!isLoading && !displayError && (
            <>
              {exams && exams.length > 0 ? (
                <>
                  <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {exams.map((exam, index) => {
                      const locked = isItemLocked(index, user, 1);
                      
                      if (locked) {
                        return (
                          <LockedCard
                            key={exam.id}
                            title={exam.title}
                            description={`${exam.region} • ${exam.year}`}
                            icon={FileText}
                            color={book.color}
                            onShowLogin={onShowLogin}
                            index={index}
                          />
                        );
                      }

                      return (
                        <div
                          key={exam.id}
                          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group cursor-pointer relative"
                          onClick={() => handleExamClick(exam, index)}
                        >
                          {index === 0 && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                              GRATUIT
                            </div>
                          )}
                          
                          <div className={`h-2 bg-gradient-to-r ${book.color}`}></div>
                          
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                                {exam.title}
                              </h3>
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                            </div>
                            
                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{exam.region}</span>
                              </div>
                              
                              <div className="flex items-center gap-3 text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{exam.year}</span>
                              </div>
                              
                              <div className="flex items-center gap-3 text-gray-600">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{exam.duration}</span>
                              </div>
                              
                              <div className="flex items-center gap-3 text-gray-600">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{exam.subject} - {exam.points} points</span>
                              </div>
                            </div>

                            {exam.textExtract?.content && (
                              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-2">Extrait du texte:</p>
                                <p className="text-sm text-gray-700 line-clamp-2">
                                  {exam.textExtract.content.substring(0, 120)}...
                                </p>
                              </div>
                            )}

                            {exam.titleArabic && (
                              <div className="mb-4 text-right">
                                <p className="text-sm text-gray-600" dir="rtl">
                                  {exam.titleArabic}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  {exam.questions ? exam.questions.length : 'N/A'} questions
                                </span>
                                {exam.textExtract?.sourceChapter && (
                                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Avec vidéo
                                  </span>
                                )}
                              </div>
                              
                              <button
                                className={`px-4 py-2 bg-gradient-to-r ${book.color} text-white rounded-lg font-medium transition-all hover:shadow-lg group-hover:scale-105`}
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

                  {!user && exams.length > 1 && (
                    <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-2">
                        {exams.length - 1} autre{exams.length - 1 > 1 ? 's' : ''} examen{exams.length - 1 > 1 ? 's' : ''} disponible{exams.length - 1 > 1 ? 's' : ''}
                      </h3>
                      <p className="text-blue-800 mb-6 max-w-lg mx-auto">
                        Créez un compte gratuit pour accéder à tous les examens officiels et préparer votre bac
                      </p>
                      <button
                        onClick={onShowLogin}
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                      >
                        Débloquer gratuitement
                      </button>
                      <p className="text-xs text-blue-600 mt-3">
                        100% gratuit • Aucune carte bancaire requise
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className={`w-24 h-24 bg-gradient-to-br ${book.color} rounded-full flex items-center justify-center mx-auto mb-6 opacity-50`}>
                    <FileText className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun examen disponible</h3>
                  <p className="text-gray-500">
                    Les examens pour "{book.title}" ({year?.year}) seront bientôt disponibles.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
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