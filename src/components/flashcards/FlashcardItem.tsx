"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  totalCards: number;
  mastered: number;
  lastStudied?: string;
  tags: string[];
}

interface FlashcardItemProps {
  flashcardSet: FlashcardSet;
}

export const FlashcardItem: React.FC<FlashcardItemProps> = ({ flashcardSet }) => {
  const router = useRouter();
  const { id, title, description, totalCards, mastered, lastStudied, tags } = flashcardSet;
  
  const progressPercentage = (mastered / totalCards) * 100;
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex-grow">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{description}</p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-1.5">
            <span>Progress</span>
            <span>{mastered} / {totalCards} cards</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {lastStudied && (
            <p className="text-xs text-gray-500 mt-3">
              Last studied: {new Date(lastStudied).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t mt-4">
        <Button 
          className="w-full"
          onClick={() => router.push(`/flashcards/review/${id}`)}
        >
          Study Now
        </Button>
      </CardFooter>
    </Card>
  );
};