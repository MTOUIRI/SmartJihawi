import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import BookExamSelector from './Essay/BookExamSelector';
import QuestionsList from './Essay/QuestionsList';
import QuestionFormModal from './Essay/QuestionFormModal';
import DeleteConfirmModal from './Essay/DeleteConfirmModal';
import API_URL from '../../config';

const EssayManagement = () => {
  // State Management
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([]);
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

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'essay_introduction',
    question: '',
    questionArabic: '',
    points: 2,
    order: null,
    helper: { french: [], arabic: [] },
    answer: '',
    answerArabic: '',
    progressivePhrases: [],
    subTitle: '',
    subTitleArabic: '',
    prompt: '',
    promptArabic: '',
    criteria: null
  });

  // Constants
  const essayTypes = [
    { value: 'essay_introduction', label: 'Introduction' },
    { value: 'essay_development', label: 'Développement' },
    { value: 'essay_conclusion', label: 'Conclusion' },
    { value: 'essay_subject', label: 'Sujet d\'expression' }
  ];

  const books = [
    { id: 'dernier-jour', title: 'Le Dernier Jour d\'un Condamné' },
    { id: 'antigone', title: 'Antigone' },
    { id: 'boite-merveilles', title: 'La Boîte à Merveilles' }
  ];

  // API Helper
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const baseURL = API_URL;
    
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
      
      if (response.status === 204) return {};
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Data Loading Functions
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
      const data = await apiCall(`/essay-questions/exam/${examId}`);
      setQuestions(data.questions || []);
    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper Functions
  const getStaticCriteria = () => ({
    discourse: {
      title: "Critères d'évaluation du discours",
      titleArabic: "معايير تقييم الخطاب",
      items: [
        {
          text: "Conformité de la production à la consigne d'écriture",
          textArabic: "مطابقة الإنتاج لتعليمة الكتابة",
          points: 2.5
        },
        {
          text: "Cohérence de l'argumentation",
          textArabic: "تماسك الحجاج",
          points: 1.5
        },
        {
          text: "Structure du texte (organisation et progression du texte)",
          textArabic: "بنية النص (تنظيم وتطور النص)",
          points: 1
        }
      ],
      totalPoints: 5
    },
    language: {
      title: "Critères d'évaluation de la langue",
      titleArabic: "معايير تقييم اللغة",
      items: [
        {
          text: "Vocabulaire (usage des termes précis et variés)",
          textArabic: "المفردات (استخدام مصطلحات دقيقة ومتنوعة)",
          points: 1
        },
        {
          text: "Syntaxe (construction des phrases correctes)",
          textArabic: "التركيب (بناء جمل صحيحة)",
          points: 1
        },
        {
          text: "Ponctuation (usage d'une ponctuation adéquate)",
          textArabic: "الترقيم (استخدام ترقيم مناسب)",
          points: 1
        },
        {
          text: "Respect des règles orthographiques et grammaticales",
          textArabic: "احترام القواعد الإملائية والنحوية",
          points: 1
        },
        {
          text: "Conjugaison (emploi des temps verbaux)",
          textArabic: "التصريف (استخدام الأزمنة الفعلية)",
          points: 1
        }
      ],
      totalPoints: 5
    }
  });

  const resetForm = () => {
    setCurrentQuestion({
      type: 'essay_introduction',
      question: '',
      questionArabic: '',
      points: 2,
      order: null,
      helper: { french: [], arabic: [] },
      answer: '',
      answerArabic: '',
      progressivePhrases: [],
      subTitle: '',
      subTitleArabic: '',
      prompt: '',
      promptArabic: '',
      criteria: null
    });
    setEditingQuestion(null);
    setShowForm(false);
    setError('');
    setShowJsonImport(false);
    setJsonInput('');
    setJsonError('');
  };

  // Event Handlers
  const handleBookChange = (bookId) => {
    loadExams(bookId);
    setSelectedExam(null);
    setQuestions([]);
  };

  const handleExamChange = (examId) => {
    const exam = exams.find(ex => ex.id === parseInt(examId));
    setSelectedExam(exam);
    if (exam) loadQuestions(exam.id);
  };

  const handleJsonImport = () => {
    setJsonError('');
    try {
      const parsed = JSON.parse(jsonInput);
      
      if (!parsed.type || !parsed.question) {
        setJsonError('Le JSON doit contenir au minimum "type" et "question"');
        return;
      }

      const validTypes = ['essay_introduction', 'essay_development', 'essay_conclusion', 'essay_subject'];
      if (!validTypes.includes(parsed.type)) {
        setJsonError('Type invalide. Types valides: essay_introduction, essay_development, essay_conclusion, essay_subject');
        return;
      }

      const importedQuestion = {
        type: parsed.type || 'essay_introduction',
        question: parsed.question || '',
        questionArabic: parsed.questionArabic || '',
        points: parsed.points || 2,
        order: parsed.order || null,
        helper: parsed.helper || { french: [], arabic: [] },
        answer: parsed.answer || '',
        answerArabic: parsed.answerArabic || '',
        progressivePhrases: parsed.progressivePhrases || [],
        subTitle: parsed.subTitle || '',
        subTitleArabic: parsed.subTitleArabic || '',
        prompt: parsed.prompt || '',
        promptArabic: parsed.promptArabic || '',
        criteria: parsed.criteria || null
      };

      setCurrentQuestion(importedQuestion);
      setShowJsonImport(false);
      setJsonInput('');
      setError('✅ JSON importé avec succès!');
      
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      setJsonError(`Erreur de parsing JSON: ${err.message}`);
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

      if (currentQuestion.type === 'essay_subject') {
        questionData.question = "PRODUCTION ÉCRITE";
        questionData.questionArabic = "الإنتاج الكتابي";
        questionData.subTitle = "Sujet";
        questionData.subTitleArabic = "الموضوع";
        questionData.criteria = getStaticCriteria();
        questionData.points = 10;
      }

      if (editingQuestion) {
        await apiCall(`/essay-questions/${editingQuestion.id}`, {
          method: 'PUT',
          body: JSON.stringify(questionData)
        });
      } else {
        await apiCall('/essay-questions', {
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

  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestionToDelete(questionId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;
    
    setLoading(true);
    try {
      await apiCall(`/essay-questions/${questionToDelete}`, { method: 'DELETE' });
      await loadQuestions(selectedExam.id);
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setQuestionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setQuestionToDelete(null);
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gestion des Questions d'Expression
          </h1>
          <p className="text-gray-600">
            Gérez les questions d'introduction, développement, conclusion et sujets
          </p>
        </div>

        {/* Book and Exam Selector */}
        <BookExamSelector
          books={books}
          exams={exams}
          selectedExam={selectedExam}
          onBookChange={handleBookChange}
          onExamChange={handleExamChange}
        />

        {/* Add Question Button */}
        {selectedExam && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter une question d'expression
              </button>
            </div>

            {/* Questions List */}
            <QuestionsList
              questions={questions}
              selectedExam={selectedExam}
              essayTypes={essayTypes}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
            />

            {/* Question Form Modal */}
            <QuestionFormModal
              show={showForm}
              editingQuestion={editingQuestion}
              currentQuestion={currentQuestion}
              essayTypes={essayTypes}
              loading={loading}
              error={error}
              showJsonImport={showJsonImport}
              jsonInput={jsonInput}
              jsonError={jsonError}
              onClose={resetForm}
              onSubmit={handleSubmitQuestion}
              onChange={setCurrentQuestion}
              onJsonToggle={() => setShowJsonImport(!showJsonImport)}
              onJsonInputChange={setJsonInput}
              onJsonImport={handleJsonImport}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
              show={showDeleteConfirm}
              loading={loading}
              onConfirm={confirmDeleteQuestion}
              onCancel={cancelDelete}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EssayManagement;