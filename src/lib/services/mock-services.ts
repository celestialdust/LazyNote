import { User, UserStats, Document, FlashcardSet, Flashcard, Quiz, QuizQuestion } from '../models/types';

// Mock analytics service
export const analyticsService = {
  getUserStats: async (userId: string): Promise<UserStats> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return dummy data
    return {
      flashcardsCreated: 120,
      flashcardsReviewed: 85,
      quizzesCompleted: 12,
      averageScore: 78,
      totalStudyTime: 320 // minutes
    };
  }
};

// Mock document service
// In the documentService.getDocuments function, let's modify the returned documents
export const documentService = {
  getDocuments: async (userId: string): Promise<Document[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return dummy data without Machine Learning Fundamentals
    return [
      {
        id: "doc2",
        title: "Data Structures and Algorithms",
        type: "ppt",
        createdAt: "2023-04-10T14:20:00Z",
        flashcardCount: 32,
        quizCount: 2
      },
      {
        id: "doc3",
        title: "Web Development Basics",
        type: "pdf",
        createdAt: "2023-04-05T09:15:00Z",
        flashcardCount: 28,
        quizCount: 1
      },
    ];
  },
  
  // Add a createDocument method if it doesn't exist
  createDocument: async (docData: { title: string; content: string; userId: string; tags?: string[] }): Promise<Document> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a new document with dummy ID and timestamps
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title: docData.title,
      type: "pdf", // Assuming PDF for uploaded documents
      createdAt: new Date().toISOString(),
      flashcardCount: 0,
      quizCount: 0
    };
    
    return newDoc;
  }
};

// Mock auth service
export const authService = {
  verifyToken: async (token: string): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return dummy user data
    return {
      id: "user123",
      name: "John Doe",
      email: "john.doe@example.com"
    };
  }
};

