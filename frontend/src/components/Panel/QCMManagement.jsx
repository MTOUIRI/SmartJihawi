import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, HelpCircle, Book, X, Save, AlertTriangle, Upload } from 'lucide-react';

const QCMManagement = () => {
  const [books] = useState([
    { id: 'dernier-jour', title: 'Le Dernier Jour d\'un Condamné' },
    { id: 'antigone', title: 'Antigone' },
    { id: 'boite-merveilles', title: 'La Boîte à Merveilles' }
  ]);
  
  const [selectedBook, setSelectedBook] = useState('');
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  
  const [formData, setFormData] = useState({
    chapterId: '',
    question: '',
    questionArabic: '',
    options: [
      { id: 'a', text: '', textArabic: '' },
      { id: 'b', text: '', textArabic: '' },
      { id: 'c', text: '', textArabic: '' },
      { id: 'd', text: '', textArabic: '' }
    ],
    correctAnswer: '',
    explanation: '',
    explanationArabic: ''
  });

  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const baseURL = 'http://localhost:8080/api';
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options
    };

    const response = await fetch(`${baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {};
    }
    
    return await response.json();
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

  const loadQuestions = async (chapterId) => {
    if (!chapterId) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiCall(`/qcm/chapter/${chapterId}`);
      setQuestions(data);
    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJsonImport = () => {
    setJsonError('');
    try {
      const parsed = JSON.parse(jsonInput);
      
      if (!parsed.question || !parsed.options || !parsed.correctAnswer) {
        setJsonError('Le JSON doit contenir au minimum "question", "options" et "correctAnswer"');
        return;
      }

      if (!Array.isArray(parsed.options) || parsed.options.length !== 4) {
        setJsonError('Le tableau "options" doit contenir exactement 4 éléments');
        return;
      }

      const validOptionIds = ['a', 'b', 'c', 'd'];
      const hasValidIds = parsed.options.every((opt) => 
        opt.id && validOptionIds.includes(opt.id.toLowerCase())
      );

      if (!hasValidIds) {
        setJsonError('Chaque option doit avoir un "id" valide (a, b, c, ou d)');
        return;
      }

      if (!validOptionIds.includes(parsed.correctAnswer.toLowerCase())) {
        setJsonError('La "correctAnswer" doit être a, b, c, ou d');
        return;
      }

      const importedData = {
        chapterId: formData.chapterId,
        question: parsed.question || '',
        questionArabic: parsed.questionArabic || '',
        options: parsed.options.map(opt => ({
          id: opt.id.toLowerCase(),
          text: opt.text || '',
          textArabic: opt.textArabic || ''
        })),
        correctAnswer: parsed.correctAnswer.toLowerCase(),
        explanation: parsed.explanation || '',
        explanationArabic: parsed.explanationArabic || ''
      };

      setFormData(importedData);
      setShowJsonImport(false);
      setJsonInput('');
      setError('✅ JSON importé avec succès!');
      
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      setJsonError(`Erreur de parsing JSON: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestData = {
        ...formData,
        chapterId: selectedChapter.id
      };

      if (editingQuestion) {
        await apiCall(`/qcm/${editingQuestion.id}`, {
          method: 'PUT',
          body: JSON.stringify(requestData)
        });
      } else {
        await apiCall('/qcm', {
          method: 'POST',
          body: JSON.stringify(requestData)
        });
      }
      
      resetForm();
      await loadQuestions(selectedChapter.id);
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (question) => {
    setFormData({
      chapterId: question.chapterId,
      question: question.question,
      questionArabic: question.questionArabic || '',
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      explanationArabic: question.explanationArabic || ''
    });
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;
    
    setLoading(true);
    setError('');
    try {
      await apiCall(`/qcm/${questionToDelete.id}`, { method: 'DELETE' });
      await loadQuestions(selectedChapter.id);
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setQuestionToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      chapterId: '',
      question: '',
      questionArabic: '',
      options: [
        { id: 'a', text: '', textArabic: '' },
        { id: 'b', text: '', textArabic: '' },
        { id: 'c', text: '', textArabic: '' },
        { id: 'd', text: '', textArabic: '' }
      ],
      correctAnswer: '',
      explanation: '',
      explanationArabic: ''
    });
    setEditingQuestion(null);
    setShowForm(false);
    setShowJsonImport(false);
    setJsonInput('');
    setJsonError('');
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    setFormData({ ...formData, options: newOptions });
  };

  useEffect(() => {
    if (selectedBook) {
      loadChapters(selectedBook);
    } else {
      setChapters([]);
      setSelectedChapter(null);
      setQuestions([]);
    }
  }, [selectedBook]);

  useEffect(() => {
    if (selectedChapter) {
      loadQuestions(selectedChapter.id);
    } else {
      setQuestions([]);
    }
  }, [selectedChapter]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des QCM</h1>
          <p className="text-gray-600">Créez et gérez les questions à choix multiples par chapitre</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Livre</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choisir un livre --</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Chapitre</label>
              <select
                value={selectedChapter?.id || ''}
                onChange={(e) => {
                  const chapter = chapters.find(ch => ch.id === parseInt(e.target.value));
                  setSelectedChapter(chapter);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!chapters.length}
              >
                <option value="">-- Choisir un chapitre --</option>
                {chapters.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedChapter && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter une question QCM
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Questions QCM - {selectedChapter.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {questions.length} question{questions.length > 1 ? 's' : ''}
                </p>
              </div>

              {loading && (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="mt-2 text-gray-600">Chargement...</p>
                </div>
              )}

              {!loading && questions.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune question QCM pour ce chapitre</p>
                  <p className="text-sm">Commencez par créer votre première question</p>
                </div>
              )}

              {!loading && questions.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {questions.map((question, idx) => (
                    <div key={question.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                              {idx + 1}
                            </div>
                            <h3 className="font-semibold text-gray-800">
                              {question.question}
                            </h3>
                          </div>
                          
                          {question.questionArabic && (
                            <p className="text-gray-600 text-sm mb-3 mr-11" dir="rtl">
                              {question.questionArabic}
                            </p>
                          )}
                          
                          <div className="ml-11 space-y-2">
                            {question.options.map(opt => (
                              <div
                                key={opt.id}
                                className={`text-sm p-2 rounded ${
                                  opt.id === question.correctAnswer
                                    ? 'bg-green-100 text-green-800 font-medium'
                                    : 'text-gray-600'
                                }`}
                              >
                                {opt.id}) {opt.text}
                                {opt.id === question.correctAnswer && ' ✓'}
                              </div>
                            ))}
                          </div>

                          {question.explanation && (
                            <div className="ml-11 mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs text-blue-600 font-medium mb-1">Explication:</p>
                              <p className="text-sm text-gray-700">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(question)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(question)}
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

            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {editingQuestion ? 'Modifier la question' : 'Nouvelle question QCM'}
                      </h2>
                      <button
                        onClick={resetForm}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-indigo-800 mb-1 flex items-center gap-2">
                              <Upload className="w-4 h-4" />
                              Import rapide JSON
                            </h3>
                            <p className="text-sm text-indigo-600">Collez votre JSON pour remplir automatiquement le formulaire</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowJsonImport(!showJsonImport)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                          >
                            {showJsonImport ? 'Fermer' : 'Importer JSON'}
                          </button>
                        </div>
                        
                        {showJsonImport && (
                          <div className="mt-4 space-y-3">
                            <textarea
                              value={jsonInput}
                              onChange={(e) => setJsonInput(e.target.value)}
                              placeholder='{"question": "...", "questionArabic": "...", "options": [{"id": "a", "text": "...", "textArabic": "..."}, {"id": "b", "text": "...", "textArabic": "..."}, {"id": "c", "text": "...", "textArabic": "..."}, {"id": "d", "text": "...", "textArabic": "..."}], "correctAnswer": "a", "explanation": "...", "explanationArabic": "..."}'
                              className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                              rows={8}
                            />
                            {jsonError && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                                {jsonError}
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={handleJsonImport}
                              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              ✓ Charger dans le formulaire
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question (Français) *
                        </label>
                        <textarea
                          value={formData.question}
                          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          rows="3"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question (Arabe)
                        </label>
                        <textarea
                          value={formData.questionArabic}
                          onChange={(e) => setFormData({ ...formData, questionArabic: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-right"
                          dir="rtl"
                          rows="3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Options de réponse *
                        </label>
                        <div className="space-y-4">
                          {formData.options.map((option, index) => (
                            <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="font-bold text-gray-700">{option.id.toUpperCase()})</span>
                                <input
                                  type="text"
                                  value={option.text}
                                  onChange={(e) => updateOption(index, 'text', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                  placeholder="Texte français"
                                  required
                                />
                              </div>
                              <input
                                type="text"
                                value={option.textArabic}
                                onChange={(e) => updateOption(index, 'textArabic', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-right"
                                dir="rtl"
                                placeholder="النص بالعربية"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Réponse correcte *
                        </label>
                        <select
                          value={formData.correctAnswer}
                          onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="">-- Choisir la bonne réponse --</option>
                          {formData.options.map(opt => (
                            <option key={opt.id} value={opt.id}>
                              {opt.id.toUpperCase()}) {opt.text}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Explication (optionnelle)
                        </label>
                        <textarea
                          value={formData.explanation}
                          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          rows="2"
                          placeholder="Pourquoi cette réponse est correcte..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Explication (Arabe)
                        </label>
                        <textarea
                          value={formData.explanationArabic}
                          onChange={(e) => setFormData({ ...formData, explanationArabic: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-right"
                          dir="rtl"
                          rows="2"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className={`mt-4 p-4 rounded-lg ${error.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`text-sm ${error.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{error}</p>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
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
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Enregistrement...' : (editingQuestion ? 'Modifier' : 'Créer')}
                      </button>
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
                        Supprimer la question
                      </h2>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      Êtes-vous sûr de vouloir supprimer cette question QCM ? 
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
          </>
        )}
      </div>
    </div>
  );
};

export default QCMManagement;