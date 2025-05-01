import { useState, useEffect } from 'react';
import { analyzeWebsite, generateAllCampaigns } from '@/lib/websiteAnalyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, DollarSign, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface WebsiteAnalyzerProps {
  url: string;
}

const getDifficultyColor = (difficulty: "Easy" | "Medium" | "Hard") => {
  switch (difficulty) {
    case "Easy":
      return "border-green-500 bg-green-50";
    case "Medium":
      return "border-yellow-500 bg-yellow-50";
    case "Hard":
      return "border-red-500 bg-red-50";
    default:
      return "";
  }
};

const getRoiColor = (roi: string) => {
  const roiValue = parseFloat(roi);
  if (roiValue >= 5) return "text-green-600";
  if (roiValue >= 3) return "text-yellow-600";
  return "text-red-600";
};

const getBudgetColor = (budget: string) => {
  const budgetValue = parseInt(budget.replace(/[^0-9]/g, ''));
  if (budgetValue <= 500) return "text-green-600";
  if (budgetValue <= 1500) return "text-yellow-600";
  return "text-red-600";
};

const BUDGET_RANGES = [
  { min: 0, max: 1000, label: "Startup ($0-1k)" },
  { min: 1000, max: 5000, label: "Growth ($1k-5k)" },
  { min: 5000, max: 20000, label: "Scale ($5k-20k)" },
  { min: 20000, max: 50000, label: "Enterprise ($20k-50k)" },
];

const formatBudget = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function WebsiteAnalyzer({ url }: WebsiteAnalyzerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<CampaignRecommendation[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(5000); // Default to $5k
  const [tempBudget, setTempBudget] = useState(5000); // For slider value

  useEffect(() => {
    if (url) {
      handleAnalyze();
    }
  }, [url]);

  const handleAnalyze = async () => {
    if (!url) return;

    setIsLoading(true);
    setAnalysis(null);
    setRecommendations([]);
    setShowAll(false);
    setTempBudget(selectedBudget);

    try {
      const { analysis: newAnalysis, recommendations: initialRecommendations } = await analyzeWebsite(url);
      setAnalysis(newAnalysis);
      setRecommendations(initialRecommendations);
      toast.success('Analysis complete');
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze website');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetChange = (value: number[]) => {
    setTempBudget(value[0]);
  };

  const handleBudgetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ''));
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, 0), 50000);
      setTempBudget(clampedValue);
    }
  };

  const handleUpdateCampaigns = async () => {
    if (!analysis) return;
    
    setSelectedBudget(tempBudget);
    setIsLoading(true);
    try {
      const allRecommendations = await generateAllCampaigns(analysis, tempBudget);
      setRecommendations(allRecommendations);
      setShowAll(true);
      toast.success('Campaigns updated for new budget');
    } catch (error) {
      console.error('Error generating campaigns:', error);
      toast.error('Failed to update campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAll = async () => {
    if (!analysis) return;

    setIsLoading(true);
    try {
      const allRecommendations = await generateAllCampaigns(analysis, selectedBudget);
      setRecommendations(allRecommendations);
      setShowAll(true);
    } catch (error) {
      console.error('Error generating all campaigns:', error);
      toast.error('Failed to generate all campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowLess = () => {
    setShowAll(false);
    setRecommendations(recommendations.slice(0, 3));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg">Analyzing {url}...</p>
        <p className="text-sm text-muted-foreground">This may take a moment</p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Product Overview</h3>
            <p className="text-muted-foreground">{analysis.productOverview}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Core Value Proposition</h3>
            <p className="text-muted-foreground">{analysis.coreValueProposition}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Target Audience</h3>
            <p className="text-muted-foreground">
              Type: {analysis.targetAudience.type}
            </p>
            <p className="text-muted-foreground">
              Segments: {analysis.targetAudience.segments.join(', ')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Current Stage</h3>
            <p className="text-muted-foreground">{analysis.currentAwareness}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Goals</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {analysis.goal.map((goal, index) => (
                <li key={`goal-${index}`}>{goal}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Suggested Budget</h3>
            <p className="text-muted-foreground">{analysis.budget}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Strengths</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {analysis.strengths.map((strength, index) => (
                <li key={`strength-${index}`}>{strength}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Constraints</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {analysis.constraints.map((constraint, index) => (
                <li key={`constraint-${index}`}>{constraint}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Preferred Channels</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {analysis.preferredChannels.map((channel, index) => (
                <li key={`channel-${index}`}>{channel}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tone and Personality</h3>
            <p className="text-muted-foreground">{analysis.toneAndPersonality}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Campaign Recommendations</CardTitle>
            <Button
              variant="ghost"
              onClick={showAll ? handleShowLess : handleShowAll}
              disabled={isLoading}
              className="gap-2"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show All Campaigns <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Adjust Budget</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={formatBudget(tempBudget)}
                    onChange={handleBudgetInputChange}
                    className="w-32 text-right"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUpdateCampaigns}
                  disabled={isLoading || tempBudget === selectedBudget}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Update Campaigns
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Slider
                value={[tempBudget]}
                onValueChange={handleBudgetChange}
                min={0}
                max={50000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                {BUDGET_RANGES.map((range) => (
                  <span key={range.label}>{range.label}</span>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((recommendation) => (
              <Card 
                key={recommendation.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-lg",
                  getDifficultyColor(recommendation.difficulty)
                )}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{recommendation.platform}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{recommendation.description}</p>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Insights</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {recommendation.insights.map((insight, index) => (
                        <li key={`insight-${index}`}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="font-semibold">ROI</p>
                      <p className={cn("font-medium", getRoiColor(recommendation.roi))}>
                        {recommendation.roi}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Difficulty</p>
                      <p className={cn(
                        "font-medium",
                        recommendation.difficulty === "Easy" && "text-green-600",
                        recommendation.difficulty === "Medium" && "text-yellow-600",
                        recommendation.difficulty === "Hard" && "text-red-600"
                      )}>
                        {recommendation.difficulty}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Budget</p>
                      <p className={cn("font-medium", getBudgetColor(recommendation.budget))}>
                        {recommendation.budget}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 