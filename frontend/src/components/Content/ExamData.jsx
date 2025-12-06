// Content/ExamData.js - Updated to fetch both regular and essay questions
import { examAPI, transformExamResponse } from './Service/ExamApi';

// Keep static book data
export const books = {
  'boite-merveilles': {
    id: 'boite-merveilles',
    title: 'La Boîte à Merveilles',
    author: 'Ahmed Sefrioui',
    color: 'from-emerald-500 to-teal-600',
    examCount: 0
  },
  'antigone': {
    id: 'antigone',
    title: 'Antigone',
    author: 'Jean Anouilh',
    color: 'from-purple-500 to-indigo-600',
    examCount: 0
  },
  'dernier-jour': {
    id: 'dernier-jour',
    title: 'Le Dernier Jour d\'un Condamné',
    author: 'Victor Hugo',
    color: 'from-red-500 to-rose-600',
    examCount: 0
  }
};

// Cache for API data
let examCache = {};
let yearsCache = {};

// Fetch exams from API and cache them
export const loadExamsFromAPI = async (bookId) => {
  try {
    const exams = await examAPI.getExamsByBook(bookId);
    
    // For each exam, fetch both question types
    const transformedExams = await Promise.all(
      exams.map(async (exam) => {
        const transformed = transformExamResponse(exam);
        
        try {
          // Fetch both regular and essay questions in parallel
          const [regularQuestions, essayQuestions] = await Promise.all([
            examAPI.getQuestionsByExam(exam.id).catch(() => ({ questions: [] })),
            examAPI.getEssayQuestionsByExam(exam.id).catch(() => [])
          ]);
          
          // Merge and sort all questions by order
          transformed.questions = [
            ...(regularQuestions.questions || []),
            ...(essayQuestions || [])
          ].sort((a, b) => (a.order || 0) - (b.order || 0));
          
        } catch (err) {
          console.error(`Error loading questions for exam ${exam.id}:`, err);
          transformed.questions = [];
        }
        
        return transformed;
      })
    );
    
    // Update cache
    examCache[bookId] = transformedExams;
    
    // Update book exam count
    if (books[bookId]) {
      books[bookId].examCount = transformedExams.length;
    }
    
    // Generate years data from exams
    const years = generateYearsFromExams(transformedExams, bookId);
    yearsCache[bookId] = years;
    
    return transformedExams;
  } catch (error) {
    console.error(`Error loading exams for ${bookId}:`, error);
    return [];
  }
};

// Generate years data from exams
const generateYearsFromExams = (exams, bookId) => {
  const yearMap = new Map();
  
  exams.forEach(exam => {
    if (!yearMap.has(exam.year)) {
      yearMap.set(exam.year, {
        id: exam.year,
        year: exam.year,
        description: `Examens de ${exam.year}`,
        descriptionArabic: `امتحانات ${exam.year}`,
        examCount: 0,
        regions: [],
        color: books[bookId]?.color || 'from-blue-500 to-blue-600'
      });
    }
    
    const yearData = yearMap.get(exam.year);
    yearData.examCount++;
    
    if (!yearData.regions.includes(exam.region)) {
      yearData.regions.push(exam.region);
    }
  });
  
  return Array.from(yearMap.values()).sort((a, b) => b.year.localeCompare(a.year));
};

// Updated helper functions
export const getAllBooks = () => Object.values(books);

export const getBookById = (id) => books[id];

export const getExamsByBook = async (bookId) => {
  // Return cached data if available
  if (examCache[bookId]) {
    return examCache[bookId];
  }
  
  // Load from API if not cached
  return await loadExamsFromAPI(bookId);
};

export const getExamById = async (examId) => {
  // Search in cached data first
  for (const bookExams of Object.values(examCache)) {
    const exam = bookExams.find(e => e.id == examId);
    if (exam) return exam;
  }
  
  // If not found in cache, fetch from API
  try {
    const examData = await examAPI.getExamById(examId);
    const transformedExam = transformExamResponse(examData);
    
    // Fetch both regular and essay questions
    const [regularQuestions, essayQuestions] = await Promise.all([
      examAPI.getQuestionsByExam(examId).catch(() => ({ questions: [] })),
      examAPI.getEssayQuestionsByExam(examId).catch(() => [])
    ]);
    
    // Merge and sort all questions by order
    const allQuestions = [
      ...(regularQuestions.questions || []),
      ...(essayQuestions || [])
    ].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    transformedExam.questions = allQuestions;
    
    return transformedExam;
  } catch (error) {
    console.error(`Error loading exam ${examId}:`, error);
    return null;
  }
};

// Year-based helper functions
export const getYearsByBook = async (bookId) => {
  // Return cached years if available
  if (yearsCache[bookId]) {
    return yearsCache[bookId];
  }
  
  // Load exams first to generate years
  await loadExamsFromAPI(bookId);
  return yearsCache[bookId] || [];
};

export const getYearById = async (yearId, bookId) => {
  const years = await getYearsByBook(bookId);
  return years.find(year => year.id === yearId);
};

export const getExamsByYear = async (bookId, yearId) => {
  const allExams = await getExamsByBook(bookId);
  return allExams.filter(exam => exam.year === yearId);
};

// Legacy regional helper functions (kept for compatibility)
export const getRegionsByBook = async (bookId) => {
  const exams = await getExamsByBook(bookId);
  const regionMap = new Map();
  
  exams.forEach(exam => {
    const regionKey = exam.region.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    if (!regionMap.has(regionKey)) {
      regionMap.set(regionKey, {
        id: regionKey,
        name: exam.region,
        nameArabic: exam.region,
        description: `Examens de ${exam.region}`,
        descriptionArabic: `امتحانات ${exam.region}`,
        examCount: 0,
        years: [],
        color: books[bookId]?.color || 'from-blue-500 to-blue-600'
      });
    }
    
    const regionData = regionMap.get(regionKey);
    regionData.examCount++;
    
    if (!regionData.years.includes(exam.year)) {
      regionData.years.push(exam.year);
    }
  });
  
  return Array.from(regionMap.values());
};

export const getRegionById = async (regionId, bookId) => {
  const regions = await getRegionsByBook(bookId);
  return regions.find(region => region.id === regionId);
};

export const getExamsByRegion = async (bookId, regionId) => {
  const allExams = await getExamsByBook(bookId);
  const targetRegionName = regionId.replace(/-/g, ' ').toLowerCase();
  
  return allExams.filter(exam => 
    exam.region.toLowerCase().includes(targetRegionName) ||
    exam.region.toLowerCase().replace(/[^a-z0-9]/g, '-') === regionId
  );
};

// Initialize cache for all books on app start
export const initializeExamData = async () => {
  const bookIds = Object.keys(books);
  
  for (const bookId of bookIds) {
    try {
      await loadExamsFromAPI(bookId);
    } catch (error) {
      console.error(`Failed to load exams for ${bookId}:`, error);
    }
  }
};

// Clear cache (useful for when new exams are added)
export const clearExamCache = (bookId = null) => {
  if (bookId) {
    delete examCache[bookId];
    delete yearsCache[bookId];
  } else {
    examCache = {};
    yearsCache = {};
  }
};