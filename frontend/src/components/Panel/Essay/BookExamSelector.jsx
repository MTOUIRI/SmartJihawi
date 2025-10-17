import React from 'react';

const BookExamSelector = ({ 
  books, 
  exams, 
  selectedExam, 
  onBookChange, 
  onExamChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Livre
          </label>
          <select
            onChange={(e) => onBookChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choisir un livre --</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Examen
          </label>
          <select
            value={selectedExam?.id || ''}
            onChange={(e) => onExamChange(e.target.value)}
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
  );
};

export default BookExamSelector;