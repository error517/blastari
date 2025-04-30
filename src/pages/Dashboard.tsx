
import React, { useState } from "react";
import UrlInput from "@/components/dashboard/UrlInput";
import CampaignRecommendation, { RecommendationProps } from "@/components/dashboard/CampaignRecommendation";
import { toast } from "sonner";

const Dashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationProps[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setWebsiteUrl(url);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Demo data - in a real app, this would come from an AI analysis
    const mockRecommendations: RecommendationProps[] = [
      {
        id: "1",
        title: "Product Showcase Campaign",
        platform: "Google Ads",
        description: "Search campaign targeting high-intent keywords related to your products with creative ad copy.",
        insights: [
          "Your website has strong product pages that would perform well in search results",
          "Competitors are bidding on similar keywords with 30% higher CPC",
          "Targeting long-tail keywords can reduce your CPA by 25%"
        ],
        roi: "5.2x",
        difficulty: "Medium",
        budget: "$500-1000"
      },
      {
        id: "2",
        title: "Social Media Awareness",
        platform: "Instagram",
        description: "Visual storytelling campaign highlighting your brand's unique value proposition to a younger audience.",
        insights: [
          "Your product imagery is high quality and would perform well on visual platforms",
          "Instagram demographics align with your target audience",
          "Competitors have 40% less presence on this platform"
        ],
        roi: "3.7x",
        difficulty: "Easy",
        budget: "$300-700"
      },
      {
        id: "3",
        title: "Short-Form Video Engagement",
        platform: "TikTok",
        description: "Creative short-form video campaign showcasing product use cases and testimonials.",
        insights: [
          "Your industry is trending on TikTok with high engagement rates",
          "Similar products are seeing 65% higher conversion from TikTok traffic",
          "Educational content about your product category performs well"
        ],
        roi: "4.8x",
        difficulty: "Hard",
        budget: "$700-1500"
      },
      {
        id: "4",
        title: "Remarketing Campaign",
        platform: "Facebook",
        description: "Target users who have visited your website but didn't convert with personalized messaging.",
        insights: [
          "Your website has a 68% bounce rate that could be improved with remarketing",
          "Similar businesses see 40% conversion rate from remarketing campaigns",
          "Dynamic product ads could showcase items users viewed"
        ],
        roi: "6.1x",
        difficulty: "Medium",
        budget: "$400-800"
      }
    ];
    
    setRecommendations(mockRecommendations);
    setIsAnalyzing(false);
    toast.success("Analysis complete! Here are your recommendations.");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ad Campaign Dashboard</h1>
        <p className="text-muted-foreground">
          Launch high-performing ad campaigns with AI-powered recommendations
        </p>
      </div>

      <UrlInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            AI Recommended Campaigns for {websiteUrl}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((recommendation) => (
              <CampaignRecommendation key={recommendation.id} {...recommendation} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
