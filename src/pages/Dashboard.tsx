
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UrlInput from "@/components/dashboard/UrlInput";
import CampaignRecommendation, { RecommendationProps } from "@/components/dashboard/CampaignRecommendation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Additional campaign types beyond the original 3
const campaignTypes = [
  "Viral Marketing",
  "Public Relations",
  "Unconventional PR",
  "Search Engine Marketing",
  "Social & Display Ads",
  "Offline Ads",
  "Search Engine Optimization",
  "Content Marketing",
  "Email Marketing",
  "Engineering as Marketing",
  "Targeting Blogs",
  "Business Development",
  "Sales",
  "Affiliate Programs",
  "Existing Platforms",
  "Trade Shows",
  "Offline Events",
  "Speaking Engagements",
  "Community Building"
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationProps[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Get website URL from localStorage on component mount
  useEffect(() => {
    const storedUrl = localStorage.getItem('analyzedWebsiteUrl');
    if (storedUrl) {
      setWebsiteUrl(storedUrl);
      handleAnalyze(storedUrl);
    }
  }, []);

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setWebsiteUrl(url);
    
    // Store URL in localStorage
    localStorage.setItem('analyzedWebsiteUrl', url);
    
    // Store URL and dummy marketing profile data in Supabase if user is logged in
    if (user) {
      try {
        // Example marketing profile data (would be collected from user in a real app)
        const marketingProfile = {
          product_overview: "AI-powered ad campaign platform for small businesses",
          core_value_proposition: "Launch high-performing ad campaigns in seconds without marketing expertise",
          target_audience: ["Business", "Millennials", "Techies"],
          current_awareness: "MVP live",
          goal: ["Awareness", "Purchases/Users"],
          budget: "$1,000",
          strengths: "Proprietary AI algorithm, fast implementation",
          constraints: "Limited budget, small team",
          preferred_channels: ["Paid ads", "Content marketing", "SEO"],
          tone: "Professional yet approachable, innovative"
        };
        
        // Create a metadata object to store additional information
        const metadata = {
          website_url: url,
          marketing_profile: marketingProfile
        };
        
        // Update the user's profile in Supabase
        await supabase
          .from('profiles')
          .update({ 
            metadata: metadata
          })
          .eq('id', user.id);
          
        console.log("Stored website URL and marketing profile in Supabase");
      } catch (error) {
        console.error("Error storing data in Supabase:", error);
      }
    }
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Generate recommendations - in a real app, this would be based on the marketing profile
    // Generate 7 recommendations but only display top 3
    const allRecommendations = generateRecommendations(url);
    setRecommendations(allRecommendations.slice(0, 3)); // Only show top 3
    
    setIsAnalyzing(false);
    toast.success("Analysis complete! Here are your top recommendations.");
  };

  const generateRecommendations = (url: string): RecommendationProps[] => {
    // Choose random campaign types to create recommendations
    const shuffled = [...campaignTypes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 7); // Select 7 random types
    
    return selected.map((type, index) => {
      // Create a recommendation based on the campaign type
      const difficulty = ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard";
      const roi = (Math.floor(Math.random() * 70) / 10 + 2).toFixed(1) + "x";
      const budget = ["$100-300", "$300-700", "$500-1000", "$700-1500", "$1000-2500"][Math.floor(Math.random() * 5)];
      
      return {
        id: (index + 1).toString(),
        title: `${type} Campaign`,
        platform: ["Google Ads", "Instagram", "TikTok", "Facebook", "LinkedIn", "Twitter", "YouTube"][Math.floor(Math.random() * 7)],
        description: `Strategic ${type.toLowerCase()} campaign targeting your audience with optimized content and messaging.`,
        insights: [
          `${url} content aligns well with ${type.toLowerCase()} strategy`,
          `Similar businesses see ${Math.floor(Math.random() * 30) + 20}% higher engagement with this approach`,
          `This campaign type can reduce your CPA by ${Math.floor(Math.random() * 20) + 15}%`
        ],
        roi,
        difficulty,
        budget
      };
    });
  };

  const handleExportToEmail = () => {
    // Save recommendations to localStorage to access them in the export page
    localStorage.setItem('campaignRecommendations', JSON.stringify(recommendations));
    navigate('/export-campaign');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ad Campaign Dashboard</h1>
        <p className="text-muted-foreground">
          Launch high-performing ad campaigns with AI-powered recommendations
        </p>
      </div>

      {websiteUrl ? null : <UrlInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">Analyzing {websiteUrl}...</p>
          <p className="text-sm text-muted-foreground">This may take a moment</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                AI Recommended Campaigns for {websiteUrl}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <CampaignRecommendation key={recommendation.id} {...recommendation} />
              ))}
            </div>
            
            {/* Export to Email button */}
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
