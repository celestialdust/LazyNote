"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { User, Quiz, QuizQuestion } from "@/lib/models/types";
import { authService, quizService } from "@/lib/services/mock-services";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function TakeQuizPage({ params }: { params: { quizId: string } }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizStartTime] = useState(new Date());

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
        
        // Initialize selected answers array with -1 (no selection)
        setSelectedAnswers(new Array(questionsData.length).fill(-1));
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [user, mounted, params.quizId]);

  // Timer effect
  useEffect(() => {
    if (!mounted || isLoading) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((new Date().getTime() - quizStartTime.getTime()) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [mounted, isLoading, quizStartTime]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleSelectAnswer = (optionIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    // Calculate score
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctOptionIndex
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    // In a real app, you would send this data to the server
    // For now, just show an alert and redirect
    alert(`Quiz completed!\nScore: ${score}%\nCorrect answers: ${correctAnswers}/${questions.length}`);
    
    router.push(`/quizzes/${params.quizId}`);
  };

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  // Show loading state
  if (isLoading || !user || !quiz || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = selectedAnswers[currentQuestionIndex] !== -1;
  const allQuestionsAnswered = selectedAnswers.every(answer => answer !== -1);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% complete</span>
            </div>
            
            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedAnswers[currentQuestionIndex].toString()} 
                  onValueChange={(value) => handleSelectAnswer(parseInt(value))}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 py-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {isLastQuestion ? (
                  <Button 
                    onClick={handleSubmitQuiz}
                    disabled={!allQuestionsAnswered}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Submit Quiz
                  </Button>
                ) : (
                  <Button 
                    onClick={goToNextQuestion}
                    disabled={!hasAnsweredCurrent}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardFooter>
            </Card>

            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentQuestionIndex ? "default" : selectedAnswers[index] !== -1 ? "outline" : "ghost"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}