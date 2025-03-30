
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { User, FlashcardSet } from "@/lib/models/types";
import { authService, flashcardService } from "@/lib/services/mock-services";

export default function FlashcardsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
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

  // Fetch flashcard sets
  useEffect(() => {
    if (!mounted || !user) return;

    const fetchFlashcardSets = async () => {
      try {
        setIsLoading(true);
        const sets = await flashcardService.getFlashcardSets(user.id);
        setFlashcardSets(sets);
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcardSets();
  }, [user, mounted]);

  // Filter flashcard sets based on search query
  const filteredSets = flashcardSets.filter(set => 
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group sets by recently created and most studied
  const recentSets = [...filteredSets].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const mostStudiedSets = [...filteredSets].sort((a, b) => 
    (b.mastered / b.cardCount) - (a.mastered / a.cardCount)
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
          <p className="mt-4 text-muted-foreground">Loading your flashcards...</p>
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
              <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
              <Button asChild>
                <Link href="/flashcards/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Set
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search flashcard sets..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Sets</TabsTrigger>
                <TabsTrigger value="recent">Recently Created</TabsTrigger>
                <TabsTrigger value="studied">Most Studied</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {filteredSets.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSets.map((set) => (
                      <FlashcardSetCard key={set.id} set={set} />
                    ))}
                  </div>
                ) : (
                  <EmptyState query={searchQuery} />
                )}
              </TabsContent>
              
              <TabsContent value="recent" className="space-y-4">
                {recentSets.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recentSets.map((set) => (
                      <FlashcardSetCard key={set.id} set={set} />
                    ))}
                  </div>
                ) : (
                  <EmptyState query={searchQuery} />
                )}
              </TabsContent>
              
              <TabsContent value="studied" className="space-y-4">
                {mostStudiedSets.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mostStudiedSets.map((set) => (
                      <FlashcardSetCard key={set.id} set={set} />
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

// Flashcard Set Card Component
function FlashcardSetCard({ set }: { set: FlashcardSet }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{set.title}</CardTitle>
        
        <CardDescription>
          {set.cardCount} cards • Last studied {set.lastStudiedAt ? new Date(set.lastStudiedAt).toLocaleDateString() : 'Never'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {set.mastered} of {set.cardCount} mastered
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/flashcards/${set.id}`}>View</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/flashcards/review/${set.id}`}>Study</Link>
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
          <p className="text-lg font-medium">No flashcard sets found</p>
          <p className="text-muted-foreground mt-1">
            No results found for "{query}". Try a different search term.
          </p>
        </>
      ) : (
        <>
          <p className="text-lg font-medium">No flashcard sets yet</p>
          <p className="text-muted-foreground mt-1">
            Upload documents or create a new flashcard set to get started.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/flashcards/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New Set
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}