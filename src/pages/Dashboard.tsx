import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { WebsiteAnalyzer } from "@/components/WebsiteAnalyzer";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const websiteUrl = localStorage.getItem('analyzedWebsiteUrl') || '';

  const handleExportToEmail = () => {
    navigate('/export-campaign');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Blastari Campaign Dashboard</h1>
        <p className="text-muted-foreground">
          Launch high-performing ad campaigns with AI-powered recommendations
        </p>
      </div>

      {websiteUrl ? (
        <>
          <WebsiteAnalyzer url={websiteUrl} />
          
          <div className="flex justify-center">
            <Button 
              onClick={handleExportToEmail} 
              size="lg"
              className="gap-2"
            >
              <Mail className="h-5 w-5" />
              Export to Email
            </Button>
          </div>
        </>
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
