
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail } from "lucide-react";

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

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Export Your Campaign</h1>
      
      {/* Website Analysis - this is shown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Website Analysis</CardTitle>
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
      
      {/* AI Recommendations - this is shown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
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
      
      {/* Campaign Launch - this is "coming soon" */}
      <Card className="mb-8 bg-muted/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Campaign Launch</CardTitle>
            <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
              Coming Soon
            </span>
          </div>
          <CardDescription>
            One-click campaign launch across multiple platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Launch your campaigns across Google, Meta, TikTok and more with a single click.
            Our platform will handle the technical setup, audience targeting, and creative optimization.
          </p>
        </CardContent>
      </Card>
      
      {/* Analytics Dashboard - this is "coming soon" */}
      <Card className="mb-8 bg-muted/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Analytics Dashboard</CardTitle>
            <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
              Coming Soon
            </span>
          </div>
          <CardDescription>
            Real-time performance tracking and optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Track all your campaign metrics in one unified dashboard with real-time data.
            Our AI will continuously optimize your campaigns to improve performance.
          </p>
        </CardContent>
      </Card>
      
      {/* Content Creation - this is "coming soon" */}
      <Card className="mb-8 bg-muted/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Content Creation</CardTitle>
            <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
              Coming Soon
            </span>
          </div>
          <CardDescription>
            AI-generated ad creative and messaging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Generate professional ad creatives, copy, and messaging tailored to your brand.
            Our AI will create variants to test and optimize for the best performing content.
          </p>
        </CardContent>
      </Card>
      
      {/* Email subscription form */}
      <Card>
        <CardHeader>
          <CardTitle>Get Your Campaign Details</CardTitle>
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
