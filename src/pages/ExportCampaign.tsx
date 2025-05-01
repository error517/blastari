
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, Mail, Rocket, Zap } from "lucide-react";
import { toast } from "sonner";
import { RecommendationProps } from "@/components/dashboard/CampaignRecommendation";

const ExportCampaign = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationProps[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Get recommendations and website from localStorage
    const storedRecommendations = localStorage.getItem('campaignRecommendations');
    const storedUrl = localStorage.getItem('analyzedWebsiteUrl');
    
    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    } else {
      navigate('/dashboard');
    }
    
    if (storedUrl) {
      setWebsiteUrl(storedUrl);
    }
  }, [navigate]);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      toast.success("Campaign recommendations sent to your email!");
    }, 2000);
  };

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Button>

      <div className="grid gap-10 grid-cols-1">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Campaign Recommendations</h1>
          <p className="text-muted-foreground">
            Enter your email to receive detailed recommendations for {websiteUrl}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">AI Analysis Results</CardTitle>
                <CardDescription>
                  We've analyzed your website and created these recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <FeatureItem 
                    icon={<Rocket className="h-5 w-5" />}
                    title="Website Analysis"
                    description="A complete analysis of your website content, design, and audience"
                    available={true}
                  />
                  <FeatureItem 
                    icon={<Zap className="h-5 w-5" />}
                    title="AI Recommendations"
                    description="Personalized campaign strategies based on your website"
                    available={true}
                  />
                  <FeatureItem 
                    icon={<Check className="h-5 w-5" />}
                    title="One-Click Launch"
                    description="Launch campaigns across multiple platforms with a single click"
                    available={false}
                  />
                  <FeatureItem 
                    icon={<Check className="h-5 w-5" />}
                    title="Performance Tracking"
                    description="Real-time dashboard to monitor campaign performance"
                    available={false}
                  />
                  <FeatureItem 
                    icon={<Check className="h-5 w-5" />}
                    title="Smart Optimization"
                    description="AI-powered campaign optimization to maximize ROI"
                    available={false}
                  />
                </div>
              </CardContent>
            </Card>

            {recommendations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Summary of Recommendations:</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {recommendations.map((rec, index) => (
                    <li key={index}>
                      <span className="font-medium">{rec.title}</span>
                      <span className="text-sm text-muted-foreground"> ({rec.platform})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            {!isSuccess ? (
              <Card>
                <CardHeader>
                  <CardTitle>Get Your Recommendations</CardTitle>
                  <CardDescription>
                    We'll send a detailed report with actionable insights to your email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendEmail} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="you@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSending}
                    >
                      {isSending ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send to My Email
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Check className="h-5 w-5" />
                    Success!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">We've sent the campaign recommendations to <strong>{email}</strong></p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Please check your inbox (and spam folder if needed) for the detailed report.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    className="w-full"
                  >
                    Return to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for feature items
const FeatureItem = ({ 
  icon, 
  title, 
  description, 
  available 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  available: boolean 
}) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 rounded-md ${available ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
      {icon}
    </div>
    <div>
      <h3 className="font-medium">
        {title}
        {!available && <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">Coming Soon</span>}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default ExportCampaign;
