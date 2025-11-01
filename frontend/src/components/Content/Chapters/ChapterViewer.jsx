import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, BookOpen, Clock, ChevronLeft, ChevronRight, Menu, X, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import API_URL from '../../../config';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || API_URL,
  timeout: 10000
};

// Loading Component
const LoadingState = ({ message = 'Chargement des chapitres...' }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="text-center p-6 md:p-8">
      <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-blue-600 animate-spin mx-auto mb-4" />
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{message}</h2>
      <p className="text-sm md:text-base text-gray-600">Veuillez patienter</p>
    </div>
  </div>
);

// Error Component
const ErrorState = ({ error, onRetry, onBack }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
      </div>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
      <p className="text-sm md:text-base text-gray-600 mb-6">{error}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
          >
            Réessayer
          </button>
        )}
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm md:text-base"
          >
            Retour
          </button>
        )}
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ onBack }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
      </div>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Aucun chapitre disponible</h2>
      <p className="text-sm md:text-base text-gray-600 mb-6">
        Ce livre ne contient pas encore de chapitres. Revenez plus tard.
      </p>
      <button
        onClick={onBack}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
      >
        Retour à la bibliothèque
      </button>
    </div>
  </div>
);

// Chapter Sidebar Item Component
const ChapterSidebarItem = ({ chapter, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 md:p-4 rounded-xl transition-all group relative ${
        isActive
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm'
          : 'bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-2 md:gap-3">
        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0 ${
          isActive
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
        }`}>
          {chapter.chapterNumber}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-xs md:text-sm leading-tight mb-1 md:mb-1.5 line-clamp-2 ${
            isActive ? 'text-blue-900' : 'text-gray-800'
          }`}>
            {chapter.title}
          </h3>
          <div className="flex items-center gap-1.5 md:gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>{chapter.duration}</span>
          </div>
        </div>
        {isActive && (
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
        )}
      </div>
    </button>
  );
};

// Video Player Component
const VideoPlayer = ({ videoUrl, title, duration }) => {
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    if (videoUrl) {
      setEmbedUrl(getYouTubeEmbedUrl(videoUrl));
    }
  }, [videoUrl]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    
    let videoId = '';
    
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : '';
  };

  if (!embedUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center p-6 md:p-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
          </div>
          <p className="text-base md:text-lg font-semibold text-gray-700 mb-1">Vidéo du chapitre</p>
          <p className="text-xs md:text-sm text-gray-500">Durée: {duration}</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      className="w-full h-full"
      src={embedUrl}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
};

