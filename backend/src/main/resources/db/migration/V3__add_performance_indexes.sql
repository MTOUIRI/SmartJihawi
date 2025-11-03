-- Performance indexes
-- This will dramatically improve query performance

-- Chapters indexes
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book_chapter ON chapters(book_id, chapter_number);

-- Exams indexes
CREATE INDEX IF NOT EXISTS idx_exams_book_id ON exams(book_id);
CREATE INDEX IF NOT EXISTS idx_exams_book_year ON exams(book_id, year);

-- Questions indexes
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_exam_order ON questions(exam_id, question_order);

-- Essay Questions indexes
CREATE INDEX IF NOT EXISTS idx_essay_questions_exam_id ON essay_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_essay_questions_exam_order ON essay_questions(exam_id, question_order);

-- QCM Questions indexes
CREATE INDEX IF NOT EXISTS idx_qcm_questions_chapter_id ON qcm_questions(chapter_id);

-- Text Extracts indexes
CREATE INDEX IF NOT EXISTS idx_text_extracts_exam_id ON text_extracts(exam_id);
CREATE INDEX IF NOT EXISTS idx_text_extracts_book_id ON text_extracts(book_id);
CREATE INDEX IF NOT EXISTS idx_text_extracts_chapter_ref ON text_extracts(chapter_ref_id);

-- Users indexes (for authentication)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_paid ON users(role, is_paid);