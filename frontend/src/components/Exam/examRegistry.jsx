// Exam/examRegistry.js - Pure backend integration without mock data
import GenericExamComponent from '../Content/ExamViewer';
import { 
  getAllBooks, 
  getBookById, 
  getExamsByBook, 
  getExamById
} from '../Content/ExamData';

// All exams from the database will use the GenericExamComponent
export const getExamComponent = (examId) => {
  // Every exam uses the same generic component that handles API data
  return GenericExamComponent;
};

// Get exam metadata directly from the API
export const getExamMetadata = async (examId) => {
  try {
    const examData = await getExamById(examId);
    if (examData) {
      return {
        id: examData.id,
        title: examData.title,
        titleArabic: examData.titleArabic,
        subject: examData.subject,
        subjectArabic: examData.subjectArabic,
        year: examData.year,
        region: examData.region,
        points: examData.points,
        duration: examData.duration,
        textExtract: examData.textExtract,
        createdAt: examData.createdAt,
        updatedAt: examData.updatedAt
      };
    }
  } catch (error) {
    console.error('Error fetching exam metadata from API:', error);
    throw error;
  }
  
  return null;
};

// Simple exam component wrapper that always uses GenericExamComponent
export const ExamComponentWrapper = ({ examId, examData, ...props }) => {
  return (
    <GenericExamComponent 
      examId={examId}
      examData={examData}
      {...props}
    />
  );
};

// Initialize exam registry with API data (no static components needed)
export const initializeExamRegistry = async () => {
  try {
    const allBooks = getAllBooks();
    let totalExams = 0;
    
    for (const book of allBooks) {
      const exams = await getExamsByBook(book.id);
      totalExams += exams.length;
    }
    
    console.log(`Exam registry initialized with ${totalExams} exams from API`);
    return { totalExams };
  } catch (error) {
    console.error('Error initializing exam registry:', error);
    throw error;
  }
};

// Utility functions for registry stats
export const getRegistryStats = async () => {
  try {
    const allBooks = getAllBooks();
    let totalExams = 0;
    const bookStats = {};
    
    for (const book of allBooks) {
      const exams = await getExamsByBook(book.id);
      bookStats[book.id] = exams.length;
      totalExams += exams.length;
    }
    
    return {
      totalExams,
      bookStats,
      componentsUsed: { GenericExamComponent: totalExams }
    };
  } catch (error) {
    console.error('Error getting registry stats:', error);
    return { totalExams: 0, bookStats: {}, componentsUsed: {} };
  }
};

// Check if exam exists in the backend
export const examExists = async (examId) => {
  try {
    const examData = await getExamById(examId);
    return !!examData;
  } catch (error) {
    return false;
  }
};

// Get all exam IDs for a book
export const getExamIds = async (bookId) => {
  try {
    const exams = await getExamsByBook(bookId);
    return exams.map(exam => exam.id);
  } catch (error) {
    console.error('Error getting exam IDs:', error);
    return [];
  }
};

export default {
  getAllBooks,
  getBookById,
  getExamsByBook,
  getExamById,
  getExamComponent,
  getExamMetadata,
  ExamComponentWrapper,
  initializeExamRegistry,
  examExists,
  getExamIds,
  getRegistryStats
};