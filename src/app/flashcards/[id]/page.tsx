"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Play, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { User, FlashcardSet, Flashcard } from "@/lib/models/types";
import { authService, flashcardService } from "@/lib/services/mock-services";

export default function FlashcardSetPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
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

  // Fetch flashcard set and cards
  useEffect(() => {
    if (!mounted || !user || !id) return;

    const fetchFlashcardData = async () => {
      try {
        setIsLoading(true);
        const set = await flashcardService.getFlashcardSet(id);
        setFlashcardSet(set);
        
        const cards = await flashcardService.getFlashcards(id);
        setFlashcards(cards);
      } catch (error) {
        console.error("Error fetching flashcard data:", error);
        router.replace('/flashcards');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcardData();
  }, [user, mounted, id, router]);

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  // Show loading state
  if (isLoading || !user || !flashcardSet) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading flashcards...</p>
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
                <Link href="/flashcards">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to All Sets
                </Link>
              </Button>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{flashcardSet.title}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-muted-foreground">
                    {flashcardSet.cardCount} cards • Created {new Date(flashcardSet.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-1">
                    {flashcardSet.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/flashcards/edit/${id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/flashcards/review/${id}`}>
                    <Play className="h-4 w-4 mr-1" />
                    Study Now
                  </Link>
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Flashcards</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/flashcards/edit/${id}`}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Card
                    </Link>
                  </Button>
                </div>
                <CardDescription>
                  {flashcardSet.mastered} of {flashcardSet.cardCount} cards mastered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flashcards.length > 0 ? (
                    flashcards.map((card, index) => (
                      <Card key={card.id} className="border border-muted">
                        <CardHeader className="py-3 px-4 flex flex-row justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Card {index + 1}</span>
                            {card.mastered && (
                              <Badge variant="default">Mastered</Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </CardHeader>
                        <CardContent className="px-4 py-3 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Question</h4>
                              <p className="text-sm">{card.question}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Answer</h4>
                              <p className="text-sm">{card.answer}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No flashcards in this set yet</p>
                      <Button className="mt-4" asChild>
                        <Link href={`/flashcards/edit/${id}`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Cards
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}