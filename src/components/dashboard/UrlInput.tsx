
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error("Please enter a website URL");
      return;
    }
    
    // Simple URL validation
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol.startsWith("http")) {
        throw new Error("Invalid URL");
      }
      onAnalyze(url);
    } catch (error) {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Start Your Ad Campaign</CardTitle>
        <CardDescription>
          Enter your website URL to get AI-powered campaign recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Analyze
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UrlInput;