// Main Chapter Viewer Component
const ChapterViewer = ({ book, onBack, user, onShowLogin }) => {
  const [activeChapter, setActiveChapter] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  const apiCall = useCallback(async (endpoint, requiresAuth = false) => {
    const token = getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(requiresAuth && token && { 'Authorization': `Bearer ${token}` }),
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

      const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('La requête a expiré. Veuillez réessayer.');
      }
      console.error('API Error:', error);
      throw error;
    }
  }, [getAuthToken]);

  const loadChapters = useCallback(async (bookId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiCall(`/chapters/book/${bookId}`, false);
      
      if (!Array.isArray(data)) {
        throw new Error('Format de données invalide');
      }

      const sortedChapters = data.sort((a, b) => a.chapterNumber - b.chapterNumber);
      console.log('Loaded chapters:', sortedChapters.length, 'chapters');
      console.log('Chapter numbers:', sortedChapters.map(ch => ch.chapterNumber));
      setChapters(sortedChapters);
      
      if (sortedChapters.length > 0) {
        setActiveChapter(sortedChapters[0].chapterNumber);
      }
    } catch (err) {
      try {
        const data = await apiCall(`/chapters/book/${bookId}`, true);
        
        if (!Array.isArray(data)) {
          throw new Error('Format de données invalide');
        }

        const sortedChapters = data.sort((a, b) => a.chapterNumber - b.chapterNumber);
        console.log('Loaded chapters (authenticated):', sortedChapters.length, 'chapters');
        console.log('Chapter numbers:', sortedChapters.map(ch => ch.chapterNumber));
        setChapters(sortedChapters);
        
        if (sortedChapters.length > 0) {
          setActiveChapter(sortedChapters[0].chapterNumber);
        }
      } catch (authErr) {
        setError(authErr.message || 'Impossible de charger les chapitres');
        setChapters([]);
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    if (book?.id) {
      loadChapters(book.id);
    }
  }, [book?.id, loadChapters]);

  const currentChapter = useMemo(
    () => chapters.find(ch => ch.chapterNumber === activeChapter),
    [chapters, activeChapter]
  );

  const chapterNumbers = useMemo(
    () => chapters.map(ch => ch.chapterNumber).sort((a, b) => a - b),
    [chapters]
  );

  const currentIndex = useMemo(
    () => chapterNumbers.indexOf(activeChapter),
    [chapterNumbers, activeChapter]
  );

  const handleChapterSelect = useCallback((chapterNumber) => {
    setActiveChapter(chapterNumber);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToPrevChapter = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setActiveChapter(chapterNumbers[prevIndex]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex, chapterNumbers]);

  const goToNextChapter = useCallback(() => {
    if (currentIndex < chapterNumbers.length - 1) {
      const nextIndex = currentIndex + 1;
      setActiveChapter(chapterNumbers[nextIndex]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex, chapterNumbers]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => loadChapters(book.id)} onBack={onBack} />;
  }

  if (chapters.length === 0) {
    return <EmptyState onBack={onBack} />;
  }

  if (!currentChapter) {
    return <ErrorState error="Chapitre introuvable" onBack={onBack} />;
  }

  const isFirstChapter = currentIndex === 0;
  const isLastChapter = currentIndex === chapterNumbers.length - 1;

  return (
    <div className="flex h-screen bg-gray-50">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scrollbar-color: transparent transparent;
        }
      `}</style>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-45 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Responsive */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative z-50 lg:z-0 w-72 md:w-80 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none overflow-hidden`}>
        
        <div className="p-4 md:p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className={`w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br ${book.color} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm md:text-base font-bold text-gray-900 leading-tight truncate">
                  {book.title}
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  {chapters.length} chapitre{chapters.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-4 scrollbar-hide">
          <div className="space-y-2 pb-20">
            {chapters.map((chapter) => (
              <ChapterSidebarItem
                key={chapter.id}
                chapter={chapter}
                isActive={activeChapter === chapter.chapterNumber}
                onClick={() => handleChapterSelect(chapter.chapterNumber)}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content - Mobile Responsive */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white">
        
        {/* Header - Fixed Position (always stays at top) */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-3 md:px-4 lg:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm z-30">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <span className="px-2 md:px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md flex-shrink-0">
                CH {activeChapter}
              </span>
              <div className="w-px h-4 bg-gray-300 flex-shrink-0 hidden sm:block"></div>
              <h1 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-900 truncate">
                {currentChapter.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
            <button
              onClick={goToPrevChapter}
              disabled={isFirstChapter}
              className={`p-1.5 md:p-2 rounded-lg transition-all ${
                isFirstChapter
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Chapitre précédent"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={goToNextChapter}
              disabled={isLastChapter}
              className={`p-1.5 md:p-2 rounded-lg transition-all ${
                isLastChapter
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Chapitre suivant"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* Video Container - Fixed aspect ratio on all devices */}
          <div className="bg-black w-full">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <div className="absolute inset-0">
              <VideoPlayer
                videoUrl={currentChapter.videoUrl}
                title={`${currentChapter.title} - Chapitre ${activeChapter}`}
                duration={currentChapter.duration}
              />
            </div>
          </div>
        </div>

        {/* Content Area - Part of main scroll */}
        <div className="bg-gray-50">
          <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
            
            {/* Resume Card - Visible on all devices */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">Résumé du chapitre</h3>
              </div>
              
              {currentChapter.resume ? (
                <div className="prose prose-sm md:prose-base max-w-none">
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                    {currentChapter.resume}
                  </p>
                </div>
              ) : (
                <div className="text-sm md:text-base text-gray-500 italic">
                  Le résumé de ce chapitre sera bientôt disponible.
                </div>
              )}
            </div>

            {/* Navigation Buttons - Mobile Responsive */}
            <div className="flex items-center justify-between gap-3 md:gap-4 pt-4 pb-8">
              <button
                onClick={goToPrevChapter}
                disabled={isFirstChapter}
                className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all flex items-center gap-1.5 md:gap-2 text-sm md:text-base ${
                  isFirstChapter
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Précédent</span>
              </button>

              <div className="text-xs md:text-sm text-gray-500 font-medium">
                {currentIndex + 1} / {chapterNumbers.length}
              </div>

              <button
                onClick={goToNextChapter}
                disabled={isLastChapter}
                className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all flex items-center gap-1.5 md:gap-2 text-sm md:text-base ${
                  isLastChapter
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${book.color} text-white hover:shadow-lg hover:scale-105`
                }`}
              >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default ChapterViewer;