// Mock flashcard service
export const flashcardService = {
  // Get all flashcard sets for a user
  getFlashcardSets: async (userId: string): Promise<FlashcardSet[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return dummy flashcard sets
    return [
      {
        id: "set1",
        title: "Machine Learning Fundamentals",
        description: "Key concepts in machine learning",
        tags: ["ML", "AI", "Data Science"],
        createdAt: "2025-03-30T10:30:00Z",
        updatedAt: "2025-03-30T14:20:00Z",
        cardCount: 45,
        mastered: 20,
        documentId: "doc1",
        lastStudiedAt: "2025-03-30T15:30:00Z" // Updated timestamp
      },
      {
        id: "set2",
        title: "Data Structures",
        description: "Common data structures in computer science",
        tags: ["CS", "Programming", "Algorithms"],
        createdAt: "2025-03-30T11:20:00Z",
        updatedAt: "2025-03-30T12:15:00Z",
        cardCount: 32,
        mastered: 15,
        documentId: "doc2",
        lastStudiedAt: "2025-03-30T13:30:00Z" // Updated timestamp
      },
      {
        id: "set3",
        title: "Web Development Basics",
        description: "HTML, CSS, and JavaScript fundamentals",
        tags: ["Web", "Frontend", "HTML"],
        createdAt: "2025-03-30T09:15:00Z",
        updatedAt: "2025-03-30T11:30:00Z",
        cardCount: 28,
        mastered: 22,
        documentId: "doc3",
        lastStudiedAt: "2025-03-30T14:15:00Z" // Updated timestamp
      }
    ];
  },
  
  // Get a specific flashcard set by ID
  getFlashcardSet: async (setId: string): Promise<FlashcardSet> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return dummy flashcard set based on ID
    const sets = {
      "set1": {
        id: "set1",
        title: "Machine Learning Fundamentals",
        description: "Key concepts in machine learning",
        tags: ["ML", "AI", "Data Science"],
        createdAt: "2025-03-30T10:30:00Z",
        updatedAt: "2025-03-30T14:20:00Z",
        cardCount: 45,
        mastered: 20,
        documentId: "doc1",
        lastStudiedAt: "2025-03-30T15:30:00Z" // Updated timestamp
      },
      "set2": {
        id: "set2",
        title: "Data Structures",
        description: "Common data structures in computer science",
        tags: ["CS", "Programming", "Algorithms"],
        createdAt: "2025-03-30T11:20:00Z",
        updatedAt: "2025-03-30T12:15:00Z",
        cardCount: 32,
        mastered: 15,
        documentId: "doc2",
        lastStudiedAt: "2025-03-30T13:30:00Z" // Added with updated timestamp
      },
      "set3": {
        id: "set3",
        title: "Web Development Basics",
        description: "HTML, CSS, and JavaScript fundamentals",
        tags: ["Web", "Frontend", "HTML"],
        createdAt: "2025-03-30T09:15:00Z",
        updatedAt: "2025-03-30T11:30:00Z",
        cardCount: 28,
        mastered: 22,
        documentId: "doc3",
        lastStudiedAt: "2025-03-30T14:15:00Z" // Added with updated timestamp
      },
      "dummy-set-123": {
        id: "dummy-set-123",
        title: "Recently Generated Flashcards",
        description: "Automatically generated from your uploaded document",
        tags: ["Generated", "AI"],
        createdAt: "2025-03-30T16:00:00Z",
        updatedAt: "2025-03-30T16:00:00Z",
        cardCount: 15,
        mastered: 0,
        documentId: "doc-new",
        lastStudiedAt: "2025-03-30T14:20:00Z" // Never studied yet
      }
    };
    
    // Fix: Add type checking for the setId
    return sets[setId as keyof typeof sets] || sets["set1"]; // Default to set1 if ID not found
  },
  
  // Get all flashcards for a specific set
  getFlashcards: async (setId: string): Promise<Flashcard[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Generate dummy flashcards based on set ID
    const flashcardsBySet = {
      "set1": [
        {
          id: "card1",
          setId: "set1",
          question: "What is supervised learning?",
          answer: "A type of machine learning where the model is trained on labeled data and learns to predict outputs based on inputs.",
          mastered: true,
          lastReviewed: "2023-04-20T15:30:00Z",
          difficulty: "medium"
        },
        {
          id: "card2",
          setId: "set1",
          question: "What is the difference between classification and regression?",
          answer: "Classification predicts discrete class labels, while regression predicts continuous values.",
          mastered: true,
          lastReviewed: "2023-04-19T10:15:00Z",
          difficulty: "medium"
        },
        {
          id: "card3",
          setId: "set1",
          question: "What is overfitting?",
          answer: "When a model learns the training data too well, including noise and outliers, resulting in poor performance on new, unseen data.",
          mastered: false,
          lastReviewed: "2023-04-18T14:45:00Z",
          difficulty: "hard"
        },
        {
          id: "card4",
          setId: "set1",
          question: "What is gradient descent?",
          answer: "An optimization algorithm used to minimize a function by iteratively moving in the direction of steepest descent.",
          mastered: false,
          lastReviewed: "2023-04-17T11:20:00Z",
          difficulty: "hard"
        },
        {
          id: "card5",
          setId: "set1",
          question: "What is a neural network?",
          answer: "A computational model inspired by the human brain, consisting of interconnected nodes (neurons) organized in layers.",
          mastered: false,
          difficulty: "medium"
        }
      ],
      "set2": [
        {
          id: "card6",
          setId: "set2",
          question: "What is a stack?",
          answer: "A linear data structure that follows the Last In First Out (LIFO) principle.",
          mastered: true,
          lastReviewed: "2023-04-14T09:30:00Z",
          difficulty: "easy"
        },
        {
          id: "card7",
          setId: "set2",
          question: "What is a queue?",
          answer: "A linear data structure that follows the First In First Out (FIFO) principle.",
          mastered: true,
          lastReviewed: "2023-04-13T16:45:00Z",
          difficulty: "easy"
        },
        {
          id: "card8",
          setId: "set2",
          question: "What is a binary search tree?",
          answer: "A tree data structure where each node has at most two children, and for each node, all elements in the left subtree are less than the node, and all elements in the right subtree are greater.",
          mastered: false,
          lastReviewed: "2023-04-12T13:20:00Z",
          difficulty: "medium"
        },
        {
          id: "card9",
          setId: "set2",
          question: "What is the time complexity of quicksort in the average case?",
          answer: "O(n log n)",
          mastered: false,
          difficulty: "medium"
        }
      ],
      "set3": [
        {
          id: "card10",
          setId: "set3",
          question: "What does HTML stand for?",
          answer: "HyperText Markup Language",
          mastered: true,
          lastReviewed: "2023-04-10T10:15:00Z",
          difficulty: "easy"
        },
        {
          id: "card11",
          setId: "set3",
          question: "What does CSS stand for?",
          answer: "Cascading Style Sheets",
          mastered: true,
          lastReviewed: "2023-04-09T14:30:00Z",
          difficulty: "easy"
        },
        {
          id: "card12",
          setId: "set3",
          question: "What is the box model in CSS?",
          answer: "A layout concept that describes how elements are rendered with content, padding, border, and margin areas.",
          mastered: true,
          lastReviewed: "2023-04-08T11:45:00Z",
          difficulty: "medium"
        },
        {
          id: "card13",
          setId: "set3",
          question: "What is the difference between == and === in JavaScript?",
          answer: "== compares values with type coercion, while === compares both values and types without coercion.",
          mastered: false,
          lastReviewed: "2023-04-07T09:20:00Z",
          difficulty: "medium"
        }
      ],
      "dummy-set-123": [
        {
          id: "gen-card1",
          setId: "dummy-set-123",
          question: "What is LazyNote?",
          answer: "An AI-powered study tool that helps students create flashcards and quizzes from their lecture materials.",
          mastered: false,
          difficulty: "easy"
        },
        {
          id: "gen-card2",
          setId: "dummy-set-123",
          question: "How does LazyNote generate flashcards?",
          answer: "LazyNote uses advanced AI to analyze uploaded documents and automatically extract key concepts and questions.",
          mastered: false,
          difficulty: "medium"
        },
        {
          id: "gen-card3",
          setId: "dummy-set-123",
          question: "What file formats does LazyNote support?",
          answer: "LazyNote supports PDF, Word, PowerPoint, Text, and Images.",
          mastered: false,
          difficulty: "easy"
        }
      ]
    };
    
    // In the getFlashcards function, modify the return statement:
    const cards = flashcardsBySet[setId as keyof typeof flashcardsBySet] || [];
    // Type assertion to ensure cards match Flashcard type with specific difficulty values
    return cards.map(card => ({
      ...card,
      difficulty: card.difficulty as "easy" | "medium" | "hard"
    }));
  },
  
  // Create a new flashcard set
  createFlashcardSet: async (userId: string, setData: Partial<FlashcardSet>): Promise<FlashcardSet> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a new set with dummy ID and timestamps
    const newSet: FlashcardSet = {
      id: `set-${Date.now()}`,
      title: setData.title || "Untitled Set",
      description: setData.description || "",
      tags: setData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cardCount: 0,
      mastered: 0,
      documentId: setData.documentId
    };
    
    return newSet;
  },
  
  // Add a flashcard to a set
  addFlashcard: async (setId: string, cardData: Partial<Flashcard>): Promise<Flashcard> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a new flashcard with dummy ID
    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      setId: setId,
      question: cardData.question || "New Question",
      answer: cardData.answer || "New Answer",
      mastered: false,
      difficulty: cardData.difficulty || "medium"
    };
    
    return newCard;
  },
  
  // Update flashcard mastery status
  updateFlashcardMastery: async (cardId: string, mastered: boolean): Promise<Flashcard> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return updated flashcard (dummy implementation)
    return {
      id: cardId,
      setId: "set1", // Assuming set1 for simplicity
      question: "Sample question",
      answer: "Sample answer",
      mastered: mastered,
      lastReviewed: new Date().toISOString(),
      difficulty: "medium"
    };
  }
};

