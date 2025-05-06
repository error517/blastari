
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignLaunch from "./pages/CampaignLaunch";
import ContentStudio from "./pages/ContentStudio";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import ExportCampaign from "./pages/ExportCampaign";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/launch/:id" element={<CampaignLaunch />} />
          <Route path="/content" element={<ContentStudio />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/export-campaign" element={<ExportCampaign />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
