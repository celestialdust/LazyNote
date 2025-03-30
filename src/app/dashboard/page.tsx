"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { BarChart, BookOpen, Brain, Clock, FileText, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { User, UserStats, Document } from "@/lib/models/types";
import { analyticsService, documentService, authService } from "@/lib/services/mock-services";

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
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

  // Fetch dashboard data
  useEffect(() => {
    if (!mounted || !user) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user stats
        const userStats = await analyticsService.getUserStats(user.id);
        setStats(userStats);

        // Fetch user documents
        const userDocuments = await documentService.getDocuments(user.id);
        setDocuments(userDocuments);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, mounted]);

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
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
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
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.name}! Upload your lecture slides or continue your learning journey.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Flashcards Created</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.flashcardsCreated || 0}</div>
                  <p className="text-xs text-muted-foreground">{stats?.flashcardsReviewed || 0} reviewed</p>
                  <Progress value={((stats?.flashcardsReviewed || 0) / (stats?.flashcardsCreated || 1)) * 100} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.quizzesCompleted || 0}/15</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(((stats?.quizzesCompleted || 0) / 15) * 100)}% completion rate
                  </p>
                  <Progress value={((stats?.quizzesCompleted || 0) / 15) * 100} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.averageScore || 0}%</div>
                  <p className="text-xs text-muted-foreground">+2% from last week</p>
                  <Progress value={stats?.averageScore || 0} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{((stats?.totalStudyTime || 0) / 60).toFixed(1)} hrs</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>
                    Your recently uploaded study materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.length > 0 ? (
                      documents.slice(0, 3).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between border-b pb-3">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-10 w-10 p-2 bg-muted rounded-md" />
                            <div>
                              <p className="font-medium">{doc.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(doc.createdAt).toLocaleDateString()} • {doc.flashcardCount} flashcards • {doc.quizCount} quizzes
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/flashcards/${doc.id}`}>Flashcards</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/quizzes/${doc.id}`}>Quizzes</Link>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No documents uploaded yet</p>
                      </div>
                    )}
                    
                    {documents.length > 0 && (
                      <div className="text-center pt-2">
                        <Button variant="outline" asChild>
                          <Link href="/documents">View all documents</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Material</CardTitle>
                  <CardDescription>
                    Upload lecture slides or notes to create flashcards and quizzes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Flashcards</CardTitle>
                    <CardDescription>Review and create flashcard sets</CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/flashcards">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Set
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Sets</span>
                      <span className="font-medium">{documents.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cards Created</span>
                      <span className="font-medium">{stats?.flashcardsCreated || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mastery Rate</span>
                      <span className="font-medium">{Math.round(((stats?.flashcardsReviewed || 0) / (stats?.flashcardsCreated || 1)) * 100)}%</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link href="/flashcards">View All Flashcards</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Quizzes</CardTitle>
                    <CardDescription>Test your knowledge</CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/quizzes">
                      <Plus className="h-4 w-4 mr-2" />
                      New Quiz
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Quizzes Taken</span>
                      <span className="font-medium">{stats?.quizzesCompleted || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Score</span>
                      <span className="font-medium">{stats?.averageScore || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Available Quizzes</span>
                      <span className="font-medium">{documents.reduce((total, doc) => total + doc.quizCount, 0)}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link href="/quizzes">View All Quizzes</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}