// Mock quiz service
export const quizService = {
  // Get all quizzes for a user
  getQuizzes: async (userId: string): Promise<Quiz[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return dummy quizzes
    return [
      {
        id: "quiz1",
        title: "Machine Learning Fundamentals",
        description: "Test your knowledge of key machine learning concepts",
        documentId: "doc1",
        createdAt: "2025-03-30T10:30:00Z",
        updatedAt: "2025-03-30T14:20:00Z",
        questionCount: 10,
        completedCount: 3,
        lastAttemptedAt: "2025-03-30T15:30:00Z",
        averageScore: 85,
        tags: ["ML", "AI", "Data Science"]
      },
      {
        id: "quiz2",
        title: "Data Structures",
        description: "Test your understanding of common data structures",
        documentId: "doc2",
        createdAt: "2025-03-30T11:20:00Z",
        updatedAt: "2025-03-30T12:15:00Z",
        questionCount: 8,
        completedCount: 2,
        lastAttemptedAt: "2025-03-30T13:30:00Z",
        averageScore: 75,
        tags: ["CS", "Programming", "Algorithms"]
      },
      {
        id: "quiz3",
        title: "Web Development Basics",
        description: "Test your knowledge of HTML, CSS, and JavaScript",
        documentId: "doc3",
        createdAt: "2025-03-30T09:15:00Z",
        updatedAt: "2025-03-30T11:30:00Z",
        questionCount: 12,
        completedCount: 4,
        lastAttemptedAt: "2025-03-30T14:15:00Z",
        averageScore: 92,
        tags: ["Web", "Frontend", "HTML"]
      }
    ];
  },
  
  // Get a specific quiz by ID
  getQuiz: async (quizId: string): Promise<Quiz> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return dummy quiz based on ID
    const quizzes = {
      "quiz1": {
        id: "quiz1",
        title: "Machine Learning Fundamentals",
        description: "Test your knowledge of key machine learning concepts",
        documentId: "doc1",
        createdAt: "2025-03-30T10:30:00Z",
        updatedAt: "2025-03-30T14:20:00Z",
        questionCount: 10,
        completedCount: 3,
        lastAttemptedAt: "2025-03-30T15:30:00Z",
        averageScore: 85,
        tags: ["ML", "AI", "Data Science"]
      },
      "quiz2": {
        id: "quiz2",
        title: "Data Structures",
        description: "Test your understanding of common data structures",
        documentId: "doc2",
        createdAt: "2025-03-30T11:20:00Z",
        updatedAt: "2025-03-30T12:15:00Z",
        questionCount: 8,
        completedCount: 2,
        lastAttemptedAt: "2025-03-30T13:30:00Z",
        averageScore: 75,
        tags: ["CS", "Programming", "Algorithms"]
      },
      "quiz3": {
        id: "quiz3",
        title: "Web Development Basics",
        description: "Test your knowledge of HTML, CSS, and JavaScript",
        documentId: "doc3",
        createdAt: "2025-03-30T09:15:00Z",
        updatedAt: "2025-03-30T11:30:00Z",
        questionCount: 12,
        completedCount: 4,
        lastAttemptedAt: "2025-03-30T14:15:00Z",
        averageScore: 92,
        tags: ["Web", "Frontend", "HTML"]
      },
      "dummy-quiz-123": {
        id: "dummy-quiz-123",
        title: "Recently Generated Quiz",
        description: "Automatically generated from your uploaded document",
        documentId: "doc-new",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionCount: 8,
        completedCount: 0,
        lastAttemptedAt: null,
        averageScore: 0,
        tags: ["Generated", "AI"]
      }
    };
    
    return quizzes[quizId as keyof typeof quizzes] || quizzes["quiz1"]; // Default to quiz1 if ID not found
  },
  
  // Get questions for a specific quiz
  getQuizQuestions: async (quizId: string): Promise<QuizQuestion[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Generate dummy questions based on quiz ID
    const questionsByQuiz = {
      "quiz1": [
        {
          id: "q1",
          quizId: "quiz1",
          question: "What is supervised learning?",
          options: [
            "Learning without labeled data",
            "Learning with labeled data to predict outputs",
            "Learning by reinforcement",
            "Learning by clustering similar data"
          ],
          correctOptionIndex: 1,
          explanation: "Supervised learning uses labeled data to train models to predict outputs based on inputs.",
          difficulty: "medium"
        },
        {
          id: "q2",
          quizId: "quiz1",
          question: "Which of the following is NOT a type of machine learning?",
          options: [
            "Supervised learning",
            "Unsupervised learning",
            "Reinforcement learning",
            "Descriptive learning"
          ],
          correctOptionIndex: 3,
          explanation: "The three main types of machine learning are supervised, unsupervised, and reinforcement learning.",
          difficulty: "easy"
        },
        {
          id: "q3",
          quizId: "quiz1",
          question: "What is the purpose of a loss function in machine learning?",
          options: [
            "To measure the accuracy of predictions",
            "To generate new training data",
            "To visualize the model's structure",
            "To compress the model for deployment"
          ],
          correctOptionIndex: 0,
          explanation: "A loss function measures how well the model's predictions match the actual values.",
          difficulty: "medium"
        }
      ],
      "quiz2": [
        {
          id: "q4",
          quizId: "quiz2",
          question: "Which data structure follows the Last In First Out (LIFO) principle?",
          options: [
            "Queue",
            "Stack",
            "Linked List",
            "Binary Tree"
          ],
          correctOptionIndex: 1,
          explanation: "A stack follows the Last In First Out (LIFO) principle.",
          difficulty: "easy"
        },
        {
          id: "q5",
          quizId: "quiz2",
          question: "What is the time complexity of binary search in a sorted array?",
          options: [
            "O(1)",
            "O(n)",
            "O(log n)",
            "O(n log n)"
          ],
          correctOptionIndex: 2,
          explanation: "Binary search has a time complexity of O(log n) because it divides the search space in half with each step.",
          difficulty: "medium"
        },
        {
          id: "q6",
          quizId: "quiz2",
          question: "Which of the following is NOT a balanced binary search tree?",
          options: [
            "AVL Tree",
            "Red-Black Tree",
            "B-Tree",
            "Binary Search Tree"
          ],
          correctOptionIndex: 3,
          explanation: "A regular Binary Search Tree is not necessarily balanced, while AVL, Red-Black, and B-Trees are balanced tree structures.",
          difficulty: "hard"
        }
      ],
      "quiz3": [
        {
          id: "q7",
          quizId: "quiz3",
          question: "Which HTML tag is used to create a hyperlink?",
          options: [
            "<link>",
            "<a>",
            "<href>",
            "<url>"
          ],
          correctOptionIndex: 1,
          explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML.",
          difficulty: "easy"
        },
        {
          id: "q8",
          quizId: "quiz3",
          question: "Which CSS property is used to change the text color?",
          options: [
            "text-color",
            "font-color",
            "color",
            "text-style"
          ],
          correctOptionIndex: 2,
          explanation: "The 'color' property is used to change the text color in CSS.",
          difficulty: "easy"
        },
        {
          id: "q9",
          quizId: "quiz3",
          question: "What does the 'let' keyword do in JavaScript?",
          options: [
            "Declares a constant variable",
            "Declares a block-scoped variable",
            "Declares a global variable",
            "Declares a function"
          ],
          correctOptionIndex: 1,
          explanation: "The 'let' keyword declares a block-scoped variable in JavaScript.",
          difficulty: "medium"
        }
      ]
    };
    
    return questionsByQuiz[quizId as keyof typeof questionsByQuiz] || [];
  },
  
  // Get quiz attempts for a specific quiz
  getQuizAttempts: async (quizId: string): Promise<QuizAttempt[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return dummy attempts based on quiz ID
    const attemptsByQuiz = {
      "quiz1": [
        {
          id: "attempt1",
          quizId: "quiz1",
          startedAt: "2025-03-30T15:00:00Z",
          completedAt: "2025-03-30T15:15:00Z",
          score: 80,
          totalQuestions: 10,
          correctAnswers: 8
        },
        {
          id: "attempt2",
          quizId: "quiz1",
          startedAt: "2025-03-29T14:00:00Z",
          completedAt: "2025-03-29T14:12:00Z",
          score: 90,
          totalQuestions: 10,
          correctAnswers: 9
        }
      ],
      "quiz2": [
        {
          id: "attempt3",
          quizId: "quiz2",
          startedAt: "2025-03-30T13:00:00Z",
          completedAt: "2025-03-30T13:10:00Z",
          score: 75,
          totalQuestions: 8,
          correctAnswers: 6
        }
      ],
      "quiz3": [
        {
          id: "attempt4",
          quizId: "quiz3",
          startedAt: "2025-03-30T14:00:00Z",
          completedAt: "2025-03-30T14:15:00Z",
          score: 92,
          totalQuestions: 12,
          correctAnswers: 11
        },
        {
          id: "attempt5",
          quizId: "quiz3",
          startedAt: "2025-03-28T16:00:00Z",
          completedAt: "2025-03-28T16:18:00Z",
          score: 83,
          totalQuestions: 12,
          correctAnswers: 10
        }
      ]
    };
    
    return attemptsByQuiz[quizId as keyof typeof attemptsByQuiz] || [];
  }
};