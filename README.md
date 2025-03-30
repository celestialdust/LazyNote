# LazyNote

> **Note:** LazyNote's AI feature is currently in development. Please stay tuned for new updates. I am planning to launch a commercialized version of LazyNote. If you are interested in the idea and want to join our team, please connect with me via xuejiayu@ad.unc.edu

# LazyNote System Design

## Implementation approach

Based on the product requirements, LazyNote is an AI-powered educational application that helps students retain knowledge by automatically generating flashcards and quizzes from lecture slides. The system requires sophisticated AI integration, document processing, user authentication, and an intuitive interface for learning.

### Key Implementation Challenges

1. **Document Processing Pipeline**: Extracting structured content from PDF lecture slides requires robust parsing capabilities and error handling.
2. **AI Content Analysis**: Identifying key concepts and generating high-quality flashcards and quizzes demands effective prompting and AI orchestration.
3. **Spaced Repetition Algorithm**: Implementing an effective learning algorithm that adapts to user performance.
4. **Performance at Scale**: Ensuring the system remains responsive even with many concurrent users and large document libraries.
5. **Real-time Answer Evaluation**: Providing immediate, accurate feedback on quiz responses.

### Selected Technologies

#### Frontend
- **Next.js**: For server-side rendering, optimized performance, and SEO benefits
- **React**: Component-based UI development with state management
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: For smooth animations like card flipping
- **React Query**: For efficient data fetching and caching
- **NextAuth.js**: For Google OAuth integration

#### Backend
- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web framework for REST API endpoints
- **PostgreSQL**: Relational database for structured data
- **Prisma**: ORM for type-safe database access
- **Socket.io**: For real-time updates during document processing
- **PDF.js**: For parsing PDF documents

#### AI and Vector Database
- **OpenAI API**: For content analysis and generation
- **OpenAI Agents SDK**: For orchestrating AI workflows
- **Pinecone**: Vector database for similarity search
- **LangChain**: For structured AI interactions and prompt management

#### Infrastructure
- **Docker**: For containerization
- **AWS S3**: For document storage
- **Redis**: For caching and session management
- **GitHub Actions**: For CI/CD

## Data structures and interfaces

The data structures and interfaces are designed to support the core functionality of the LazyNote application, including user management, document processing, flashcard and quiz generation, and performance tracking.

### Core Domain Models

The following class diagram illustrates the main entities in the LazyNote system and their relationships:

```mermaid
classDiagram
    class User {
        +id: UUID
        +email: string
        +name: string
        +picture: string
        +createdAt: DateTime
        +updatedAt: DateTime
        +preferences: JSON
        +lastLogin: DateTime
        +getDocuments(): Document[]
        +getStats(): UserStats
        +createDocument(file): Document
    }

    class Document {
        +id: UUID
        +userId: UUID
        +title: string
        +fileUrl: string
        +fileType: string
        +uploadedAt: DateTime
        +processingStatus: string
        +processingError: string
        +pageCount: number
        +extractedContent: JSON
        +getTopics(): Topic[]
        +process(): void
        +generateFlashcards(): void
        +generateQuizzes(): void
    }

    class Topic {
        +id: UUID
        +documentId: UUID
        +name: string
        +description: string
        +createdAt: DateTime
        +confidence: number
        +vectorEmbedding: vector
        +getFlashcards(): Flashcard[]
        +getQuizzes(): Quiz[]
    }

    class Flashcard {
        +id: UUID
        +topicId: UUID
        +question: string
        +answer: string
        +difficultyLevel: number
        +createdAt: DateTime
        +updatedAt: DateTime
        +nextReviewAt: DateTime
        +reviewCount: number
        +easeFactor: number
        +userEdited: boolean
        +sourcePageNumber: number
        +review(rating: number): void
        +updateContent(question: string, answer: string): void
    }

    class Quiz {
        +id: UUID
        +topicId: UUID
        +title: string
        +description: string
        +createdAt: DateTime
        +getQuestions(): Question[]
        +calculateScore(): number
    }

    class Question {
        +id: UUID
        +quizId: UUID
        +questionText: string
        +expectedAnswer: string
        +difficulty: number
        +createdAt: DateTime
        +sourcePageNumber: number
        +getAttempts(): QuestionAttempt[]
        +evaluateAnswer(userAnswer: string): number
    }

    class QuestionAttempt {
        +id: UUID
        +questionId: UUID
        +userId: UUID
        +userAnswer: string
        +score: number
        +feedback: string
        +createdAt: DateTime
        +timeTaken: number
    }

    class UserStats {
        +id: UUID
        +userId: UUID
        +totalStudyTime: number
        +flashcardsReviewed: number
        +quizzesCompleted: number
        +averageScore: number
        +lastStudyDate: DateTime
        +streakDays: number
        +calculateRetentionRate(): number
        +getWeakTopics(): Topic[]
    }

    class StudySession {
        +id: UUID
        +userId: UUID
        +startTime: DateTime
        +endTime: DateTime
        +sessionType: string
        +itemsStudied: number
        +topicIds: UUID[]
    }

    User "1" --o "*" Document
    Document "1" --o "*" Topic
    Topic "1" --o "*" Flashcard
    Topic "1" --o "*" Quiz
    Quiz "1" --o "*" Question
    Question "1" --o "*" QuestionAttempt
    User "1" --o "1" UserStats
    User "1" --o "*" StudySession
    User "1" --o "*" QuestionAttempt
```

