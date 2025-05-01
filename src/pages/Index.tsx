
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { LinkIcon, ArrowRight, LogIn } from "lucide-react";

const Index = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

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
      
      // Show analyzing state
      setIsAnalyzing(true);
      
      // Store URL in localStorage to persist through auth
      localStorage.setItem('analyzedWebsiteUrl', url);
      
      // Navigate to auth page
      navigate(`/auth`);
      
      // Reset state
      setIsAnalyzing(false);
    } catch (error) {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  // Animation classes to be applied after component mount
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mount
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20 min-h-screen flex items-center">
        <div className="container max-w-5xl px-4 mx-auto">
          <div className="flex justify-end mb-4">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </div>
          
          <div className="text-center">
            <div className={`space-y-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-block bg-purple-100 px-4 py-1 rounded-full mb-4">
                <p className="text-purple-800 text-sm font-medium">AI-Powered Advertising</p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mx-auto max-w-3xl">
                Launch <span className="text-primary">high-performing</span> ad campaigns in seconds
              </h1>
              <p className="text-xl text-gray-600 mx-auto max-w-2xl mb-8">
                Blastari uses AI to analyze your website and create optimized ad campaigns tailored to your business needs.
              </p>
              
              <div className="pt-6 max-w-xl mx-auto">
                <Card className="border-2 border-purple-100 shadow-lg animate-[fade-in_0.7s_ease-out]">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <div className="flex items-center w-full gap-2 bg-white border rounded-md px-3">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                        <Input 
                          value={url} 
                          onChange={(e) => setUrl(e.target.value)} 
                          placeholder="Enter your website URL"
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="relative overflow-hidden group mx-auto"
                        disabled={isAnalyzing}
                      >
                        <span className="absolute right-full w-12 h-32 -mt-12 bg-white opacity-10 transform rotate-12 group-hover:translate-x-96 transition-transform duration-1000 ease-out"></span>
                        {isAnalyzing ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Get Campaign Recommendations
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container max-w-5xl px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold">Blastari</h2>
              <p className="text-gray-400">AI-powered ad campaign platform</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary">Features</a>
              <a href="#" className="hover:text-primary">Pricing</a>
              <a href="#" className="hover:text-primary">Documentation</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Blastari. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
