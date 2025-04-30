
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Rocket, Zap, Link, FileText, ArrowRight } from "lucide-react";

const Index = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Please enter a website URL");
      return;
    }
    
    // Simple URL validation
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol.startsWith("http")) {
        throw new Error("Invalid URL");
      }
      
      // Show analyzing state
      setIsAnalyzing(true);
      
      // Simulate analysis (in a real app, this would be an API call)
      setTimeout(() => {
        // Navigate to dashboard with the URL as a query parameter
        navigate(`/?analyzed=true&url=${encodeURIComponent(url)}`);
        
        // Reset state
        setIsAnalyzing(false);
      }, 1500);
    } catch (error) {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <div className="inline-block bg-purple-100 px-4 py-1 rounded-full mb-4">
                <p className="text-purple-800 text-sm font-medium">AI-Powered Advertising</p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Launch <span className="text-primary">high-performing</span> ad campaigns in seconds
              </h1>
              <p className="text-xl text-gray-600">
                AdLaunchGenie uses AI to analyze your website and create optimized ad campaigns tailored to your business needs.
              </p>
              
              <div className="pt-6">
                <Card className="border-2 border-purple-100 shadow-lg">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                      <div className="flex items-center flex-1 gap-2 bg-white border rounded-md px-3">
                        <Link className="h-5 w-5 text-gray-400" />
                        <Input 
                          value={url} 
                          onChange={(e) => setUrl(e.target.value)} 
                          placeholder="Enter your website URL"
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="min-w-[180px]"
                        size="lg"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Get Campaign Recommendations
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&h=1000&q=80" 
                alt="Dashboard preview" 
                className="rounded-lg shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How AdLaunchGenie Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform automates the ad campaign creation process, saving you time and maximizing your ROI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Link />}
              title="Website Analysis"
              description="Enter your website URL and our AI will analyze your content, products, and audience to create targeted campaigns."
            />
            <FeatureCard 
              icon={<Zap />}
              title="AI Recommendations"
              description="Get AI-generated campaign recommendations tailored to your business with platform suggestions and budget optimizations."
            />
            <FeatureCard 
              icon={<Rocket />}
              title="One-Click Launch"
              description="Launch your campaigns across multiple platforms with a single click and start driving traffic immediately."
            />
            <FeatureCard 
              icon={<FileText />}
              title="Performance Tracking"
              description="Track key metrics like impressions, clicks, and conversions with real-time dashboards and analytics."
            />
            <FeatureCard 
              icon={<Zap />}
              title="Smart Optimization"
              description="Our AI continuously optimizes your campaigns based on performance data to maximize ROI."
            />
            <FeatureCard 
              icon={<Rocket />}
              title="Multi-Platform Support"
              description="Launch campaigns across Google, Facebook, Instagram, TikTok, and other major advertising platforms."
            />
          </div>
        </div>
      </section>
      
      {/* Dashboard Preview Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="rounded-lg overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&h=1000&q=80" 
                  alt="Dashboard analytics" 
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Powerful Campaign Dashboard</h2>
              <p className="text-xl text-gray-600">
                Get a comprehensive view of all your campaigns with our intuitive dashboard. Monitor performance, track ROI, and make data-driven decisions.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Real-time performance metrics",
                  "Audience demographics analysis",
                  "Campaign comparison tools",
                  "Conversion tracking",
                  "Custom reporting and exports"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-primary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button size="lg" className="mt-4">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials/Social Proof */}
      <section className="py-20">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Marketers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how AdLaunchGenie has helped businesses increase their advertising ROI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="AdLaunchGenie cut our campaign setup time by 90% and increased our ROAS by 35%. Game changer!"
              author="Sarah Johnson"
              company="E-commerce Director, FashionRetail"
            />
            <TestimonialCard 
              quote="The AI recommendations were spot on for our audience. We've seen a 42% increase in conversions since switching."
              author="Michael Chen"
              company="Marketing Manager, TechSolutions"
            />
            <TestimonialCard 
              quote="Being able to launch across multiple platforms with one click saved us countless hours. The analytics are incredibly insightful."
              author="Amanda Rodriguez"
              company="Digital Strategist, GrowthAgency"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container max-w-6xl px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your ad campaigns?</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Get started today with AI-powered campaign recommendations tailored to your business
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <div className="flex items-center flex-1 gap-2 bg-white rounded-md px-3">
              <Link className="h-5 w-5 text-gray-400" />
              <Input 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="Enter your website URL"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
            </div>
            <Button 
              type="submit" 
              variant="secondary"
              className="min-w-[180px] bg-white text-primary hover:bg-white/90"
              size="lg"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
          
          <p className="text-white/70 mt-4 text-sm">No credit card required. Free 14-day trial.</p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">AdLaunchGenie</h2>
              <p className="text-gray-400">AI-powered ad campaign platform</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary">Features</a>
              <a href="#" className="hover:text-primary">Pricing</a>
              <a href="#" className="hover:text-primary">Documentation</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} AdLaunchGenie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper components
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="border-none shadow-lg hover:shadow-xl transition-all">
    <CardContent className="p-6 space-y-4">
      <div className="bg-primary/10 inline-flex p-3 rounded-lg text-primary">
        {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" })}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ quote, author, company }: { quote: string, author: string, company: string }) => (
  <Card className="border-none shadow-lg">
    <CardContent className="p-6">
      <div className="text-amber-500 flex mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-700 mb-6 italic">"{quote}"</p>
      <div>
        <p className="font-bold">{author}</p>
        <p className="text-gray-500 text-sm">{company}</p>
      </div>
    </CardContent>
  </Card>
);

export default Index;