### Service Layer Interfaces

```mermaid
classDiagram
    class AuthService {
        +googleLogin(token: string): User
        +logout(userId: string): void
        +refreshToken(refreshToken: string): string
        +validateToken(token: string): boolean
    }

    class DocumentService {
        +upload(userId: string, file: File): Document
        +getDocuments(userId: string): Document[]
        +getDocument(documentId: string): Document
        +processDocument(documentId: string): void
        +deleteDocument(documentId: string): boolean
    }

    class ContentExtractionService {
        +extractContent(documentId: string): JSON
        +identifyTopics(documentId: string): Topic[]
        +extractImages(documentId: string): Image[]
    }

    class AIService {
        +generateFlashcards(topicId: string): Flashcard[]
        +generateQuizQuestions(topicId: string): Question[]
        +evaluateAnswer(questionId: string, userAnswer: string): EvaluationResult
        +generateFeedback(questionId: string, userAnswer: string): string
    }

    class VectorDBService {
        +indexDocument(documentId: string, content: string): void
        +searchSimilarContent(query: string): SearchResult[]
        +getRecommendedContent(userId: string): RecommendationResult[]
    }

    class FlashcardService {
        +getFlashcards(topicId: string): Flashcard[]
        +getFlashcard(flashcardId: string): Flashcard
        +updateFlashcard(flashcardId: string, data: object): Flashcard
        +reviewFlashcard(flashcardId: string, rating: number): void
        +getDueFlashcards(userId: string): Flashcard[]
    }

    class QuizService {
        +createQuiz(topicId: string): Quiz
        +getQuiz(quizId: string): Quiz
        +submitAnswer(questionId: string, answer: string): EvaluationResult
        +getQuizResults(quizId: string): QuizResult
    }

    class AnalyticsService {
        +getUserStats(userId: string): UserStats
        +getTopicPerformance(userId: string, topicId: string): TopicPerformance
        +recordStudySession(sessionData: object): StudySession
        +getStudyTrends(userId: string, timeframe: string): TrendData
    }

    class SpacedRepetitionService {
        +calculateNextReview(flashcardId: string, rating: number): DateTime
        +getDailyReviewSchedule(userId: string): ReviewSchedule
        +updateEaseFactor(flashcardId: string, rating: number): number
    }
```

### API Endpoints

#### Authentication API

```mermaid
classDiagram
    class AuthController {
        +POST /api/auth/google-login
        +POST /api/auth/logout
        +POST /api/auth/refresh-token
        +GET /api/auth/user
    }
```

#### Document API

```mermaid
classDiagram
    class DocumentController {
        +POST /api/documents
        +GET /api/documents
        +GET /api/documents/:id
        +DELETE /api/documents/:id
        +GET /api/documents/:id/topics
        +GET /api/documents/:id/processing-status
    }
```

#### Flashcard API

```mermaid
classDiagram
    class FlashcardController {
        +GET /api/topics/:id/flashcards
        +GET /api/flashcards/:id
        +PUT /api/flashcards/:id
        +POST /api/flashcards/:id/review
        +GET /api/flashcards/due
    }
```

#### Quiz API

```mermaid
classDiagram
    class QuizController {
        +POST /api/topics/:id/quizzes
        +GET /api/quizzes/:id
        +GET /api/quizzes/:id/questions
        +POST /api/questions/:id/answer
        +GET /api/quizzes/:id/results
    }
```

#### Analytics API

```mermaid
classDiagram
    class AnalyticsController {
        +GET /api/users/:id/stats
        +GET /api/users/:id/topics/:topicId/performance
        +POST /api/study-sessions
        +GET /api/users/:id/study-trends
    }
```

## Program call flow

The following sequence diagrams illustrate the main flows in the LazyNote application.

### User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (Next.js)
    participant Auth as AuthController
    participant Google as Google OAuth
    participant DB as PostgreSQL

    User->>FE: Click Login with Google
    FE->>Google: Redirect to Google OAuth
    Google->>User: Present login screen
    User->>Google: Enter credentials
    Google->>FE: Return auth code
    FE->>Auth: POST /api/auth/google-login (code)
    Auth->>Google: Exchange code for tokens
    Google->>Auth: Return tokens and profile
    Auth->>DB: Find or create user
    DB->>Auth: Return user data
    Auth->>Auth: Generate JWT
    Auth->>FE: Return JWT and user data
    FE->>FE: Store JWT in secure cookie
    FE->>User: Redirect to dashboard
