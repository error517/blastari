import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Rocket, Zap, Link as LinkIcon, FileText, ArrowRight, Check, LogIn } from "lucide-react";

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
        navigate(`/dashboard?analyzed=true&url=${encodeURIComponent(url)}`);
        
        // Reset state
        setIsAnalyzing(false);
      }, 1500);
    } catch (error) {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  // Animation classes to be applied after component mount
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mount
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="container max-w-5xl px-4 mx-auto">
          <div className="flex justify-end mb-4">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </div>
          
          <div className="text-center">
            <div className={`space-y-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-block bg-purple-100 px-4 py-1 rounded-full mb-4">
                <p className="text-purple-800 text-sm font-medium">AI-Powered Advertising</p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mx-auto max-w-3xl">
                Launch <span className="text-primary">high-performing</span> ad campaigns in seconds
              </h1>
              <p className="text-xl text-gray-600 mx-auto max-w-2xl">
                Blastari uses AI to analyze your website and create optimized ad campaigns tailored to your business needs.
              </p>
              
              <div className="pt-6 max-w-xl mx-auto">
                <Card className="border-2 border-purple-100 shadow-lg animate-[fade-in_0.7s_ease-out]">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                      <div className="flex items-center flex-1 gap-2 bg-white border rounded-md px-3">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                        <Input 
                          value={url} 
                          onChange={(e) => setUrl(e.target.value)} 
                          placeholder="Enter your website URL"
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="min-w-[180px] relative overflow-hidden group"
                        size="lg"
                        disabled={isAnalyzing}
                      >
                        <span className="absolute right-full w-12 h-32 -mt-12 bg-white opacity-10 transform rotate-12 group-hover:translate-x-96 transition-transform duration-1000 ease-out"></span>
                        {isAnalyzing ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Get Campaign Recommendations
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container max-w-5xl px-4 mx-auto text-center">
          <div className={`text-center mb-16 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold mb-4">How Blastari Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform automates the ad campaign creation process, saving you time and maximizing your ROI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <LinkIcon />,
                title: "Website Analysis",
                description: "Enter your website URL and our AI will analyze your content, products, and audience to create targeted campaigns."
              },
              {
                icon: <Zap />,
                title: "AI Recommendations",
                description: "Get AI-generated campaign recommendations tailored to your business with platform suggestions and budget optimizations."
              },
              {
                icon: <Rocket />,
                title: "One-Click Launch",
                description: "Launch your campaigns across multiple platforms with a single click and start driving traffic immediately."
              },
              {
                icon: <FileText />,
                title: "Performance Tracking",
                description: "Track key metrics like impressions, clicks, and conversions with real-time dashboards and analytics."
              },
              {
                icon: <Zap />,
                title: "Smart Optimization",
                description: "Our AI continuously optimizes your campaigns based on performance data to maximize ROI."
              },
              {
                icon: <Rocket />,
                title: "Multi-Platform Support",
                description: "Launch campaigns across Google, Facebook, Instagram, TikTok, and other major advertising platforms."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials/Social Proof */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container max-w-5xl px-4 mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold mb-4">Trusted by Marketers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Blastari has helped businesses increase their advertising ROI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Blastari cut our campaign setup time by 90% and increased our ROAS by 35%. Game changer!",
                author: "Sarah Johnson",
                company: "E-commerce Director, FashionRetail"
              },
              {
                quote: "The AI recommendations were spot on for our audience. We've seen a 42% increase in conversions since switching.",
                author: "Michael Chen",
                company: "Marketing Manager, TechSolutions"
              },
              {
                quote: "Being able to launch across multiple platforms with one click saved us countless hours. The analytics are incredibly insightful.",
                author: "Amanda Rodriguez",
                company: "Digital Strategist, GrowthAgency"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <TestimonialCard 
                  quote={testimonial.quote}
                  author={testimonial.author}
                  company={testimonial.company}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20">
        <div className="container max-w-5xl px-4 mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your business needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$49",
                period: "per month",
                description: "Perfect for small businesses just getting started with digital advertising",
                features: [
                  "5 active campaigns",
                  "Basic analytics dashboard",
                  "Weekly performance reports",
                  "Email support",
                  "Single-platform publishing"
                ],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Professional",
                price: "$99",
                period: "per month",
                description: "Ideal for growing businesses with established marketing needs",
                features: [
                  "15 active campaigns",
                  "Advanced analytics dashboard",
                  "Daily performance reports",
                  "Priority email & chat support",
                  "Multi-platform publishing",
                  "Custom audience targeting"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "$249",
                period: "per month",
                description: "For established businesses with complex advertising needs",
                features: [
                  "Unlimited active campaigns",
                  "Custom analytics dashboard",
                  "Real-time performance data",
                  "Dedicated account manager",
                  "Multi-platform publishing",
                  "Advanced audience targeting",
                  "Custom integrations"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <PricingCard 
                  name={plan.name}
                  price={plan.price}
                  period={plan.period}
                  description={plan.description}
                  features={plan.features}
                  cta={plan.cta}
                  popular={plan.popular}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container max-w-5xl px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your ad campaigns?</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Get started today with AI-powered campaign recommendations tailored to your business
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <div className="flex items-center flex-1 gap-2 bg-white rounded-md px-3">
              <LinkIcon className="h-5 w-5 text-gray-400" />
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
              className="min-w-[180px] bg-white text-primary hover:bg-white/90 relative overflow-hidden group"
              size="lg"
              disabled={isAnalyzing}
            >
              <span className="absolute right-full w-12 h-32 -mt-12 bg-primary opacity-10 transform rotate-12 group-hover:translate-x-96 transition-transform duration-1000 ease-out"></span>
              {isAnalyzing ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          
          <p className="text-white/70 mt-4 text-sm">No credit card required. Free 14-day trial.</p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container max-w-5xl px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold">Blastari</h2>
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
              © {new Date().getFullYear()} Blastari. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper components
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:transform hover:-translate-y-2">
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
  <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
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

const PricingCard = ({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  cta, 
  popular 
}: { 
  name: string, 
  price: string, 
  period: string, 
  description: string, 
  features: string[], 
  cta: string,
  popular: boolean 
}) => (
  <Card className={`border-2 ${popular ? 'border-primary' : 'border-gray-200'} shadow-lg h-full flex flex-col transition-all duration-300 hover:shadow-xl`}>
    <CardContent className="p-6 flex flex-col h-full">
      {popular && (
        <div className="bg-primary text-white text-sm font-bold py-1 px-3 rounded-full mb-4 w-fit mx-auto">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold text-center">{name}</h3>
      <div className="mt-4 mb-4 text-center">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-500"> {period}</span>
      </div>
      <p className="text-gray-600 text-center mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className={`w-full ${popular ? '' : 'bg-white text-primary border border-primary hover:bg-gray-50'}`}
        variant={popular ? "default" : "outline"}
      >
        {cta}
      </Button>
    </CardContent>
  </Card>
);

export default Index;
