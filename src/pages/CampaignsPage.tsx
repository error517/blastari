
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, Play, PauseCircle, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CampaignsPage = () => {
  const navigate = useNavigate();
  
  // Sample campaign data
  const activeCampaigns = [
    {
      id: "c1",
      name: "Summer Product Launch",
      platform: "Google Ads",
      status: "Active",
      budget: "$1,200",
      spent: "$450",
      impressions: "24.5K",
      clicks: "1.2K",
      ctr: "4.9%"
    },
    {
      id: "c2",
      name: "Instagram Brand Awareness",
      platform: "Instagram",
      status: "Active",
      budget: "$800",
      spent: "$320",
      impressions: "18.3K",
      clicks: "950",
      ctr: "5.2%"
    }
  ];
  
  const draftCampaigns = [
    {
      id: "d1",
      name: "Holiday Special",
      platform: "Facebook",
      lastEdited: "2 days ago",
      completion: "85%"
    },
    {
      id: "d2",
      name: "Product Remarketing",
      platform: "Google",
      lastEdited: "5 days ago",
      completion: "60%"
    },
    {
      id: "d3",
      name: "TikTok Promo",
      platform: "TikTok",
      lastEdited: "1 day ago",
      completion: "40%"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and monitor your ad campaigns across platforms
          </p>
        </div>
        <Button onClick={() => navigate("/")}>
          New Campaign <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Active Campaigns
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <PauseCircle className="h-4 w-4" />
            Drafts
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Completed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activeCampaigns.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Play className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No active campaigns</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any active campaigns. Create one to start advertising.
                </p>
                <Button className="mt-4" onClick={() => navigate("/")}>
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {activeCampaigns.map(campaign => (
                <Card key={campaign.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{campaign.name}</CardTitle>
                        <CardDescription>{campaign.platform}</CardDescription>
                      </div>
                      <Badge variant={campaign.status === "Active" ? "default" : "outline"}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="text-lg font-medium">{campaign.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Spent</p>
                        <p className="text-lg font-medium">{campaign.spent}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Impressions</p>
                        <p className="text-lg font-medium">{campaign.impressions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">CTR</p>
                        <p className="text-lg font-medium">{campaign.ctr}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">
                      Pause
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">
                        View Details <ExternalLink className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftCampaigns.map(draft => (
              <Card key={draft.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{draft.name}</CardTitle>
                  <CardDescription>{draft.platform}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Last edited</p>
                      <p>{draft.lastEdited}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completion</p>
                      <p>{draft.completion}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Continue Editing</Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add New Draft Card */}
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Create New Draft</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Start building a new campaign
                </p>
                <Button variant="ghost" className="mt-4" onClick={() => navigate("/")}>
                  Start New
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="py-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <BarChart3 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No completed campaigns yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Completed campaigns will appear here with their performance data.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignsPage;