```

### Document Upload and Processing Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (Next.js)
    participant DC as DocumentController
    participant DS as DocumentService
    participant CES as ContentExtractionService
    participant AIService as AIService
    participant S3 as AWS S3
    participant DB as PostgreSQL
    participant Socket as Socket.io

    User->>FE: Upload PDF document
    FE->>DC: POST /api/documents (multipart/form-data)
    DC->>DS: upload(userId, file)
    DS->>S3: Store PDF file
    S3->>DS: Return file URL
    DS->>DB: Create Document record
    DB->>DS: Return Document data
    DS->>DC: Return Document (processingStatus: "pending")
    DC->>FE: Return Document data
    FE->>Socket: Subscribe to processing updates

    Note over DS,AIService: Asynchronous processing starts
    DS->>CES: processDocument(documentId)
    CES->>S3: Fetch PDF from S3
    S3->>CES: Return PDF data
    CES->>CES: Extract text and structure
    CES->>DB: Update Document with extractedContent
    CES->>CES: identifyTopics(documentId)
    CES->>DB: Create Topic records
    Socket->>FE: Send processing update (topics created)
    CES->>AIService: generateFlashcards(topicId) for each topic
    AIService->>AIService: Generate flashcards using OpenAI API
    AIService->>DB: Create Flashcard records
    Socket->>FE: Send processing update (flashcards created)
    CES->>AIService: generateQuizQuestions(topicId) for each topic
    AIService->>AIService: Generate quiz questions using OpenAI API
    AIService->>DB: Create Quiz and Question records
    Socket->>FE: Send processing update (quizzes created)
    CES->>DB: Update Document (processingStatus: "completed")
    Socket->>FE: Send processing completion
    FE->>FE: Update UI to show completion
    FE->>User: Show success notification
```

### Flashcard Review Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (Next.js)
    participant FC as FlashcardController
    participant FS as FlashcardService
    participant SRS as SpacedRepetitionService
    participant AS as AnalyticsService
    participant DB as PostgreSQL

    User->>FE: Open flashcard review
    FE->>FC: GET /api/flashcards/due
    FC->>FS: getDueFlashcards(userId)
    FS->>DB: Query due flashcards
    DB->>FS: Return flashcards
    FS->>FC: Return flashcard list
    FC->>FE: Return flashcard data
    FE->>User: Display flashcard (question side)

    User->>FE: Flip card
    FE->>User: Display answer side

    User->>FE: Rate recall (Easy/Good/Hard)
    FE->>FC: POST /api/flashcards/:id/review (rating)
    FC->>FS: reviewFlashcard(flashcardId, rating)
    FS->>SRS: calculateNextReview(flashcardId, rating)
    SRS->>SRS: Apply spaced repetition algorithm
    SRS->>FS: Return next review date
    FS->>DB: Update flashcard review data
    DB->>FS: Return updated flashcard
    FS->>AS: recordStudySession(sessionData)
    AS->>DB: Create/update study session
    FS->>FC: Return success
    FC->>FE: Return success
    FE->>FE: Show next flashcard
```

### Quiz Attempt Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (Next.js)
    participant QC as QuizController
    participant QS as QuizService
    participant AIS as AIService
    participant AS as AnalyticsService
    participant DB as PostgreSQL

    User->>FE: Start quiz
    FE->>QC: POST /api/topics/:id/quizzes
    QC->>QS: createQuiz(topicId)
    QS->>DB: Create new quiz
    DB->>QS: Return quiz with questions
    QS->>QC: Return quiz data
    QC->>FE: Return quiz with first question
    FE->>User: Display quiz question

    User->>FE: Submit answer
    FE->>QC: POST /api/questions/:id/answer (userAnswer)
    QC->>QS: submitAnswer(questionId, answer)
    QS->>AIS: evaluateAnswer(questionId, userAnswer)
    AIS->>AIS: Process with OpenAI API
    AIS->>QS: Return evaluation result
    QS->>DB: Create QuestionAttempt record
    QS->>QC: Return evaluation and feedback
    QC->>FE: Return result data
    FE->>User: Display feedback and score

    User->>FE: Continue to next question
    FE->>User: Display next question

    Note over User,FE: Repeat for all questions

    User->>FE: Complete quiz
    FE->>QC: GET /api/quizzes/:id/results
    QC->>QS: getQuizResults(quizId)
    QS->>DB: Calculate final results
    QS->>QC: Return quiz results
    QC->>FE: Return results data
    FE->>User: Display quiz summary and score
    FE->>AS: POST /api/study-sessions (quiz completion)
    AS->>DB: Update user statistics
```

### Analytics Data Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (Next.js)
    participant AC as AnalyticsController
    participant AS as AnalyticsService
    participant DB as PostgreSQL

    User->>FE: Open dashboard/analytics
    FE->>AC: GET /api/users/:id/stats
    AC->>AS: getUserStats(userId)
    AS->>DB: Query user statistics
    DB->>AS: Return stats data
    AS->>AC: Return formatted stats
    AC->>FE: Return user statistics

    FE->>AC: GET /api/users/:id/study-trends?timeframe=month
    AC->>AS: getStudyTrends(userId, "month")
    AS->>DB: Query study sessions and performance
    DB->>AS: Return trend data
    AS->>AC: Return processed trends
    AC->>FE: Return trend data

    FE->>FE: Render charts and analytics
    FE->>User: Display performance analytics
```

