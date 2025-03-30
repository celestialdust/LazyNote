"use client";

import React from "react";
import  Hero from "../components/home/Hero";
import Features from "../components/home/Features"; 
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Navbar } from "../components/layout/Navbar";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="space-y-16 pb-16">
        <Hero />
        <div id="features">
          <Features />
        </div>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See how LazyNote has transformed studying for thousands of students.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 text-blue-600 h-12 w-12 rounded-full flex items-center justify-center font-bold">
                      JS
                    </div>
                    <div>
                      <h4 className="font-medium">Jessica Smith</h4>
                      <p className="text-sm text-gray-500">Computer Science, Stanford</p>
                    </div>
                  </div>
                  <p className="italic text-gray-700">
                    "LazyNote transformed my study routine. Instead of spending hours creating flashcards, I just upload my lecture notes and get perfect study materials."
                  </p>
                  <div className="flex mt-4 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      </svg>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-100 text-green-600 h-12 w-12 rounded-full flex items-center justify-center font-bold">
                      MJ
                    </div>
                    <div>
                      <h4 className="font-medium">Michael Johnson</h4>
                      <p className="text-sm text-gray-500">Medicine, Johns Hopkins</p>
                    </div>
                  </div>
                  <p className="italic text-gray-700">
                    "As a med student, I have thousands of pages to memorize. LazyNote's AI-generated quizzes help me focus on what I'm most likely to forget."
                  </p>
                  <div className="flex mt-4 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      </svg>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-purple-100 text-purple-600 h-12 w-12 rounded-full flex items-center justify-center font-bold">
                      AT
                    </div>
                    <div>
                      <h4 className="font-medium">Aisha Thomas</h4>
                      <p className="text-sm text-gray-500">Law, Columbia</p>
                    </div>
                  </div>
                  <p className="italic text-gray-700">
                    "I used to spend weekends making study materials. LazyNote creates perfect flashcards from my case briefs in seconds, giving me my life back."
                  </p>
                  <div className="flex mt-4 text-amber-400">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      </svg>
                    ))}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-primary text-white py-16 rounded-3xl">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Study Habits?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of students saving time and improving their grades with LazyNote's AI-powered study tools.
            </p>
            <Button size="lg" variant="secondary" className="px-8">
              Get Started for Free
            </Button>
            <p className="text-sm mt-4 opacity-80">No credit card required.</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;