"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Plus, Search, BarChart } from "lucide-react";
import Link from "next/link";
import { User, Quiz } from "@/lib/models/types";
import { authService, quizService } from "@/lib/services/mock-services";
import { Progress } from "@/components/ui/progress";

export default function QuizzesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Fetch quizzes
  useEffect(() => {
    if (!mounted || !user) return;

    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        const userQuizzes = await quizService.getQuizzes(user.id);
        setQuizzes(userQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [user, mounted]);

  // Filter quizzes based on search query
  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group quizzes by recently created and highest score
  const recentQuizzes = [...filteredQuizzes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const highestScoreQuizzes = [...filteredQuizzes].sort((a, b) => 
    b.averageScore - a.averageScore
  );

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your quizzes...</p>
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
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
              <Button asChild>
                <Link href="/quizzes/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Quiz
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Quizzes</TabsTrigger>
                <TabsTrigger value="recent">Recently Created</TabsTrigger>
                <TabsTrigger value="highest">Highest Score</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {filteredQuizzes.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                ) : (
                  <EmptyState query={searchQuery} />
                )}
              </TabsContent>
              
              <TabsContent value="recent" className="space-y-4">
                {recentQuizzes.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recentQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                ) : (
                  <EmptyState query={searchQuery} />
                )}
              </TabsContent>
              
              <TabsContent value="highest" className="space-y-4">
                {highestScoreQuizzes.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {highestScoreQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                ) : (
                  <EmptyState query={searchQuery} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

// Quiz Card Component
function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
        <CardDescription>
          {quiz.questionCount} questions • Last attempted {quiz.lastAttemptedAt ? new Date(quiz.lastAttemptedAt).toLocaleDateString() : 'Never'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Average Score: {quiz.averageScore}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {quiz.completedCount} attempts
              </span>
            </div>
          </div>
          
          <Progress value={quiz.averageScore} className="h-2" />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/quizzes/${quiz.id}`}>View</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/quizzes/take/${quiz.id}`}>Take Quiz</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-12">
      {query ? (
        <>
          <p className="text-lg font-medium">No quizzes found</p>
          <p className="text-muted-foreground mt-1">
            No results found for "{query}". Try a different search term.
          </p>
        </>
      ) : (
        <>
          <p className="text-lg font-medium">No quizzes yet</p>
          <p className="text-muted-foreground mt-1">
            Upload documents or create a new quiz to get started.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/quizzes/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New Quiz
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}