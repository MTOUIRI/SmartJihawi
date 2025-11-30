import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ExamPlatformStructure from './Exam/ExamPlatformStructure';
import ExamList from './Content/ExamList';
import ChapterViewer from './Content/Chapters/ChapterViewer';
import YearSelector from './Content/YearSelector';
import { QCMViewer, QCMChapterList } from './Content/QCM/QCMViewer';
import { ExamComponentWrapper, initializeExamRegistry } from './Exam/examRegistry';
import ProductionEcriteCards from './Content/Essay/ProductionEcriteCards';
import RegistrationModal from './Registration/RegistrationModal';
import useDocumentTitle from './Hooks/useDocumentTitle';
import { 
  books, 
  getAllBooks, 
  getBookById, 
  initializeExamData
} from './Content/ExamData';
import { 
  BookOpen, 
  FileText, 
  Users, 
  ChevronRight, 
  ArrowLeft, 
  HelpCircle, 
  AlertCircle, 
  Loader2, 
  PenTool, 
  Lock, 
  LogIn, 
  UserPlus,
  Target,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';

const VIEWS = {
  BOOKS: 'books',
  BOOK_CONTENT: 'book-content',
  CHAPTERS: 'chapters',
  QCM_CHAPTERS: 'qcm-chapters',
  QCM_VIEWER: 'qcm-viewer',
  ESSAY_PRACTICE: 'essay-practice',
  YEARS: 'years',
  EXAMS: 'exams',
  EXAM: 'exam'
};

const CONTENT_TYPES = {
  CHAPTERS: {
    id: 'chapters',
    title: 'Chapitres & Résumés',
    description: 'Explorez les chapitres détaillés et les résumés complets du livre',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    action: 'Explorer'
  },
  QCM: {
    id: 'qcm',
    title: 'QCM par Chapitre',
    description: 'Testez vos connaissances avec des quiz interactifs organisés par chapitre',
    icon: HelpCircle,
    color: 'from-purple-500 to-purple-600',
    action: 'Commencer'
  },
  ESSAY: {
    id: 'essay',
    title: 'Production Écrite',
    description: 'Pratiquez l\'introduction, le développement et la conclusion séparément',
    icon: PenTool,
    color: 'from-pink-500 to-rose-600',
    action: 'S\'entraîner'
  },
  EXAMS: {
    id: 'exams',
    title: 'Examens Officiels',
    description: 'Entraînez-vous avec les examens officiels des années précédentes',
    icon: FileText,
    color: 'from-emerald-500 to-emerald-600',
    action: 'Accéder'
  }
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Platform Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Une erreur est survenue</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Nous nous excusons pour la gêne occasionnée. Veuillez actualiser la page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const LoadingSpinner = ({ message = 'Chargement...' }) => (
  <div className="flex flex-col items-center justify-center py-8 sm:py-12">
    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-spin mb-3 sm:mb-4" />
    <p className="text-gray-600 font-medium text-sm sm:text-base">{message}</p>
  </div>
);

const ErrorAlert = ({ message, onRetry }) => (
  <div className="max-w-2xl mx-auto mb-4 sm:mb-6">
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1 text-sm sm:text-base">Erreur de chargement</h3>
          <p className="text-red-700 text-xs sm:text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 sm:mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-xs sm:text-sm font-medium transition-colors"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ContentCard = ({ type, examCount, onClick }) => {
  const config = CONTENT_TYPES[type.toUpperCase()];
  
  if (!config) {
    console.error(`Invalid content type: ${type}`);
    return null;
  }
  
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 overflow-hidden group text-left w-full"
    >
      <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${config.color}`} />
      
      <div className="p-4 sm:p-5 md:p-6">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-md`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
        </div>
        
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors">
          {config.title}
        </h3>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed min-h-[32px] sm:min-h-[40px]">
          {config.description}
        </p>
        
        <div className="flex items-center justify-between">
          {type === 'exams' && examCount !== undefined && (
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
              examCount > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {examCount} examen{examCount !== 1 ? 's' : ''}
            </span>
          )}
          
          <div className="flex items-center gap-1.5 sm:gap-2 text-blue-600 font-semibold ml-auto">
            <span className="text-xs sm:text-sm">{config.action}</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );
};

const ExamPlatform = ({ user, onLogout, onShowStudentLogin }) => {
  const [currentBook, setCurrentBook] = useState('dernier-jour');
  const [currentView, setCurrentView] = useState(VIEWS.BOOKS);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booksData, setBooksData] = useState(books);
  const [initialized, setInitialized] = useState(false);
  
  // Registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Dynamic page title based on current view and context
const getPageTitle = () => {
  const bookData = getBookById(currentBook);
  const bookTitle = bookData ? bookData.title : '';

  switch (currentView) {
    case VIEWS.BOOKS:
      return 'Bibliothèque';
    
    case VIEWS.BOOK_CONTENT:
      return bookTitle;
    
    case VIEWS.CHAPTERS:
      return `Chapitres - ${bookTitle}`;
    
    case VIEWS.QCM_CHAPTERS:
      return `QCM - ${bookTitle}`;
    
    case VIEWS.QCM_VIEWER:
      if (selectedChapter) {
        return `QCM: ${selectedChapter.title} - ${bookTitle}`;
      }
      return `QCM - ${bookTitle}`;
    
    case VIEWS.ESSAY_PRACTICE:
      return `Production Écrite - ${bookTitle}`;
    
    case VIEWS.YEARS:
      return `Examens - ${bookTitle}`;
    
    case VIEWS.EXAMS:
      if (selectedYear) {
        // Fix: Access the year property from the selectedYear object
        return `Examens ${selectedYear.year} - ${bookTitle}`;
      }
      return `Examens - ${bookTitle}`;
    
    case VIEWS.EXAM:
      if (selectedExam) {
        return `${selectedExam.title || 'Examen'} - ${bookTitle}`;
      }
      return `Examen - ${bookTitle}`;
    
    default:
      return 'Plateforme d\'Apprentissage';
  }
};

  // Set dynamic page title
  useDocumentTitle(getPageTitle());

  const initializePlatform = useCallback(async () => {
    if (initialized) return;

    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        initializeExamData(),
        initializeExamRegistry()
      ]);
      
      setBooksData({ ...books });
      setInitialized(true);
    } catch (err) {
      console.error('Platform initialization error:', err);
      setError('Échec de l\'initialisation de la plateforme. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  useEffect(() => {
    initializePlatform();
  }, [initializePlatform]);

  const resetNavigationState = useCallback(() => {
    setCurrentSlide(0);
    setUserAnswers({});
    setShowAnswers(false);
    setError(null);
  }, []);

  const handleBookChange = useCallback((bookKey) => {
    setCurrentBook(bookKey);
    setCurrentView(VIEWS.BOOK_CONTENT);
    setSelectedExam(null);
    setSelectedYear(null);
    setSelectedChapter(null);
    resetNavigationState();
  }, [resetNavigationState]);

  const handleYearSelect = useCallback((year) => {
    setSelectedYear(year);
    setCurrentView(VIEWS.EXAMS);
    resetNavigationState();
  }, [resetNavigationState]);

  const handleExamSelect = useCallback((exam) => {
    setSelectedExam(exam);
    setCurrentView(VIEWS.EXAM);
    resetNavigationState();
  }, [resetNavigationState]);

  const handleChapterSelect = useCallback((chapter) => {
    setSelectedChapter(chapter);
    setCurrentView(VIEWS.QCM_VIEWER);
  }, []);

  const handleAnswerChange = useCallback((questionId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  const navigateToView = useCallback((view, resetSelections = {}) => {
    setCurrentView(view);
    if (resetSelections.exam !== undefined) setSelectedExam(resetSelections.exam);
    if (resetSelections.year !== undefined) setSelectedYear(resetSelections.year);
    if (resetSelections.chapter !== undefined) setSelectedChapter(resetSelections.chapter);
    resetNavigationState();
  }, [resetNavigationState]);

  const handleBackToBooks = useCallback(() => {
    navigateToView(VIEWS.BOOKS, { exam: null, year: null, chapter: null });
  }, [navigateToView]);

  const handleBackToBookContent = useCallback(() => {
    navigateToView(VIEWS.BOOK_CONTENT, { exam: null, year: null, chapter: null });
  }, [navigateToView]);

  const handleBackToYears = useCallback(() => {
    navigateToView(VIEWS.YEARS, { exam: null });
  }, [navigateToView]);

  const handleBackToExams = useCallback(() => {
    navigateToView(VIEWS.EXAMS, { exam: null });
  }, [navigateToView]);

  const handleBackToQCMChapters = useCallback(() => {
    navigateToView(VIEWS.QCM_CHAPTERS, { chapter: null });
  }, [navigateToView]);

  const handleHeaderClick = useCallback(() => {
    setCurrentBook('dernier-jour');
    navigateToView(VIEWS.BOOKS, { exam: null, year: null, chapter: null });
  }, [navigateToView]);

  const handleShowExams = useCallback(() => setCurrentView(VIEWS.YEARS), []);
  const handleShowChapters = useCallback(() => setCurrentView(VIEWS.CHAPTERS), []);
  const handleShowQCM = useCallback(() => setCurrentView(VIEWS.QCM_CHAPTERS), []);
  const handleShowEssay = useCallback(() => setCurrentView(VIEWS.ESSAY_PRACTICE), []);

  // Registration handlers
  const handleShowRegistration = useCallback(() => {
    setShowRegistrationModal(true);
  }, []);

  const handleCloseRegistration = useCallback(() => {
    setShowRegistrationModal(false);
  }, []);

  const handleRegister = useCallback((formData) => {
    console.log('Registration data:', formData);
    alert('Inscription réussie ! Votre compte sera activé après vérification du paiement.');
    setShowRegistrationModal(false);
  }, []);

  const currentBookData = useMemo(() => getBookById(currentBook), [currentBook]);

  const renderExamComponent = () => {
    if (!selectedExam || !currentBookData) return null;

    return (
      <ExamComponentWrapper
        examId={selectedExam.id}
        examData={selectedExam}
        book={currentBookData}
        currentSlide={currentSlide}
        onSlideChange={setCurrentSlide}
        showAnswers={showAnswers}
        userAnswers={userAnswers}
        onAnswerChange={handleAnswerChange}
        onBack={handleBackToExams}
      />
    );
  };

  const renderBookContentSelection = () => {
    if (!currentBookData) return null;

    const examCount = currentBookData.examCount || 0;

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <header className="mb-6 sm:mb-8">
              <button
                onClick={handleBackToBooks}
                className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 sm:mb-6 font-medium text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Retour à la bibliothèque
              </button>
              
              <div className="text-center">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${currentBookData.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-xl`}>
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1.5 sm:mb-2 px-4">
                  {currentBookData.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600">par {currentBookData.author}</p>
              </div>
            </header>

            {loading && <LoadingSpinner message="Chargement des contenus..." />}
            {error && <ErrorAlert message={error} onRetry={initializePlatform} />}

            {!loading && !error && (
              <>
                <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
                  <ContentCard
                    type="chapters"
                    onClick={handleShowChapters}
                  />
                  <ContentCard
                    type="qcm"
                    onClick={handleShowQCM}
                  />
                  <ContentCard
                    type="essay"
                    onClick={handleShowEssay}
                  />
                  <ContentCard
                    type="exams"
                    examCount={examCount}
                    onClick={handleShowExams}
                  />
                </div>

                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-blue-100 shadow-sm">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1.5 sm:mb-2 text-base sm:text-lg">
                        Plateforme d'apprentissage interactive
                      </h3>
                      <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                        Accédez à des ressources pédagogiques complètes : résumés détaillés, 
                        quiz interactifs, pratique d'expression écrite et examens officiels. 
                        {!user && (
                          <span className="font-semibold"> Inscrivez-vous maintenant pour un accès complet à 200 DH pour toute l'année.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBooksLibrary = () => {
    const allBooks = getAllBooks();

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                Choisissez un livre pour commencer
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Une solution complète pour votre préparation aux examens : 
                chapitres détaillés, QCM interactifs, pratique d'expression écrite et examens officiels
              </p>
            </header>

            {loading && <LoadingSpinner message="Chargement de la bibliothèque..." />}
            {error && <ErrorAlert message={error} onRetry={initializePlatform} />}

            {!loading && !error && (
              <>
                {/* Books Grid - Responsive */}
                <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-14 md:mb-16">
                  {allBooks.map((book) => {
                    const bookCovers = {
                      'boite-merveilles': '/Images/boite.png',
                      'antigone': '/Images/antigone.png',
                      'dernier-jour': '/Images/dernier-jour.jpg'
                    };

                    return (
                      <button
                        key={book.id}
                        onClick={() => handleBookChange(book.id)}
                        className="relative bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-200 hover:border-gray-300 text-left overflow-hidden h-72 sm:h-80 md:h-96"
                      >
                        {/* Book Cover Image */}
                        <div className="absolute inset-0">
                          <img 
                            src={bookCovers[book.id]} 
                            alt={`Couverture de ${book.title}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        </div>

                        {/* Card Content */}
                        <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 md:p-6 z-10">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2 group-hover:text-blue-300 transition-colors drop-shadow-lg">
                            {book.title}
                          </h3>
                          
                          <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm drop-shadow-md">par {book.author}</p>
                          
                          <div className="flex items-center justify-end">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-white font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg group-hover:from-emerald-600 group-hover:to-teal-700 transition-all">
                              <span className="text-xs sm:text-sm">Explorer</span>
                              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* CTA Section - Responsive */}
                {!user && (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl mb-12 sm:mb-14 md:mb-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                      <div className="flex-1 text-white text-center md:text-left">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
                          Prêt à commencer votre préparation ?
                        </h3>
                        <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                          Rejoignez des centaines d'étudiants qui réussissent leurs examens avec SmartBac
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 sm:gap-3 text-blue-100 text-sm sm:text-base justify-center md:justify-start">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span>• Accès illimité à tous les contenus</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 text-blue-100 text-sm sm:text-base justify-center md:justify-start">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span>Accès au groupe WhatsApp de préparation collective</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 flex-shrink-0 w-full sm:w-auto">
                        <button
                          onClick={handleShowRegistration}
                          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-bold rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 text-base sm:text-lg"
                        >
                          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                          S'inscrire maintenant
                        </button>
                        <button
                          onClick={onShowStudentLogin}
                          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm border-2 border-white/30 text-sm sm:text-base"
                        >
                          Déjà inscrit ? Se connecter
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <footer className="pt-6 sm:pt-8 border-t border-gray-200">
                  <div className="text-center text-gray-600">
                    <p className="text-xs sm:text-sm mb-2">
                      © 2025 SmartBac. Tous droits réservés.
                    </p>
                    <p className="text-xs text-gray-500">
                      Plateforme d'apprentissage pour la littérature française • 1ère Bac
                    </p>
                  </div>
                </footer>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case VIEWS.BOOK_CONTENT:
        return renderBookContentSelection();
      
      case VIEWS.CHAPTERS:
        return (
          <ChapterViewer
            book={currentBookData}
            onBack={handleBackToBookContent}
            user={user}
            onShowLogin={onShowStudentLogin}
          />
        );
      
      case VIEWS.QCM_CHAPTERS:
        return (
          <QCMChapterList
            book={currentBookData}
            onChapterSelect={handleChapterSelect}
            onBack={handleBackToBookContent}
            user={user}
            onShowLogin={onShowStudentLogin}
          />
        );
      
      case VIEWS.QCM_VIEWER:
        return selectedChapter ? (
          <QCMViewer
            book={currentBookData}
            chapter={selectedChapter}
            onBack={handleBackToQCMChapters}
            user={user}
            onShowLogin={onShowStudentLogin}
          />
        ) : null;
      
      case VIEWS.ESSAY_PRACTICE:
        return (
          <ProductionEcriteCards
            book={currentBookData}
            onBack={handleBackToBookContent}
            showArabic={false}
            user={user}
            onShowLogin={onShowStudentLogin}
          />
        );
      
      case VIEWS.YEARS:
        return (
          <YearSelector
            book={currentBookData}
            onYearSelect={handleYearSelect}
            onBack={handleBackToBookContent}
            loading={loading}
            error={error}
          />
        );
      
      case VIEWS.EXAMS:
        return (
          <ExamList
            book={currentBookData}
            year={selectedYear}
            onExamSelect={handleExamSelect}
            onBack={handleBackToYears}
            loading={loading}
            error={error}
            user={user}
            onShowLogin={onShowStudentLogin}
          />
        );
      
      case VIEWS.EXAM:
        return renderExamComponent();
      
      case VIEWS.BOOKS:
      default:
        return renderBooksLibrary();
    }
  };

  return (
    <ErrorBoundary>
      <ExamPlatformStructure
        currentBook={currentBook}
        books={booksData}
        onBookChange={handleBookChange}
        onHeaderClick={handleHeaderClick}
        showAnswers={showAnswers}
        onToggleAnswers={() => setShowAnswers(!showAnswers)}
        user={user}
        onLogout={onLogout}
        onShowStudentLogin={onShowStudentLogin}
      >
        {renderContent()}
      </ExamPlatformStructure>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={handleCloseRegistration}
        onRegister={handleRegister}
      />
    </ErrorBoundary>
  );
};

export default ExamPlatform;