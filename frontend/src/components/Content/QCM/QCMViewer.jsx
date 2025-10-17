import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Award, RefreshCw, HelpCircle, Globe, BookOpen, Lock, LogIn, UserPlus } from 'lucide-react';
import { isItemLocked, LockedCard } from '../FreemiumWrapper';

// QCM Viewer Component
const QCMViewer = ({ book, chapter, onBack, user, onShowLogin, onShowRegistration, chapterIndex = 0 }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showArabic, setShowArabic] = useState(false);

  // Check if this chapter is accessible (first one is free)
  const isLocked = isItemLocked(chapterIndex, user, 1);

  useEffect(() => {
    if (isLocked) {
      setLoading(false);
      return;
    }
    loadQCMQuestions();
  }, [chapter, isLocked]);

  const loadQCMQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost:8080/api/qcm/chapter/${chapter.id}`, {
        headers
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Vous devez être connecté pour accéder à ce QCM');
        }
        throw new Error('Erreur lors du chargement des questions');
      }
      
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    if (showResults) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    });
    return { correct, total: questions.length };
  };

  // Show locked preview if chapter is locked
  if (isLocked && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour aux chapitres
              </button>
              
              <button
                onClick={() => setShowArabic(!showArabic)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {showArabic ? 'FR' : 'AR'}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {chapter.title}
              </h2>
            </div>

            {/* Locked Question Preview */}
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white/95 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Contenu Premium
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Inscrivez-vous pour accéder à ce QCM et débloquer tous les quiz pour seulement 200 DH/an
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={onShowRegistration || onShowLogin}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      S'inscrire maintenant
                    </button>
                    <button
                      onClick={onShowLogin}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 border-2 border-purple-200 transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Se connecter
                    </button>
                  </div>
                </div>
              </div>

              {/* Blurred Question Preview */}
              <div className="blur-sm select-none pointer-events-none">
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                    Question d'exemple sur le chapitre
                  </h3>
                  
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 md:p-5 rounded-xl bg-gray-50 border-2 border-gray-200"
                      >
                        <input
                          type="radio"
                          disabled
                          className="w-5 h-5"
                        />
                        <span className="flex-1 text-gray-800 font-medium">
                          Option {i}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        0 / 10 questions répondues
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        0%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full w-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-purple-900 mb-2 text-lg">
                    QCM interactifs et corrigés
                  </h3>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    Testez vos connaissances avec des quiz interactifs, obtenez des corrections instantanées et suivez votre progression. 
                    {!user && (
                      <span className="font-semibold"> Créez un compte gratuit pour accéder à tous les QCM.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">
          {showArabic ? 'جاري تحميل الأسئلة...' : 'Chargement des questions...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" />
            {showArabic ? 'رجوع' : 'Retour'}
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" />
            {showArabic ? 'رجوع' : 'Retour'}
          </button>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <HelpCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <p className="text-yellow-800">
              {showArabic ? 'لا توجد أسئلة متاحة لهذا الفصل' : 'Aucune question QCM disponible pour ce chapitre'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const score = showResults ? calculateScore() : null;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {showArabic ? 'رجوع إلى الفصول' : 'Retour aux chapitres'}
            </button>
            
            <div className="flex items-center gap-4">
              {!showResults && (
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">
                    {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>
              )}
              
              <button
                onClick={() => setShowArabic(!showArabic)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
                title={showArabic ? 'Passer au français' : 'التبديل إلى العربية'}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {showArabic ? 'FR' : 'AR'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              showResults
                ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}>
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {chapter.title}
            </h2>
          </div>

          {showResults ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="text-center mb-8">
                <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                  score.correct / score.total >= 0.7
                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                    : score.correct / score.total >= 0.5
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                    : 'bg-gradient-to-br from-red-400 to-red-600'
                }`}>
                  <Award className="w-12 h-12 md:w-14 md:h-14 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {score.correct} / {score.total}
                </h3>
                <p className="text-lg text-gray-600">
                  {showArabic ? 'النتيجة' : 'Score'}: {Math.round((score.correct / score.total) * 100)}%
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {questions.map((q, idx) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;
                  
                  return (
                    <div key={q.id} className={`border-2 rounded-xl p-4 md:p-5 transition-all ${
                      isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
                    }`}>
                      <div className="flex items-start gap-3 mb-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`font-semibold text-gray-800 mb-3 text-base md:text-lg ${showArabic ? 'text-right' : ''}`}>
                            {showArabic ? 'السؤال' : 'Question'} {idx + 1}: {showArabic && q.questionArabic ? q.questionArabic : q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options.map(opt => {
                              const optionText = showArabic && opt.textArabic ? opt.textArabic : opt.text;
                              return (
                                <div
                                  key={opt.id}
                                  className={`text-sm p-3 rounded-lg ${showArabic ? 'text-right' : ''} ${
                                    opt.id === q.correctAnswer
                                      ? 'bg-green-200 text-green-900 font-semibold'
                                      : opt.id === userAnswer
                                      ? 'bg-red-200 text-red-900'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {opt.id}) {optionText}
                                  {opt.id === q.correctAnswer && (showArabic ? ' ✓ الإجابة الصحيحة' : ' ✓ Bonne réponse')}
                                  {opt.id === userAnswer && opt.id !== q.correctAnswer && (showArabic ? ' ✗ إجابتك' : ' ✗ Votre réponse')}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-8 py-3 md:py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  {showArabic ? 'إعادة المحاولة' : 'Recommencer'}
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-3 md:py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  {showArabic ? 'رجوع إلى الفصول' : 'Retour aux chapitres'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="mb-8">
                <h3 className={`text-xl md:text-2xl font-bold text-gray-800 mb-6 ${showArabic ? 'text-right' : ''}`}>
                  {showArabic && currentQuestion.questionArabic ? currentQuestion.questionArabic : currentQuestion.question}
                </h3>
                
                <div className="space-y-3">
                  {currentQuestion.options.map(option => {
                    const optionText = showArabic && option.textArabic ? option.textArabic : option.text;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center gap-4 p-4 md:p-5 rounded-xl cursor-pointer transition-all border-2 ${
                          userAnswers[currentQuestion.id] === option.id
                            ? 'bg-blue-50 border-blue-500 shadow-md'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
                        } ${showArabic ? 'flex-row-reverse' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={option.id}
                          checked={userAnswers[currentQuestion.id] === option.id}
                          onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="flex-1 text-gray-800 font-medium text-sm md:text-base" dir={showArabic ? 'rtl' : 'ltr'}>
                          {option.id}) {optionText}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {showArabic 
                        ? `${Object.keys(userAnswers).length} / ${questions.length} أسئلة مجابة`
                        : `${Object.keys(userAnswers).length} / ${questions.length} questions répondues`
                      }
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {Math.round((Object.keys(userAnswers).length / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(Object.keys(userAnswers).length / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 md:gap-4">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 md:px-8 py-3 text-gray-700 font-semibold border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all"
                  >
                    {showArabic ? 'السابق' : 'Précédent'}
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                      className="px-6 md:px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      {showArabic ? 'التالي' : 'Suivant'}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={Object.keys(userAnswers).length !== questions.length}
                      className="px-6 md:px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {showArabic ? 'إنهاء' : 'Terminer'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer Info Banner */}
          {!showResults && (
            <div className="mt-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2 text-lg">
                    QCM interactifs et corrigés
                  </h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Testez vos connaissances avec des quiz interactifs, obtenez des corrections instantanées et suivez votre progression. 
                    {!user && (
                      <span className="font-semibold"> Inscrivez-vous maintenant pour un accès complet à 200 DH pour toute l'année.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// QCM Chapter List Component
const QCMChapterList = ({ book, onChapterSelect, onBack, user, onShowLogin, onShowRegistration }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChapters();
  }, [book]);

  const loadChapters = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8080/api/chapters/book/${book.id}`);
      
      if (!response.ok) throw new Error('Erreur lors du chargement des chapitres');
      
      const data = await response.json();
      
      const chaptersWithQCM = await Promise.all(
        data.map(async (chapter) => {
          try {
            const qcmResponse = await fetch(`http://localhost:8080/api/qcm/chapter/${chapter.id}/count`);
            const qcmData = await qcmResponse.json();
            return { ...chapter, qcmCount: qcmData.count || 0 };
          } catch {
            return { ...chapter, qcmCount: 0 };
          }
        })
      );
      
      setChapters(chaptersWithQCM.filter(ch => ch.qcmCount > 0));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = (chapter, index) => {
    const locked = isItemLocked(index, user, 1);
    if (locked) {
      if (onShowRegistration) {
        onShowRegistration();
      } else if (onShowLogin) {
        onShowLogin();
      }
      return;
    }
    onChapterSelect(chapter, index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Chargement des chapitres...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            
            <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${book.color} rounded-2xl flex items-center justify-center shadow-xl`}>
              <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            
            <div className="w-16 md:w-24"></div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">QCM par Chapitre</h1>
            <p className="text-lg md:text-xl text-gray-600">{book.title}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {chapters.length === 0 && !error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
              <HelpCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <p className="text-yellow-800 text-lg">Aucun QCM disponible pour ce livre</p>
            </div>
          )}

          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter, index) => {
              const locked = isItemLocked(index, user, 1);

              return (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter, index)}
                  className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all text-left group overflow-hidden"
                >
                  {/* Lock overlay for locked chapters */}
                  {locked && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-bold text-purple-900">Premium</p>
                      </div>
                    </div>
                  )}

                  {index === 0 && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-20">
                      GRATUIT
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                      {chapter.qcmCount} Q
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors mb-2">
                    {chapter.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{chapter.resume}</p>
                </button>
              );
            })}
          </div>

          {/* Info Footer Banner */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-purple-900 mb-2 text-lg">
                  QCM interactifs et corrigés
                </h3>
                <p className="text-purple-800 text-sm leading-relaxed">
                  Testez vos connaissances avec des quiz interactifs, obtenez des corrections instantanées et suivez votre progression. 
                  {!user && (
                    <span className="font-semibold"> Inscrivez-vous maintenant pour un accès complet à 200 DH pour toute l'année.</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { QCMViewer, QCMChapterList };