"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FlashcardViewerProps {
  card: {
    id: string;
    question: string;
    answer: string;
    mastered: boolean;
  };
  onMasteryToggle: (mastered: boolean) => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  card,
  onMasteryToggle,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Badge variant={card.mastered ? "default" : "secondary"}>
          {card.mastered ? "Mastered" : "Not Mastered"}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMasteryToggle(!card.mastered)}
        >
          Mark as {card.mastered ? "Not Mastered" : "Mastered"}
        </Button>
      </div>

      <div
        className="relative w-full cursor-pointer"
        style={{ perspective: "1000px", minHeight: "300px" }}
        onClick={handleFlip}
      >
        <div
          className={`w-full transition-transform duration-500 relative ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "",
          }}
        >
          <Card
            className={`w-full absolute backface-hidden ${
              isFlipped ? "hidden" : ""
            }`}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
              <h3 className="text-xl font-semibold mb-4">Question</h3>
              <p className="text-center">{card.question}</p>
            </CardContent>
          </Card>

          <Card
            className={`w-full absolute backface-hidden ${
              !isFlipped ? "hidden" : ""
            }`}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
              <h3 className="text-xl font-semibold mb-4">Answer</h3>
              <p className="text-center">{card.answer}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">Click the card to flip it</p>
      </div>
    </div>
  );
};