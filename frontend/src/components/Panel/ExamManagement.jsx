import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Book, Calendar, FileText, Save, X, ChevronDown, AlertTriangle, MapPin, Clock, Award } from 'lucide-react';
import TextExtractForm from './Exam/TextExtractForm';
import BasicInfoForm from './Exam/BasicInfoForm';
import StepIndicator from './Exam/StepIndicator';

const ExamManagement = () => {
  const [books] = useState([
    { id: 'dernier-jour', title: 'Le Dernier Jour d\'un Condamné', color: 'from-red-500 to-red-600' },
    { id: 'antigone', title: 'Antigone', color: 'from-purple-500 to-purple-600' },
    { id: 'boite-merveilles', title: 'La Boîte à Merveilles', color: 'from-emerald-500 to-emerald-600' }
  ]);
  
  const [selectedBook, setSelectedBook] = useState('');
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    titleArabic: '',
    year: '',
    region: '',
    subject: 'ÉTUDE DE TEXTE',
    subjectArabic: 'دراسة النص',
    points: 10,
    duration: '',
    textExtract: {
      content: '',
      sourceChapter: null
    }
  });

  const getAuthToken = () => {
    return localStorage.getItem('admin_token');
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

  const loadExams = async (bookId) => {
    if (!bookId) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiCall(`/exams/book/${bookId}`);
      setExams(data);
    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      bookId: selectedBook,
      title: '',
      titleArabic: '',
      year: '',
      region: '',
      subject: 'ÉTUDE DE TEXTE',
      subjectArabic: 'دراسة النص',
      points: 10,
      duration: '',
      textExtract: {
        content: '',
        sourceChapter: null
      }
    });
    setCurrentStep(1);
    setEditingExam(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestData = {
        bookId: formData.bookId,
        title: formData.title,
        titleArabic: formData.titleArabic || null,
        year: formData.year,
        region: formData.region,
        subject: formData.subject,
        subjectArabic: formData.subjectArabic || null,
        points: formData.points,
        duration: formData.duration,
        textExtract: {
          content: formData.textExtract.content,
          sourceChapter: formData.textExtract.sourceChapter || null
        }
      };

      if (editingExam) {
        const updateData = { ...requestData };
        delete updateData.bookId;
        
        await apiCall(`/exams/${editingExam.id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
      } else {
        await apiCall('/exams', {
          method: 'POST',
          body: JSON.stringify(requestData)
        });
      }
      
      resetForm();
      await loadExams(selectedBook);
    } catch (err) {
      console.error('Submit error:', err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exam) => {
    const editFormData = {
      bookId: exam.bookId,
      title: exam.title,
      titleArabic: exam.titleArabic || '',
      year: exam.year,
      region: exam.region,
      subject: exam.subject,
      subjectArabic: exam.subjectArabic || '',
      points: exam.points,
      duration: exam.duration,
      textExtract: {
        content: exam.textExtract?.content || '',
        sourceChapter: exam.textExtract?.sourceChapter || null
      }
    };
    
    setFormData(editFormData);
    setEditingExam(exam);
    setCurrentStep(1);
    setShowForm(true);
  };

  const handleDeleteClick = (exam) => {
    setExamToDelete(exam);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!examToDelete) return;
    
    setLoading(true);
    setError('');
    try {
      await apiCall(`/exams/${examToDelete.id}`, { method: 'DELETE' });
      await loadExams(selectedBook);
      setShowDeleteConfirm(false);
      setExamToDelete(null);
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = () => {
    return formData.title.trim() && 
           formData.year.trim() && 
           formData.region.trim() && 
           formData.duration.trim();
  };

  const isStep2Valid = () => {
    return formData.textExtract.content.trim();
  };

  useEffect(() => {
    if (selectedBook) {
      loadExams(selectedBook);
      setFormData(prev => ({ ...prev, bookId: selectedBook }));
    } else {
      setExams([]);
    }
  }, [selectedBook]);

  const selectedBookData = books.find(book => book.id === selectedBook);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Examens</h1>
          <p className="text-gray-600">Créez et gérez les examens pour vos livres</p>
        </div>

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
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5" />
                Créer un nouvel examen
              </button>
            </div>

            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {editingExam ? 'Modifier l\'examen' : 'Créer un nouvel examen'}
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

                  <form onSubmit={handleSubmit} className="p-6">
                    <StepIndicator currentStep={currentStep} />

                    {currentStep === 1 && <BasicInfoForm formData={formData} setFormData={setFormData} />}
                    {currentStep === 2 && <TextExtractForm formData={formData} setFormData={setFormData} />}

                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                      <div>
                        {currentStep > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentStep(currentStep - 1);
                            }}
                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Précédent
                          </button>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        
                        {currentStep < 2 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentStep(currentStep + 1);
                            }}
                            disabled={!isStep1Valid()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Suivant
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={loading || !isStep2Valid()}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Save className="w-4 h-4" />
                            {loading ? 'Enregistrement...' : (editingExam ? 'Modifier l\'examen' : 'Créer l\'examen')}
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Supprimer l'examen
                      </h2>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      Êtes-vous sûr de vouloir supprimer l'examen "{examToDelete?.title}" ? 
                      Cette action est irréversible.
                    </p>
                    
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Examens - {selectedBookData?.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {exams.length} examen{exams.length > 1 ? 's' : ''}
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

              {!loading && exams.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun examen trouvé pour ce livre</p>
                  <p className="text-sm">Commencez par créer votre premier examen</p>
                </div>
              )}

              {!loading && exams.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {exams.map((exam) => (
                    <div key={exam.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${selectedBookData?.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                              E
                            </div>
                            <h3 className="font-semibold text-gray-800">
                              {exam.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-6 mb-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {exam.year}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {exam.region}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {exam.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {exam.points} pts
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              Texte d'étude
                            </div>
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {exam.subject} - {exam.region} {exam.year}
                          </p>
                          {exam.titleArabic && (
                            <p className="text-gray-600 text-sm mt-1" dir="rtl">
                              {exam.titleArabic}
                            </p>
                          )}

                          {exam.textExtract?.content && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500 mb-2">Extrait du texte d'étude:</p>
                              <p className="text-sm text-gray-700 line-clamp-3">
                                {exam.textExtract.content.substring(0, 150)}...
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(exam)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(exam)}
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

export default ExamManagement;