import { supabase } from './supabaseClient';

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

const campaignTypes = [
  "Viral Marketing",
  "Public Relations",
  "Unconventional PR",
  "Search Engine Marketing",
  "Social & Display Ads",
  "Offline Ads",
  "Search Engine Optimization",
  "Content Marketing",
  "Email Marketing",
  "Engineering as Marketing",
  "Targeting Blogs",
  "Business Development",
  "Sales",
  "Affiliate Programs",
  "Existing Platforms",
  "Trade Shows",
  "Offline Events",
  "Speaking Engagements",
  "Community Building"
];

export async function analyzeWebsite(url: string): Promise<{ analysis: WebsiteAnalysis; recommendations: CampaignRecommendation[] }> {
  console.log('Starting website fetch for:', url);

  try {
    // Fetch website content using a CORS proxy
    console.log('Fetching website content...');
    const corsProxy = 'https://api.codetabs.com/v1/proxy?quest=';
    const response = await fetch(`${corsProxy}${url}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Successfully fetched website content');

    // Extract and clean text content
    console.log('Cleaning content...');
    let content = html
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove style tags and their content
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove all HTML tags
      .replace(/<[^>]*>/g, ' ')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove common UI elements
      .replace(/(menu|navigation|header|footer|sidebar|button|link|search|login|sign up|sign in|register|subscribe|newsletter|cookie|privacy|terms|copyright|all rights reserved)/gi, '')
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, '')
      // Remove email addresses
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, '')
      // Remove special characters
      .replace(/[^\w\s.,!?-]/g, ' ')
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      // Remove multiple periods
      .replace(/\.+/g, '.')
      // Remove multiple commas
      .replace(/,+/g, ',')
      // Remove multiple dashes
      .replace(/-+/g, '-')
      // Remove multiple question marks
      .replace(/\?+/g, '?')
      // Remove multiple exclamation marks
      .replace(/!+/g, '!')
      // Trim whitespace
      .trim();

    // Remove short lines (likely UI elements or navigation)
    content = content
      .split('\n')
      .filter(line => line.trim().length > 20)
      .join('\n');

    // Remove duplicate lines
    content = [...new Set(content.split('\n'))].join('\n');

    // Limit content to 1000 characters
    content = content.slice(0, 1000);
    console.log('Content cleaned and limited, length:', content.length);

    if (content.length < 100) {
      throw new Error('Extracted content is too short. The website might be blocking access.');
    }

    // Call OpenAI API for analysis
    console.log('Analyzing content with OpenAI...');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing analysis expert. Analyze this website content and provide a structured analysis in JSON format with the following fields:\n1. productOverview: Brief description in 1-2 sentences\n2. coreValueProposition: Most unique/urgent benefit\n3. targetAudience: { type: "Consumers" | "Business" | "Government", segments: string[] }\n4. currentAwareness: Stage of product (e.g., "Just an idea", "MVP live", "Some beta users", "Public launch", "Revenue generating")\n5. goal: string[] (e.g., ["Awareness", "Waitlist signups", "App downloads"])\n6. budget: Suggested budget range based on market and product stage\n7. strengths: string[] (Key advantages)\n8. constraints: string[] (Limitations and risks)\n9. preferredChannels: string[] (e.g., ["Paid ads", "Content marketing", "PR"])\n10. toneAndPersonality: How the brand should feel in marketing materials'
          },
          {
            role: 'user',
            content: `Analyze this website content:\n\n${content}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('OpenAI analysis received');

    // Parse the response
    const analysis = JSON.parse(openaiData.choices[0].message.content) as WebsiteAnalysis;
    console.log('Analysis parsed successfully');

    // Generate initial campaign recommendations with default budget
    console.log('Generating campaign recommendations...');
    const recommendationsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a marketing campaign expert. Based on the company analysis, recommend the best 3 campaign types from this list: ${campaignTypes.join(', ')}. For each campaign, provide:
1. A title that includes the campaign type
2. A suitable platform (e.g., "Google Ads", "Instagram", "LinkedIn", etc.)
3. A brief description
4. 3 specific insights about why this campaign would work for this company
5. A realistic ROI estimate (e.g., "2.5x")
6. Difficulty level ("Easy", "Medium", or "Hard")
7. Budget range (e.g., "$500-1000")

Make concise recommendations. (150 words or less)
Format the response as a JSON array of campaign objects.`
          },
          {
            role: 'user',
            content: `Here's the company analysis:\n\n${JSON.stringify(analysis, null, 2)}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!recommendationsResponse.ok) {
      const errorData = await recommendationsResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const recommendationsData = await recommendationsResponse.json();
    const recommendations = JSON.parse(recommendationsData.choices[0].message.content) as CampaignRecommendation[];
    console.log('Campaign recommendations generated successfully');

    return { analysis, recommendations };
  } catch (error) {
    console.error('Error in analyzeWebsite:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

export async function generateAllCampaigns(analysis: WebsiteAnalysis, budget: number): Promise<CampaignRecommendation[]> {
  console.log('Generating all campaign recommendations...');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a marketing campaign expert. Based on the company analysis and the specified budget of $${budget}, create detailed campaign recommendations for ALL campaign types from this list: ${campaignTypes.join(', ')}. For each campaign, provide:
1. A title that includes the campaign type
2. A suitable platform (e.g., "Google Ads", "Instagram", "LinkedIn", etc.)
3. A brief description
4. 3 specific insights about why this campaign would work for this company
5. A realistic ROI estimate (e.g., "2.5x")
6. Difficulty level ("Easy", "Medium", or "Hard")
7. Budget range that fits within the total budget of $${budget}

Make concise recommendations. (150 words or less)
Format the response as a JSON array of campaign objects.`
        },
        {
          role: 'user',
          content: `Here's the company analysis:\n\n${JSON.stringify(analysis, null, 2)}`
        }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API error:', errorData);
    throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const recommendations = JSON.parse(data.choices[0].message.content) as CampaignRecommendation[];
  console.log('All campaign recommendations generated successfully');
  return recommendations;
} 