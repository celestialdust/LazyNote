// src/components/home/Features.tsx
"use client";

import React from "react";
import { Card, CardContent } from "../../components/ui/card";

const Features: React.FC = () => {
  const features = [
    {
      title: "AI-Powered Flashcards",
      description: "Upload your notes and our AI will automatically generate comprehensive flashcards for efficient studying.",
      icon: "📚"
    },
    {
      title: "Smart Quizzes",
      description: "Test your knowledge with personalized quizzes that adapt to your learning progress.",
      icon: "🧠"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your study habits and knowledge retention with detailed analytics.",
      icon: "📈"
    },
    {
      title: "Cross-Platform Access",
      description: "Study anywhere, anytime with our web and mobile applications.",
      icon: "📱"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Features That Make Learning Effortless</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            LazyNote combines AI technology with proven study methods to help you learn faster and remember longer.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;