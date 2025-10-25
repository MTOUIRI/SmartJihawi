import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Book, Clock, Link, Save, X, ChevronDown, AlertTriangle } from 'lucide-react';
import API_URL from '../../config';

const ChapterManagement = () => {
  const [books] = useState([
    { id: 'dernier-jour', title: 'Le Dernier Jour d\'un Condamné', color: 'from-red-500 to-red-600' },
    { id: 'antigone', title: 'Antigone', color: 'from-purple-500 to-purple-600' },
    { id: 'boite-merveilles', title: 'La Boîte à Merveilles', color: 'from-amber-500 to-amber-600' }
  ]);
  
  const [selectedBook, setSelectedBook] = useState('');
  const [chapters, setChapters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    bookId: '',
    chapterNumber: '',
    title: '',
    duration: '',
    videoUrl: '',
    resume: ''
  });

  // Get JWT token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fixed API call function - now makes real HTTP requests
  const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const baseURL = API_URL; // Adjust this to your backend URL
    
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
      
      // Handle empty responses (like DELETE operations)
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
    if (!bookId) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiCall(`/chapters/book/${bookId}`);
      setChapters(data);
    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`);
      setChapters([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      bookId: selectedBook,
      chapterNumber: '',
      title: '',
      duration: '',
      videoUrl: '',
      resume: ''
    });
    setEditingChapter(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingChapter) {
        // Update chapter
        const updateData = {
          title: formData.title,
          duration: formData.duration,
          videoUrl: formData.videoUrl,
          resume: formData.resume
        };
        await apiCall(`/chapters/${editingChapter.id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
      } else {
        // Create chapter
        await apiCall('/chapters', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      
      resetForm();
      await loadChapters(selectedBook);
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (chapter) => {
    setFormData({
      bookId: chapter.bookId,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      duration: chapter.duration,
      videoUrl: chapter.videoUrl || '',
      resume: chapter.resume
    });
    setEditingChapter(chapter);
    setShowForm(true);
  };

  const handleDeleteClick = (chapter) => {
    setChapterToDelete(chapter);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!chapterToDelete) return;
    
    setLoading(true);
    setError('');
    try {
      await apiCall(`/chapters/${chapterToDelete.id}`, { method: 'DELETE' });
      await loadChapters(selectedBook);
      setShowDeleteConfirm(false);
      setChapterToDelete(null);
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setChapterToDelete(null);
  };

  useEffect(() => {
    if (selectedBook) {
      loadChapters(selectedBook);
      setFormData(prev => ({ ...prev, bookId: selectedBook }));
    } else {
      setChapters([]);
    }
  }, [selectedBook]);

  const selectedBookData = books.find(book => book.id === selectedBook);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Chapitres</h1>
          <p className="text-gray-600">Ajoutez et gérez les chapitres de vos livres</p>
        </div>

        {/* Book Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sélectionnez un livre
          </label>
          <div className="relative">
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full md:w-80 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">-- Choisir un livre --</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {selectedBook && (
          <>
            {/* Add Chapter Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter un chapitre
              </button>
            </div>

            {/* Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {editingChapter ? 'Modifier le chapitre' : 'Ajouter un chapitre'}
                      </h2>
                      <button
                        onClick={resetForm}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    {selectedBookData && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Book className="w-4 h-4" />
                        {selectedBookData.title}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro du chapitre *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.chapterNumber}
                          onChange={(e) => setFormData({...formData, chapterNumber: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={editingChapter}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durée *
                        </label>
                        <input
                          type="text"
                          placeholder="15:30"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du chapitre *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de la vidéo (optionnel)
                      </label>
                      <input
                        type="url"
                        placeholder="https://youtu.be/..."
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Résumé du chapitre *
                      </label>
                      <textarea
                        rows={6}
                        value={formData.resume}
                        onChange={(e) => setFormData({...formData, resume: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Enregistrement...' : (editingChapter ? 'Modifier' : 'Ajouter')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Supprimer le chapitre
                      </h2>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      Êtes-vous sûr de vouloir supprimer le chapitre "{chapterToDelete?.title}" ? 
                      Cette action est irréversible.
                    </p>
                    
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={cancelDelete}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={confirmDelete}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {loading ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapters List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Chapitres - {selectedBookData?.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {chapters.length} chapitre{chapters.length > 1 ? 's' : ''}
                </p>
              </div>

              {loading && (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Chargement...</p>
                </div>
              )}

              {error && !loading && (
                <div className="p-6 bg-red-50">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {!loading && chapters.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Book className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun chapitre trouvé pour ce livre</p>
                  <p className="text-sm">Commencez par ajouter votre premier chapitre</p>
                </div>
              )}

              {!loading && chapters.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${selectedBookData?.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                              {chapter.chapterNumber}
                            </div>
                            <h3 className="font-semibold text-gray-800">
                              {chapter.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {chapter.duration}
                            </div>
                            {chapter.videoUrl && (
                              <div className="flex items-center gap-1">
                                <Link className="w-4 h-4" />
                                Vidéo disponible
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {chapter.resume.substring(0, 200)}
                            {chapter.resume.length > 200 && '...'}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(chapter)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(chapter)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterManagement;