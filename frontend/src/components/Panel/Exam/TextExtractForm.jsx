import React, { useState, useEffect } from 'react';
import { Book, Play, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const TextExtractForm = ({ formData, setFormData }) => {
  const [chapters, setChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const baseURL = 'http://localhost:8080/api';
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options
    };

    try {
      const response = await fetch(`${baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {};
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const loadChapters = async (bookId) => {
    if (!bookId) {
      setChapters([]);
      return;
    }

    setLoadingChapters(true);
    setChaptersError('');
    
    try {
      const data = await apiCall(`/chapters/book/${bookId}`);
      setChapters(data.sort((a, b) => a.chapterNumber - b.chapterNumber));
    } catch (err) {
      setChaptersError(`Erreur lors du chargement des chapitres: ${err.message}`);
      setChapters([]);
    } finally {
      setLoadingChapters(false);
    }
  };

  useEffect(() => {
    if (formData.bookId) {
      loadChapters(formData.bookId);
    } else {
      setChapters([]);
    }
  }, [formData.bookId]);

  const handleChapterSelect = (chapterId) => {
    const selectedChapter = chapters.find(ch => ch.id === chapterId);
    
    setFormData({
      ...formData,
      textExtract: {
        ...formData.textExtract,
        sourceChapter: selectedChapter ? {
          id: selectedChapter.id,
          chapterNumber: selectedChapter.chapterNumber,
          title: selectedChapter.title,
          chapterTitle: selectedChapter.title,  // Add this for compatibility
          chapterTitleArabic: selectedChapter.titleArabic || null,  // Add Arabic title if exists
          videoUrl: selectedChapter.videoUrl,
          duration: selectedChapter.duration,
          bookId: formData.bookId,  // Add bookId
          timeStart: '',
          timeEnd: ''
        } : null
      }
    });
  };

  const handleTimestampChange = (field, value) => {
    if (formData.textExtract.sourceChapter) {
      setFormData({
        ...formData,
        textExtract: {
          ...formData.textExtract,
          sourceChapter: {
            ...formData.textExtract.sourceChapter,
            [field]: value
          }
        }
      });
    }
  };

  const convertTimeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return '';
    
    let videoId = '';
    
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    
    return videoId;
  };

  const isValidTimeFormat = (timeStr) => {
    const timeRegex = /^([0-9]{1,2}):([0-5][0-9])$/;
    return timeRegex.test(timeStr);
  };

  const getTimestampValidation = () => {
    const { timeStart, timeEnd } = formData.textExtract.sourceChapter || {};
    
    if (!timeStart && !timeEnd) return null;
    
    const errors = [];
    
    if (timeStart && !isValidTimeFormat(timeStart)) {
      errors.push("Format de début invalide (utilisez MM:SS)");
    }
    
    if (timeEnd && !isValidTimeFormat(timeEnd)) {
      errors.push("Format de fin invalide (utilisez MM:SS)");
    }
    
    if (timeStart && timeEnd && isValidTimeFormat(timeStart) && isValidTimeFormat(timeEnd)) {
      const startSeconds = convertTimeToSeconds(timeStart);
      const endSeconds = convertTimeToSeconds(timeEnd);
      
      if (startSeconds >= endSeconds) {
        errors.push("L'heure de fin doit être après l'heure de début");
      }
    }
    
    return errors.length > 0 ? errors : null;
  };

  const timestampErrors = getTimestampValidation();
  const selectedChapter = formData.textExtract.sourceChapter;

  return (
    <div className="space-y-6">
      {/* Text Extract Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Texte d'étude *
        </label>
        <textarea
          rows={12}
          value={formData.textExtract.content}
          onChange={(e) => setFormData({
            ...formData,
            textExtract: { ...formData.textExtract, content: e.target.value }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          required
          placeholder="Coller ici le texte d'étude de l'examen..."
        />
      </div>

      {/* Chapter Video Selection */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Play className="w-4 h-4" />
          Vidéo du chapitre (optionnel)
        </h4>

        {loadingChapters && (
          <div className="flex items-center gap-2 text-gray-600 py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Chargement des chapitres...</span>
          </div>
        )}

        {chaptersError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-700 text-sm">{chaptersError}</span>
            </div>
          </div>
        )}

        {!loadingChapters && chapters.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Sélectionnez le chapitre avec vidéo :
            </p>
            
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              <button
                type="button"
                onClick={() => handleChapterSelect(null)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  !selectedChapter 
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {!selectedChapter && <CheckCircle className="w-4 h-4 text-blue-600" />}
                  <span className="text-sm font-medium">Aucune vidéo</span>
                </div>
              </button>

              {chapters.filter(ch => ch.videoUrl).map((chapter) => (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => handleChapterSelect(chapter.id)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    selectedChapter?.id === chapter.id 
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {selectedChapter?.id === chapter.id && (
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            Ch. {chapter.chapterNumber}
                          </span>
                          <h5 className="font-medium text-sm truncate">
                            {chapter.title}
                          </h5>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{chapter.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            <span>Vidéo disponible</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!loadingChapters && chapters.filter(ch => ch.videoUrl).length === 0 && !chaptersError && formData.bookId && (
          <div className="text-center py-4 text-gray-500">
            <Play className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Aucun chapitre avec vidéo trouvé</p>
          </div>
        )}
      </div>

      {/* Timestamp Configuration */}
      {selectedChapter && selectedChapter.videoUrl && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-800 mb-2">
                Chapitre {selectedChapter.chapterNumber}: {selectedChapter.title || selectedChapter.chapterTitle}
              </h4>
              <p className="text-sm text-green-700">Durée totale: {selectedChapter.duration}</p>
            </div>
          </div>

          {/* Video Player */}
          <div className="border-t border-green-200 pt-4 mb-4">
            <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedChapter.videoUrl)}`}
                title={selectedChapter.title || selectedChapter.chapterTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="border-t border-green-200 pt-4">
            <h5 className="font-medium text-green-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timestamps de la vidéo (optionnel)
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Début du passage
                </label>
                <input
                  type="text"
                  placeholder="MM:SS (ex: 5:30)"
                  value={selectedChapter.timeStart || ''}
                  onChange={(e) => handleTimestampChange('timeStart', e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Fin du passage
                </label>
                <input
                  type="text"
                  placeholder="MM:SS (ex: 8:45)"
                  value={selectedChapter.timeEnd || ''}
                  onChange={(e) => handleTimestampChange('timeEnd', e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {timestampErrors && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium text-sm mb-1">Erreurs de timestamp:</p>
                    <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                      {timestampErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedChapter.timeStart && selectedChapter.timeEnd && !timestampErrors && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium text-sm">Aperçu du passage</span>
                </div>
                <p className="text-blue-700 text-sm">
                  Les étudiants pourront accéder directement à la partie de la vidéo 
                  de <strong>{selectedChapter.timeStart}</strong> à <strong>{selectedChapter.timeEnd}</strong>
                  {' '}({Math.ceil((convertTimeToSeconds(selectedChapter.timeEnd) - convertTimeToSeconds(selectedChapter.timeStart)) / 60)} min environ)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextExtractForm;