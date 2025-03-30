"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [generatedSetId, setGeneratedSetId] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleUpload = async () => {
    if (files.length === 0 || !title.trim()) {
      setError("Please select at least one file and provide a title.");
      return;
    }
    
    try {
      setError(null);
      setUploadStatus("uploading");
      
      // Simulate file upload progress
      let progress = 0;
      const uploadInterval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(uploadInterval);
          setUploadStatus("processing");
          simulateProcessing();
        }
      }, 200);
      
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again.");
      setUploadStatus("error");
    }
  };
  
  const simulateProcessing = () => {
    let progress = 0;
    const processInterval = setInterval(() => {
      progress += 3;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(processInterval);
        setUploadStatus("completed");
        setGeneratedSetId("set1");
      }
    }, 300);
  };
  
  return (
    <div className="space-y-6">
      {uploadStatus === "completed" ? (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-800 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Processing Complete!</h3>
          <p className="text-gray-500 mb-6">
            Your flashcards have been successfully created.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 justify-center">
            <Button asChild>
              <Link href={`/flashcards/${generatedSetId}`}>Study Now</Link>
            </Button>
            <Button variant="outline" onClick={() => {
              setFiles([]);
              setTitle("");
              setTags([]);
              setUploadStatus("idle");
            }}>
              Upload Another File
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.ppt,.pptx"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploadStatus !== "idle"}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 mb-4"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <p className="text-lg font-medium mb-1">
                {files.length > 0
                  ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                  : "Select Files"}
              </p>
              <p className="text-sm text-gray-500">
                Support for PDF, Word, PowerPoint, Text, and Images
              </p>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="block mb-2">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter a title for your flashcard set"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploadStatus !== "idle"}
              />
            </div>
            
            <div>
              <Label htmlFor="tags" className="block mb-2">
                Tags (optional)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  disabled={uploadStatus !== "idle"}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  disabled={uploadStatus !== "idle"}
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-gray-300 rounded-full h-4 w-4 inline-flex items-center justify-center"
                        disabled={uploadStatus !== "idle"}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {(uploadStatus === "uploading" || uploadStatus === "processing") && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {uploadStatus === "uploading"
                          ? "Uploading files..."
                          : "Processing content..."}
                      </span>
                      <span>
                        {uploadStatus === "uploading"
                          ? `${uploadProgress}%`
                          : `${processingProgress}%`}
                      </span>
                    </div>
                    <Progress
                      value={
                        uploadStatus === "uploading"
                          ? uploadProgress
                          : processingProgress
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {uploadStatus === "uploading"
                        ? "Please wait while we upload your files..."
                        : "Our AI is analyzing your content and creating flashcards..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={
                  files.length === 0 ||
                  !title.trim() ||
                  uploadStatus !== "idle"
                }
              >
                Upload and Generate Flashcards
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};