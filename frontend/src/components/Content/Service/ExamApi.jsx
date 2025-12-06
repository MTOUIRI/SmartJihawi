import API_URL from "../../../config";

// Service/ExamApi.js
const API_BASE_URL = API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const examAPI = {
  // Existing methods...
  getExamsByBook: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/exams/book/${bookId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch exams');
    return await response.json();
  },

  getExamById: async (examId) => {
    const response = await fetch(`${API_BASE_URL}/exams/${examId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch exam');
    return await response.json();
  },

  // ADD THIS: Fetch regular questions
  getQuestionsByExam: async (examId) => {
    const response = await fetch(`${API_BASE_URL}/questions/exam/${examId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  },

  // ADD THIS: Fetch essay questions
  getEssayQuestionsByExam: async (examId) => {
    const response = await fetch(`${API_BASE_URL}/essay-questions/exam/${examId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch essay questions');
    const data = await response.json();
    return data.questions || [];
  }
};

// UPDATE THIS: Transform response to include questions placeholder
export const transformExamResponse = (exam) => {
  return {
    id: exam.id,
    title: exam.title,
    titleArabic: exam.titleArabic,
    subject: exam.subject,
    subjectArabic: exam.subjectArabic,
    year: exam.year,
    region: exam.region,
    bookId: exam.bookId,
    points: exam.points,
    duration: exam.duration,
    textExtract: exam.textExtract,
    questions: [], // Will be populated when fetching
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt
  };
};