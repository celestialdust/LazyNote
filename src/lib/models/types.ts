// User related types
export interface User {
  id: string;
  name: string;
  email: string;
}

// Analytics related types
export interface UserStats {
  flashcardsCreated: number;
  flashcardsReviewed: number;
  quizzesCompleted: number;
  averageScore: number;
  totalStudyTime: number; // in minutes
}

// Document related types
export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'txt';
  createdAt: string;
  flashcardCount: number;
  quizCount: number;
}

// Flashcard related types
// Update the FlashcardSet interface:

export interface FlashcardSet {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  cardCount: number;
  mastered: number;
  documentId?: string;
  lastStudiedAt?: string; // Add this property
}

export interface Flashcard {
  id: string;
  setId: string;
  question: string;
  answer: string;
  mastered: boolean;
  lastReviewed?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Quiz related types
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  documentId?: string;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  completedCount: number;
  lastAttemptedAt?: string | null; // Updated to allow null
  averageScore: number;
  tags: string[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  startedAt: string;
  completedAt?: string | null; // Also allow null here
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}