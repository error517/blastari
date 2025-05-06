
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail, PenLine, Mic, Film, Clone, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { WebsiteAnalyzer } from "@/components/WebsiteAnalyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import emailjs from '@emailjs/browser';
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface WebsiteAnalysis {
  productOverview: string;
  coreValueProposition: string;
  targetAudience: {
    type: "Consumers" | "Business" | "Government";
    segments: string[];
  };
  currentAwareness: string;
  goal: string[];
  budget: string;
  strengths: string[];
  constraints: string[];
  preferredChannels: string[];
  toneAndPersonality: string;
}

interface CampaignRecommendation {
  id: string;
  title: string;
  platform: string;
  description: string;
  insights: string[];
  roi: string;
  difficulty: "Easy" | "Medium" | "Hard";
  budget: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const websiteUrl = localStorage.getItem('analyzedWebsiteUrl') || '';
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExportForm, setShowExportForm] = useState(false);
  const [isEmailJsInitialized, setIsEmailJsInitialized] = useState(false);
  const [recommendations, setRecommendations] = useState<CampaignRecommendation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize EmailJS with your public key
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!publicKey) {
      console.error('EmailJS public key is not configured');
      toast.error('Email service is not properly configured');
      return;
    }

    try {
      emailjs.init(publicKey);
      setIsEmailJsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      toast.error('Failed to initialize email service');
    }

    // Load recommendations from localStorage
    const storedRecommendations = localStorage.getItem('campaignRecommendations');
    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    }
  }, []);

  const handleExportToEmail = () => {
    navigate('/export-campaign');
  };

  const handleCampaignClick = (recommendation: CampaignRecommendation) => {
    // Save the selected campaign to localStorage
    localStorage.setItem('selectedCampaign', JSON.stringify(recommendation));
    // Navigate to campaign launch page
    navigate(`/campaigns/launch/${recommendation.id}`);
  };

  const getIconForPlatform = (platform: string) => {
    // Simple mapping of platforms to icons
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('content')) return <PenLine className="h-4 w-4" />;
    if (lowerPlatform.includes('video')) return <Film className="h-4 w-4" />;
    if (lowerPlatform.includes('audio') || lowerPlatform.includes('podcast')) return <Mic className="h-4 w-4" />;
    if (lowerPlatform.includes('email')) return <Mail className="h-4 w-4" />;
    if (lowerPlatform.includes('social')) return <MessageCircle className="h-4 w-4" />;
    return <Clone className="h-4 w-4" />;
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-bold">B</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">AdGPT</h1>
        <p className="text-muted-foreground max-w-md">
          Save time creating ads with AI-powered campaign recommendations.
        </p>
      </div>

      {websiteUrl ? (
        <div>
          {recommendations.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((recommendation) => (
                  <Card 
                    key={recommendation.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCampaignClick(recommendation)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getIconForPlatform(recommendation.platform)}
                        </div>
                        <div>
                          <h3 className="font-medium">{recommendation.title}</h3>
                          <p className="text-xs text-muted-foreground">{recommendation.platform}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {recommendation.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={handleExportToEmail}
                  size="lg"
                  className="gap-2"
                >
                  <Mail className="h-5 w-5" />
                  Export to Email
                </Button>
              </div>
            </div>
          ) : (
            <WebsiteAnalyzer url={websiteUrl} />
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Please enter a website URL on the landing page to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
