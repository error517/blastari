
import React, { useState } from "react";
import UrlInput from "@/components/dashboard/UrlInput";
import CampaignRecommendation, { RecommendationProps } from "@/components/dashboard/CampaignRecommendation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ArrowRight, ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";

// Sample data for the analytics charts
const performanceData = [
  { name: "Apr 24", impressions: 1200, clicks: 120, conversions: 12, ctr: 10 },
  { name: "Apr 25", impressions: 1300, clicks: 130, conversions: 13, ctr: 10 },
  { name: "Apr 26", impressions: 1400, clicks: 140, conversions: 14, ctr: 10 },
  { name: "Apr 27", impressions: 1800, clicks: 180, conversions: 18, ctr: 10 },
  { name: "Apr 28", impressions: 2000, clicks: 200, conversions: 20, ctr: 10 },
  { name: "Apr 29", impressions: 2400, clicks: 240, conversions: 24, ctr: 10 },
  { name: "Apr 30", impressions: 2300, clicks: 230, conversions: 23, ctr: 10 },
];

const sourcesData = [
  { name: "Google Ads", value: 4000, color: "#8884d8" },
  { name: "Facebook", value: 3000, color: "#82ca9d" },
  { name: "Instagram", value: 2000, color: "#ffc658" },
  { name: "TikTok", value: 2780, color: "#ff8042" },
];

const deviceData = [
  { name: "Mobile", value: 6500, color: "#0088FE" },
  { name: "Desktop", value: 3500, color: "#00C49F" },
  { name: "Tablet", value: 1000, color: "#FFBB28" },
];

// New data for enhanced analytics
const conversionFunnelData = [
  { name: "Impressions", value: 245700 },
  { name: "Clicks", value: 12800 },
  { name: "Page Views", value: 9600 },
  { name: "Add to Cart", value: 4200 },
  { name: "Purchases", value: 1240 },
];

const audienceData = [
  { name: "18-24", male: 820, female: 930, other: 150 },
  { name: "25-34", male: 1450, female: 1600, other: 270 },
  { name: "35-44", male: 1200, female: 1100, other: 210 },
  { name: "45-54", male: 950, female: 850, other: 140 },
  { name: "55-64", male: 650, female: 720, other: 110 },
  { name: "65+", male: 420, female: 380, other: 70 },
];

const Dashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationProps[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [timeframe, setTimeframe] = useState("7days");

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
    ];
    
    setRecommendations(mockRecommendations);
    setIsAnalyzing(false);
    toast.success("Analysis complete! Here are your recommendations.");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ad Campaign Dashboard</h1>
        <p className="text-muted-foreground">
          Launch high-performing ad campaigns with AI-powered recommendations
        </p>
      </div>

      <UrlInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

      {recommendations.length > 0 && (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                AI Recommended Campaigns for {websiteUrl}
              </h2>
              <button className="text-sm text-primary font-medium flex items-center hover:underline">
                View all recommendations <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <CampaignRecommendation key={recommendation.id} {...recommendation} />
              ))}
            </div>
          </div>

          {/* Analytics Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Campaign Analytics</h2>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Impressions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245.7K</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className="text-green-500 flex items-center mr-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12.5%
                    </span>
                    from previous period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.8K</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className="text-green-500 flex items-center mr-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      8.2%
                    </span>
                    from previous period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average CTR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5.2%</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className="text-red-500 flex items-center mr-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      1.3%
                    </span>
                    from previous period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,240</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className="text-green-500 flex items-center mr-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      4.6%
                    </span>
                    from previous period
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="performance" className="w-full">
              <TabsList>
                <TabsTrigger value="performance">Performance Trends</TabsTrigger>
                <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
                <TabsTrigger value="devices">Device Breakdown</TabsTrigger>
                <TabsTrigger value="conversions">Conversion Funnel</TabsTrigger>
                <TabsTrigger value="demographics">Audience Demographics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                      Track impressions, clicks, and conversions over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={performanceData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="impressions"
                            stroke="#8884d8"
                            name="Impressions"
                          />
                          <Line
                            type="monotone"
                            dataKey="clicks"
                            stroke="#82ca9d"
                            name="Clicks"
                          />
                          <Line
                            type="monotone"
                            dataKey="conversions"
                            stroke="#ffc658"
                            name="Conversions"
                          />
                          <Line
                            type="monotone"
                            dataKey="ctr"
                            stroke="#ff8042"
                            name="CTR (%)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sources">
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>
                      Distribution of traffic across different platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sourcesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {sourcesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="devices">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Breakdown</CardTitle>
                    <CardDescription>
                      Distribution of traffic across different devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {deviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conversions">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>
                      Visualize how users convert through the purchase journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={conversionFunnelData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip formatter={(value) => new Intl.NumberFormat().format(value as number)} />
                          <Legend />
                          <Bar dataKey="value" name="Users" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="demographics">
                <Card>
                  <CardHeader>
                    <CardTitle>Audience Demographics</CardTitle>
                    <CardDescription>
                      Age and gender distribution of your audience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={audienceData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="male" name="Male" stackId="a" fill="#8884d8" />
                          <Bar dataKey="female" name="Female" stackId="a" fill="#82ca9d" />
                          <Bar dataKey="other" name="Other" stackId="a" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
