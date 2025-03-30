"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { AuthDialog } from "../auth/AuthDialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

export const Navbar: React.FC = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  
  // Simple check for authenticated user
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') ? true : null;
    }
    return null;
  });

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Redirect to home if needed
    window.location.href = '/';
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-white h-8 w-8 rounded-md flex items-center justify-center font-bold text-lg">
            LN
          </div>
          <span className="font-bold text-xl">LazyNote</span>
        </Link>
        
        {/* Navigation - Conditional based on route */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {isLandingPage ? (
              // Landing page navigation
              <>
                <NavigationMenuItem>
                  <button
                    onClick={() => scrollToSection('features')}
                    className={navigationMenuTriggerStyle()}
                  >
                    Features
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button
                    onClick={() => scrollToSection('testimonials')}
                    className={navigationMenuTriggerStyle()}
                  >
                    Testimonials
                  </button>
                </NavigationMenuItem>
              </>
            ) : (
              // Authenticated user navigation
              user && (
                <>
                  <NavigationMenuItem>
                    <Link href="/dashboard" legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={navigationMenuTriggerStyle()}
                        active={pathname === "/dashboard"}
                      >
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/flashcards" legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={navigationMenuTriggerStyle()}
                        active={pathname.startsWith("/flashcards")}
                      >
                        Flashcards
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/quizzes" legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={navigationMenuTriggerStyle()}
                        active={pathname.startsWith("/quizzes")}
                      >
                        Quizzes
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>
        
        {/* Auth Button */}
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <Button onClick={() => setAuthDialogOpen(true)}>
              Sign In
            </Button>
          )}
        </div>
      </div>

      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />
    </header>
  );
};

export default Navbar;