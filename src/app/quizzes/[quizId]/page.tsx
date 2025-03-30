"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Brain, Clock, Edit, Play } from "lucide-react";
import Link from "next/link";
import { User, Quiz, QuizQuestion, QuizAttempt } from "@/lib/models/types";
import { authService, quizService } from "@/lib/services/mock-services";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function QuizPage({ params }: { params: { quizId: string } }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handle client-side mounting and authentication
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.replace('/');
      return;
    }

    // Verify token and get user data
    const verifyAuth = async () => {
      try {
        const userData = await authService.verifyToken(token);
        setUser(userData);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        router.replace('/');
      }
    };

    verifyAuth();
  }, [router]);

  // Fetch quiz data
  useEffect(() => {
    if (!mounted || !user) return;

    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        const quizData = await quizService.getQuiz(params.quizId);
        setQuiz(quizData);
        
        const questionsData = await quizService.getQuizQuestions(params.quizId);
        setQuestions(questionsData);
        
        const attemptsData = await quizService.getQuizAttempts(params.quizId);
        setAttempts(attemptsData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [user, mounted, params.quizId]);

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  // Show loading state
  if (isLoading || !user || !quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/quizzes">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Quizzes
                </Link>
              </Button>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
                <p className="text-muted-foreground mt-1">{quiz.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {quiz.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Questions</span>
                    <span className="text-2xl font-semibold">{quiz.questionCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Attempts</span>
                    <span className="text-2xl font-semibold">{quiz.completedCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <span className="text-2xl font-semibold">{quiz.averageScore}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 min-w-[200px]">
                <Button asChild>
                  <Link href={`/quizzes/take/${quiz.id}`}>
                    <Play className="h-4 w-4 mr-2" />
                    Take Quiz
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/quizzes/edit/${quiz.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Quiz
                  </Link>
                </Button>
              </div>
            </div>

            <Tabs defaultValue="questions" className="w-full mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="attempts">Attempts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="questions" className="space-y-4">
                {questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <QuestionCard key={question.id} question={question} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg font-medium">No questions available</p>
                    <p className="text-muted-foreground mt-1">
                      This quiz doesn't have any questions yet.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="attempts" className="space-y-4">
                {attempts.length > 0 ? (
                  <div className="space-y-4">
                    {attempts.map((attempt) => (
                      <AttemptCard key={attempt.id} attempt={attempt} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg font-medium">No attempts yet</p>
                    <p className="text-muted-foreground mt-1">
                      You haven't attempted this quiz yet.
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href={`/quizzes/take/${quiz.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Take Quiz Now
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

// Question Card Component
function QuestionCard({ question, index }: { question: QuizQuestion; index: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Question {index + 1}: {question.question}
        </CardTitle>
        <CardDescription>
          <Badge variant={
            question.difficulty === "easy" ? "outline" : 
            question.difficulty === "medium" ? "secondary" : 
            "destructive"
          }>
            {question.difficulty}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {question.options.map((option, optIndex) => (
            <div 
              key={optIndex} 
              className={`p-3 rounded-md border ${
                optIndex === question.correctOptionIndex 
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20" 
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              {option}
              {optIndex === question.correctOptionIndex && (
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Correct answer
                </div>
              )}
            </div>
          ))}
          
          {question.explanation && (
            <div className="mt-4 text-sm text-muted-foreground">
              <strong>Explanation:</strong> {question.explanation}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Attempt Card Component
function AttemptCard({ attempt }: { attempt: QuizAttempt }) {
  // Calculate duration in minutes
  const getDuration = () => {
    if (!attempt.completedAt) return "In progress";
    
    const start = new Date(attempt.startedAt).getTime();
    const end = new Date(attempt.completedAt).getTime();
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {new Date(attempt.startedAt).toLocaleDateString()} at {new Date(attempt.startedAt).toLocaleTimeString()}
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{getDuration()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-xl font-semibold">{attempt.score}%</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Correct</div>
              <div className="text-xl font-semibold">{attempt.correctAnswers}/{attempt.totalQuestions}</div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" asChild>
            <Link href={`/quizzes/results/${attempt.id}`}>
              View Results
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}