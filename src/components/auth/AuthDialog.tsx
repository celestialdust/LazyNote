"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Validate input
      if (!email || !password || (tab === "register" && !name)) {
        setError("Please fill in all required fields");
        return;
      }

      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = tab === "login" 
        ? { email, password }
        : { email, password, name };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (!data.token) {
        throw new Error("No token received");
      }

      // Store the token
      localStorage.setItem("token", data.token);
      
      // Close dialog and redirect
      onClose();
      router.push("/dashboard");
    } catch (err) {
      console.error("Auth error:", err);
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl">Welcome Back</DialogTitle>
              <DialogDescription className="text-gray-600">
                Login to access your study materials
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <Button type="submit" className="w-full mt-6">
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl">Create Account</DialogTitle>
              <DialogDescription className="text-gray-600">
                Join LazyNote to start learning smarter
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <Button type="submit" className="w-full mt-6">
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};