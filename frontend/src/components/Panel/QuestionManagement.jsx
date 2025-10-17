import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApi } from './Question/UseApi';
import { questionTypes, books } from './Question/QuestionTypes';
import QuestionForm from './Question/QuestionForm';
import QuestionList from './Question/QuestionList';
import DeleteConfirmModal from './Question/DeleteConfirmModal';

const QuestionManagement = () => {
  const { apiCall } = useApi();
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [questionMode, setQuestionMode] = useState('simple');
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'text',
    question: '',
    questionArabic: '',
    instruction: '',
    instructionArabic: '',
    points: 1,
    order: null,
    options: [],
    subQuestions: [],
    matchingPairs: [],
    tableContent: null,
    dragDropWords: null,
    helper: { french: [], arabic: [] },
    answer: '',
    answerArabic: ''
  });

  const handleJsonImport = () => {
    setJsonError('');
    try {
      const parsed = JSON.parse(jsonInput);
      
      if (!parsed.type || !parsed.question) {
        setJsonError('Le JSON doit contenir au minimum "type" et "question"');
        return;
      }

      const validTypes = ['text', 'multiple_choice', 'multiple_choice_single', 'table', 'matching', 'word_placement'];
      if (!validTypes.includes(parsed.type)) {
        setJsonError('Type invalide. Types valides: text, multiple_choice, multiple_choice_single, table, matching, word_placement');
        return;
      }

      const importedQuestion = {
        type: parsed.type || 'text',
        question: parsed.question || '',
        questionArabic: parsed.questionArabic || '',
        instruction: parsed.instruction || '',
        instructionArabic: parsed.instructionArabic || '',
        points: parsed.points || 1,
        order: parsed.order || null,
        options: parsed.options || [],
        subQuestions: parsed.subQuestions || [],
        matchingPairs: parsed.matchingPairs || [],
        tableContent: parsed.tableContent || null,
        dragDropWords: parsed.dragDropWords || null,
        helper: parsed.helper || { french: [], arabic: [] },
        answer: parsed.answer || '',
        answerArabic: parsed.answerArabic || ''
      };

      // Determine question mode for multiple_choice_single
      if (parsed.type === 'multiple_choice_single' && parsed.subQuestions && parsed.subQuestions.length > 0) {
        setQuestionMode('grouped');
      } else {
        setQuestionMode('simple');
      }

      setCurrentQuestion(importedQuestion);
      setShowJsonImport(false);
      setJsonInput('');
      setError('✅ JSON importé avec succès!');
      
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      setJsonError(`Erreur de parsing JSON: ${err.message}`);
    }
  };

  const loadExams = async (bookId) => {
    if (!bookId) return;
    setLoading(true);
    try {
      const data = await apiCall(`/exams/book/${bookId}`);
      setExams(data);
    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async (examId) => {
    if (!examId) return;
    setLoading(true);
    try {
      const data = await apiCall(`/questions/exam/${examId}`);
      setQuestions(data.questions || []);
    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const questionData = {
        ...currentQuestion,
        examId: selectedExam.id
      };

      if (editingQuestion) {
        await apiCall(`/questions/${editingQuestion.id}`, {
          method: 'PUT',
          body: JSON.stringify(questionData)
        });
      } else {
        await apiCall('/questions', {
          method: 'POST',
          body: JSON.stringify(questionData)
        });
      }

      resetForm();
      await loadQuestions(selectedExam.id);
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    setQuestionToDelete(questionId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;
    
    setLoading(true);
    try {
      await apiCall(`/questions/${questionToDelete}`, { method: 'DELETE' });
      await loadQuestions(selectedExam.id);
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setQuestionToDelete(null);
    }
  };

  const resetForm = () => {
    setCurrentQuestion({
      type: 'text',
      question: '',
      questionArabic: '',
      instruction: '',
      instructionArabic: '',
      points: 1,
      order: null,
      options: [],
      subQuestions: [],
      matchingPairs: [],
      tableContent: null,
      dragDropWords: null,
      helper: { french: [], arabic: [] },
      answer: '',
      answerArabic: ''
    });
    setQuestionMode('simple');
    setEditingQuestion(null);
    setShowForm(false);
    setError('');
    setShowJsonImport(false);
    setJsonInput('');
    setJsonError('');
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    setEditingQuestion(question);
    if (question.type === 'multiple_choice_single' && question.subQuestions && question.subQuestions.length > 0) {
      setQuestionMode('grouped');
    } else {
      setQuestionMode('simple');
    }
    setShowForm(true);
  };

  const handleModeChange = (mode) => {
    setQuestionMode(mode);
    
    if (mode === 'grouped') {
      setCurrentQuestion(prev => ({
        ...prev,
        subQuestions: prev.subQuestions && prev.subQuestions.length > 0 ? prev.subQuestions : [],
        options: [],
        answer: ''
      }));
    } else {
      setCurrentQuestion(prev => ({
        ...prev,
        subQuestions: [],
        options: prev.options && prev.options.length > 0 ? prev.options : [],
        answer: prev.answer || ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Questions</h1>
          <p className="text-gray-600">Ajoutez et gérez les questions pour vos examens (hors questions d'expression)</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Livre</label>
              <select
                onChange={(e) => loadExams(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choisir un livre --</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Examen</label>
              <select
                value={selectedExam?.id || ''}
                onChange={(e) => {
                  const exam = exams.find(ex => ex.id === parseInt(e.target.value));
                  setSelectedExam(exam);
                  if (exam) loadQuestions(exam.id);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!exams.length}
              >
                <option value="">-- Choisir un examen --</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title} ({exam.year})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedExam && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter une question
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Questions - {selectedExam.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {questions.length} question{questions.length > 1 ? 's' : ''}
                </p>
              </div>

              <QuestionList
                questions={questions}
                questionTypes={questionTypes}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
              />
            </div>

            {showForm && (
              <QuestionForm
                question={currentQuestion}
                onChange={setCurrentQuestion}
                onSubmit={handleSubmitQuestion}
                onClose={resetForm}
                loading={loading}
                error={error}
                editingQuestion={editingQuestion}
                questionMode={questionMode}
                onModeChange={handleModeChange}
                questionTypes={questionTypes}
                showJsonImport={showJsonImport}
                setShowJsonImport={setShowJsonImport}
                jsonInput={jsonInput}
                setJsonInput={setJsonInput}
                jsonError={jsonError}
                handleJsonImport={handleJsonImport}
              />
            )}

            <DeleteConfirmModal
              isOpen={showDeleteConfirm}
              onClose={() => {
                setShowDeleteConfirm(false);
                setQuestionToDelete(null);
              }}
              onConfirm={confirmDeleteQuestion}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionManagement;