
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import CampaignCard from "@/components/dashboard/CampaignCard";
import { Textarea } from "@/components/ui/textarea";
import { analyzeWebsite } from "@/lib/websiteAnalyzer";

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
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<CampaignRecommendation[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecommendation | null>(null);
  const [prompt, setPrompt] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [isGptLoading, setIsGptLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we already have recommendations in localStorage
    const storedRecommendations = localStorage.getItem('campaignRecommendations');
    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    }
    
    // Get the stored website URL
    const storedUrl = localStorage.getItem('analyzedWebsiteUrl');
    if (storedUrl) {
      setWebsiteUrl(storedUrl);
    }
  }, []);

  const handleAnalyzeWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteUrl) {
      toast.error("Please enter a website URL");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const { analysis, recommendations } = await analyzeWebsite(websiteUrl);
      
      // Save to localStorage
      localStorage.setItem('analyzedWebsiteUrl', websiteUrl);
      localStorage.setItem('websiteAnalysis', JSON.stringify(analysis));
      localStorage.setItem('campaignRecommendations', JSON.stringify(recommendations));
      
      // Also save to Supabase
      try {
        const { error } = await supabase
          .from('website_analyses')
          .insert({
            url: websiteUrl,
            analysis_data: analysis,
            campaign_recommendations: recommendations
          });
          
        if (error) {
          console.error("Error saving to database:", error);
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
      
      setRecommendations(recommendations);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze website. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCampaignClick = (recommendation: CampaignRecommendation) => {
    setSelectedCampaign(recommendation);
    setPrompt(`Help me create a marketing campaign for "${recommendation.title}" on ${recommendation.platform}. Budget: ${recommendation.budget}.`);
  };

  const handleGptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    setIsGptLoading(true);
    setGptResponse('');
    
    // Simulate GPT response
    try {
      // In a real app, this would be an API call to OpenAI or similar
      setTimeout(() => {
        const sampleResponses = [
          `Here's your ${selectedCampaign?.title} campaign plan for ${selectedCampaign?.platform}:\n\n1. Start with a compelling headline that addresses your audience's pain points.\n2. Use visual content that aligns with your brand identity.\n3. Include a clear call-to-action button with urgency.\n4. Set up proper tracking mechanisms to measure ROI.\n5. Test different variations to optimize performance.\n\nExpected ROI based on similar campaigns: ${selectedCampaign?.roi}`,
          `For your ${selectedCampaign?.platform} campaign, I recommend:\n\n- Audience targeting: Focus on demographics that align with your product's value proposition.\n- Creative approach: Use storytelling to build emotional connection.\n- Budget allocation: Spend 60% on ad placement, 30% on creative, 10% on analytics.\n- Timeline: Run for 3 weeks with performance review at the halfway point.\n\nThis approach has worked well for similar campaigns targeting ${selectedCampaign?.difficulty} difficulty markets.`,
          `Based on the insights for ${selectedCampaign?.title}, here's my recommendation:\n\n1. Create a sequence of 3-5 content pieces that build on each other.\n2. Start with educational content, then move to product features, and end with testimonials.\n3. Invest in high-quality visuals - they typically increase engagement by 65%.\n4. For your budget range of ${selectedCampaign?.budget}, focus on quality over quantity.\n5. Set up retargeting to capture interested users who don't convert initially.`
        ];
        
        const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
        setGptResponse(randomResponse);
        setIsGptLoading(false);
      }, 2000);
    } catch (error) {
      console.error("GPT error:", error);
      toast.error("Failed to generate response");
      setIsGptLoading(false);
    }
  };

  const handleExportToEmail = () => {
    navigate('/export-campaign');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-bold">B</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">AdGPT</h1>
        <p className="text-muted-foreground max-w-md">
          Save time creating ads with AI-powered campaign recommendations.
        </p>
      </div>

      {recommendations.length > 0 ? (
        <div className="space-y-8">
          {/* Campaign Recommendations */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Campaign Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {recommendations.slice(0, 3).map((recommendation) => (
                <CampaignCard 
                  key={recommendation.id}
                  title={recommendation.title}
                  platform={recommendation.platform}
                  description={recommendation.description}
                  onClick={() => handleCampaignClick(recommendation)}
                />
              ))}
            </div>
          </div>

          {/* GPT UI */}
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-bold text-xl mb-4">AI Campaign Assistant</h3>
            
            {selectedCampaign ? (
              <div className="mb-4">
                <div className="bg-primary/10 p-4 rounded-md mb-4">
                  <h4 className="font-medium">{selectedCampaign.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedCampaign.platform}</p>
                  <p className="text-sm mt-2">{selectedCampaign.description}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground mb-4">
                Select a campaign above to get AI-powered recommendations
              </div>
            )}

            {/* GPT Response Area */}
            {gptResponse && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 whitespace-pre-wrap">
                {gptResponse}
              </div>
            )}

            {/* Prompt Input */}
            <form onSubmit={handleGptSubmit} className="flex flex-col gap-4">
              <Textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask for specific campaign ideas, target audience suggestions, or content examples..."
                className="min-h-[100px]"
                disabled={!selectedCampaign}
              />
              <div className="flex items-center justify-between">
                <Button 
                  type="submit" 
                  disabled={isGptLoading || !selectedCampaign}
                  className="gap-2"
                >
                  {isGptLoading ? 'Generating...' : 'Generate Campaign Ideas'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleExportToEmail}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Export to Email
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <Card className="w-full mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleAnalyzeWebsite} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="website-url" className="text-sm font-medium">
                    Enter your website URL
                  </label>
                  <Input
                    id="website-url"
                    placeholder="https://yourwebsite.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" disabled={isAnalyzing} size="sm" className="w-fit mt-2">
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Analyzing...
                    </span>
                  ) : (
                    "Get Campaign Recommendations"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
