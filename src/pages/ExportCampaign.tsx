
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Mail, 
  BarChart3, 
  Globe, 
  Lightbulb, 
  Rocket, 
  FileSpreadsheet, 
  PenTool,
  BarChart4,
  Share2
} from "lucide-react";

const ExportCampaign = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve stored recommendations and website URL
    const storedRecommendations = localStorage.getItem('campaignRecommendations');
    const storedUrl = localStorage.getItem('analyzedWebsiteUrl');
    
    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    }
    
    if (storedUrl) {
      setWebsiteUrl(storedUrl);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a production app, we would send this data to a serverless function
    // that would format and send an email with the campaign details
    console.log("Sending campaign details to:", email);
    console.log("Website:", websiteUrl);
    console.log("Recommendations:", recommendations);
    
    setIsSubmitting(false);
    toast.success("Campaign details sent to your email!");
    setEmail("");
  };

  // Define feature cards for the 3x3 grid
  const featureCards = [
    {
      title: "Website Analysis",
      description: "AI-powered analysis of your website content and structure",
      icon: <Globe className="h-10 w-10 text-primary/80" />,
      isActive: true,
    },
    {
      title: "AI Recommendations",
      description: "Custom campaign strategies based on your business",
      icon: <Lightbulb className="h-10 w-10 text-primary/80" />,
      isActive: true,
    },
    {
      title: "Campaign Launch",
      description: "One-click campaign launch across platforms",
      icon: <Rocket className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Analytics Dashboard",
      description: "Real-time performance tracking",
      icon: <BarChart3 className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Content Creation",
      description: "AI-generated ad creative and messaging",
      icon: <PenTool className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Audience Targeting",
      description: "Precision audience segmentation",
      icon: <BarChart4 className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Budget Optimization",
      description: "Smart budget allocation across channels",
      icon: <FileSpreadsheet className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Multi-Channel Campaigns",
      description: "Unified campaigns across all platforms",
      icon: <Share2 className="h-10 w-10 text-gray-400" />,
      isActive: false,
    },
    {
      title: "Campaign Templates",
      description: "Ready-to-use campaign templates",
      icon: <FileSpreadsheet className="h-10 w-10 text-gray-400" />,
      isActive: false,
    }
  ];

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Export Your Campaign</h1>
      
      {/* Active Features - Website Analysis and AI Recommendations */}
      {recommendations.length > 0 && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Website Analysis
              </CardTitle>
              <CardDescription>
                We've analyzed {websiteUrl || "your website"} and generated tailored campaign recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI has examined your website's structure, content, and target audience to create
                custom campaign recommendations designed to maximize your marketing ROI.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Your custom campaign strategies based on your business and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We've generated {recommendations.length} targeted campaign recommendations 
                tailored specifically for your business.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{rec.title}</span>: {rec.description}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Feature Grid - 3x3 layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {featureCards.map((feature, index) => (
          <Card 
            key={index} 
            className={`transition-all ${
              feature.isActive ? "bg-white" : "bg-muted/50"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                {feature.icon}
                {!feature.isActive && (
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    Coming Soon
                  </span>
                )}
              </div>
              <CardTitle className="mt-2">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      {/* Email subscription form */}
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Get Your Campaign Details
          </CardTitle>
          <CardDescription>
            Enter your email to receive a detailed report of your campaign recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send to Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportCampaign;
