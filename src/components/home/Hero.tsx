"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Replace React Router with Next.js router
import { Button } from "../../components/ui/button";

const Hero: React.FC = () => {
  const router = useRouter(); // Use Next.js router instead of useNavigate
  
  return (
    <div className="bg-gradient-to-b from-background to-secondary/20 py-20 md:py-32">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Study Smarter,{" "}
            <span className="text-primary">Not Harder</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl">
            LazyNote transforms your lecture materials into AI-powered flashcards and quizzes. 
            Upload your notes once, study anywhere, anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => router.push("/dashboard")}
              size="lg" 
              className="px-8"
            >
              Get Started for Free
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
          
          <div className="pt-4 text-sm text-gray-500">
            <p>Over 10,000 students are already studying smarter.</p>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg">
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-secondary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 -right-20 w-72 h-72 bg-accent/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            
            <div className="relative">
              <div className="bg-white shadow-xl rounded-2xl p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-400">LazyNote</div>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-100 p-4">
                    <div className="h-5 bg-primary/10 w-1/3 rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 rounded-lg bg-accent/10 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-4 bg-accent/20 w-1/2 rounded"></div>
                        <div className="w-8 h-8 bg-accent/20 rounded-full"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    
                    <div className="flex-1 rounded-lg bg-primary/10 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-4 bg-primary/20 w-1/2 rounded"></div>
                        <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="w-1/2 h-8 bg-primary/90 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;