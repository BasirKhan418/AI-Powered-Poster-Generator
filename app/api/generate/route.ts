// File: app/api/generate-poster/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define TypeScript interfaces for our data structures
interface PosterPayload {
  title: string;
  description: string;
  theme: 'professional' | 'creative' | 'minimal' | 'bold' | 'elegant';
  purpose: 'event' | 'promotion' | 'announcement' | 'advertisement' | 'educational';
  colorScheme: 'auto' | 'vibrant' | 'pastel' | 'monochrome' | 'dark' | 'light';
  typographyStyle: 'modern' | 'classic' | 'playful' | 'elegant' | 'bold';
  imageStyle: 'photo' | 'illustration' | 'abstract' | 'minimal' | 'none';
  designComplexity: number;
  aiEnhancement: boolean;
  orientation: 'portrait' | 'landscape' | 'square';
  size: 'standard' | 'a4' | 'a3' | 'social' | 'custom';
  tags: string;
}

interface PromptResult {
  prompt: string;
  width: number;
  height: number;
}

interface ApiResponse {
  success: boolean;
  image?: string;
  metadata?: {
    width: number;
    height: number;
    prompt: string;
    title: string;
    orientation: string;
    theme: string;
    purpose: string;
  };
  error?: string;
  message?: string;
}

// Initialize the OpenAI client with Nebius configuration
const initializeClient = (): OpenAI => {
  return new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: process.env.NEBIUS_API_KEY || '',
  });
};

/**
 * System prompt for the AI Poster Generator
 */
const SYSTEM_PROMPT: string = `
You are PosterAI, a specialized AI system designed to generate high-quality visual poster designs. Your task is to create detailed, visually-appealing poster descriptions that can be rendered by image generation models. 

Your expertise includes:
- Translating user requirements into visually compelling poster designs
- Understanding design principles including layout, typography, color theory, and visual hierarchy
- Adapting designs based on purpose (events, promotions, educational content)
- Generating appropriate style based on themes (professional, creative, minimal, bold, elegant)
- Optimizing designs for different orientations and sizes

When given user specifications, translate them into detailed image generation prompts with the following characteristics:
- Precise visual descriptions that guide the image model
- Appropriate stylistic elements based on theme and purpose
- Balanced composition suitable for the specified orientation
- Color schemes that match the requested mood and theme
- Typography suggestions that enhance readability and visual appeal

For each request, create a cohesive design that communicates the user's message effectively while maintaining professional design standards.
`;

/**
 * Generates a detailed prompt for the poster based on user input
 * @param {PosterPayload} payload - The poster configuration
 * @returns {PromptResult} - The prompt and dimensions
 */
function generateUserPrompt(payload: PosterPayload): PromptResult {
  // Extract values from payload
  const {
    title,
    description,
    theme,
    purpose,
    colorScheme,
    typographyStyle,
    imageStyle,
    designComplexity,
    aiEnhancement,
    orientation,
    size,
    tags
  } = payload;

  // Define dimensions based on orientation and size
  let width: number = 1024;
  let height: number = 1024;
  
  if (orientation === "portrait") {
    width = 768;
    height = 1024;
  } else if (orientation === "landscape") {
    width = 1024;
    height = 768;
  }

  // Adjust based on size if needed
  if (size === "social") {
    // Social media square format
    width = 1080;
    height = 1080;
  } else if (size === "a4") {
    // A4 proportions
    width = 794;
    height = 1123;
  } else if (size === "a3") {
    // A3 proportions
    width = 1123;
    height = 1587;
  }

  // Build theme descriptors
  const themeDescriptors: Record<string, string> = {
    professional: "sleek, corporate, polished, sophisticated, structured",
    creative: "artistic, imaginative, vibrant, expressive, dynamic",
    minimal: "clean, simple, uncluttered, elegant, refined",
    bold: "striking, dramatic, impactful, confident, powerful",
    elegant: "graceful, sophisticated, tasteful, refined, delicate"
  };

  // Build purpose descriptors
  const purposeDescriptors: Record<string, string> = {
    event: "engaging, time-specific, celebratory, organized",
    promotion: "persuasive, attention-grabbing, value-focused",
    announcement: "clear, informative, eye-catching",
    advertisement: "compelling, brand-focused, benefit-highlighting",
    educational: "informative, structured, clear, organized"
  };

  // Build color scheme descriptors
  const colorSchemeDescriptors: Record<string, string> = {
    auto: "", // Let AI decide based on theme
    vibrant: "vibrant, high contrast, rich, saturated colors",
    pastel: "soft, soothing pastel colors, gentle palette",
    monochrome: "sophisticated monochromatic color scheme, variations of a single hue",
    dark: "dark background, rich deep tones, dramatic lighting",
    light: "light background, bright airy feel, crisp clean look"
  };

  // Build typography style descriptors
  const typographyDescriptors: Record<string, string> = {
    modern: "contemporary typography, clean sans-serif fonts, balanced sizing hierarchy",
    classic: "traditional typography, elegant serif fonts, refined text layout",
    playful: "fun varied typography, decorative fonts, dynamic text arrangement",
    elegant: "sophisticated typography, refined fonts, graceful text placement",
    bold: "strong impactful typography, heavy font weights, prominent text sizing"
  };

  // Build image style descriptors
  const imageStyleDescriptors: Record<string, string> = {
    photo: "photographic elements, realistic imagery, high-quality photographs",
    illustration: "illustrated elements, artistic drawings, hand-crafted graphic style",
    abstract: "abstract geometric shapes, non-representational visual elements",
    minimal: "simple iconic visuals, restrained use of imagery, essential elements only",
    none: "typography-focused design, text-only layout, no imagery"
  };

  // Calculate complexity descriptor
  const complexityLevel: 'simple' | 'moderate' | 'complex' = designComplexity <= 33 ? "simple" : 
                        designComplexity <= 66 ? "moderate" : 
                        "complex";
  
  const complexityDescriptors: Record<string, string> = {
    simple: "clean minimalist design, essential elements only, uncluttered layout",
    moderate: "balanced design with thoughtful elements, refined layout",
    complex: "detailed rich design, sophisticated composition, multiple integrated elements"
  };
  
  const complexityDescriptor: string = complexityDescriptors[complexityLevel];

  // AI Enhancement-specific instructions
  const aiEnhancementText: string = aiEnhancement ? 
    "Optimize the visual balance, color harmony, and overall design impact. Use advanced design principles to enhance aesthetic appeal." : "";

  // Combine all elements into a detailed prompt
  const prompt: string = `
Create an eye-catching ${theme} poster design for ${purpose} purposes.

POSTER CONTENT:
- Title: "${title}"
- Description: "${description}"
${tags ? `- Key themes/tags: ${tags}` : ""}

VISUAL STYLE:
- Overall theme: ${themeDescriptors[theme]}
- Purpose-specific style: ${purposeDescriptors[purpose]}
- Image style: ${imageStyleDescriptors[imageStyle]}
- Color scheme: ${colorSchemeDescriptors[colorScheme] || `colors appropriate for ${theme} ${purpose} design`}
- Typography: ${typographyDescriptors[typographyStyle]}
- Design complexity: ${complexityDescriptor}
- Orientation: ${orientation} format poster
${orientation === "portrait" ? "- Portrait composition with vertical emphasis" : 
  orientation === "landscape" ? "- Landscape composition with horizontal emphasis" : 
  "- Square composition with balanced layout"}
${aiEnhancement ? `- ${aiEnhancementText}` : ""}

Create a visually striking ${purpose} poster with professional design elements, clear information hierarchy, and ${complexityLevel} design complexity. The title "${title}" should be prominently displayed with ${typographyStyle} typography.
  
This should be a photorealistic render of a poster, not a cartoon or illustration of a poster.
`.trim();

  // Return the complete prompt and dimensions
  return {
    prompt,
    width,
    height
  };
}

/**
 * Generate a negative prompt to avoid common design issues
 * @returns {string} - The negative prompt
 */
function generateNegativePrompt(): string {
  return "poorly designed, amateurish, unreadable text, distorted, low quality, blurry, bad composition, poor typography, cluttered design, pixelated, unappealing colors, unprofessional, childish";
}

/**
 * Validate the incoming payload
 * @param {any} payload - The request payload to validate
 * @returns {string|null} - Error message or null if valid
 */
function validatePayload(payload: any): string | null {
  if (!payload) return "Missing request body";
  if (!payload.title) return "Title is required";
  if (!payload.description) return "Description is required";
  
  // Validate theme
  const validThemes = ['professional', 'creative', 'minimal', 'bold', 'elegant'];
  if (payload.theme && !validThemes.includes(payload.theme)) {
    return `Invalid theme. Must be one of: ${validThemes.join(', ')}`;
  }
  
  // Validate purpose
  const validPurposes = ['event', 'promotion', 'announcement', 'advertisement', 'educational'];
  if (payload.purpose && !validPurposes.includes(payload.purpose)) {
    return `Invalid purpose. Must be one of: ${validPurposes.join(', ')}`;
  }
  
  // Validate designComplexity
  if (payload.designComplexity !== undefined && 
      (typeof payload.designComplexity !== 'number' || 
       payload.designComplexity < 0 || 
       payload.designComplexity > 100)) {
    return "Design complexity must be a number between 0 and 100";
  }
  
  return null;
}

/**
 * API route handler for poster generation
 * @param {NextRequest} request - The incoming request
 * @returns {NextResponse} - The API response
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get request body
    const payload = await request.json() as PosterPayload;
    
    // Validate payload
    const validationError = validatePayload(payload);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Initialize the OpenAI client
    const client = initializeClient();
    
    // Generate the prompt and get dimensions
    const { prompt, width, height } = generateUserPrompt(payload);
    
    // Generate negative prompt
    const negativePrompt = generateNegativePrompt();
    
    // Number of steps based on complexity
    const numSteps: number = payload.designComplexity > 70 ? 32 : 28;
    
    // Log the generated prompt (for debugging)
    console.log("Generated prompt:", prompt);
    
    // Make the API call to Nebius
    const response = await client.images.generate({
      model: "black-forest-labs/flux-dev",
      response_format: "b64_json",
      extra_body: {
        response_extension: "png",
        width: width,
        height: height,
        num_inference_steps: numSteps,
        negative_prompt: negativePrompt,
        seed: -1 // Random seed for variety
      },
      prompt: prompt
    });
    
    // Check if we received a valid response
    if (!response.data || response.data.length === 0) {
      throw new Error("No image data received from the API");
    }
    
    // Get the base64 image from the response
    const imageData = response.data[0].b64_json;
    
    if (!imageData) {
      throw new Error("Missing b64_json in API response");
    }
    
    // Return the image data and metadata
    const apiResponse: ApiResponse = {
      success: true,
      image: imageData,
      metadata: {
        width: width,
        height: height,
        prompt: prompt,
        title: payload.title,
        orientation: payload.orientation,
        theme: payload.theme,
        purpose: payload.purpose
      }
    };
    console.log("Generated poster response:", apiResponse);
    return NextResponse.json({data:imageData,success:true});
    
  } catch (error) {
    console.error("Error generating poster:", error);
    
    // Return appropriate error response
    const errorResponse: ApiResponse = { 
      success: false,
      error: "Failed to generate poster", 
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
    
    return NextResponse.json({error:errorResponse,  status: 500,success:false });
  }
}

/**
 * GET handler to provide API information
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    name: "Poster Generator API",
    description: "Generate AI-powered poster designs based on user parameters",
    version: "1.0.0",
    endpoints: {
      post: {
        description: "Generate a new poster design",
        parameters: [
          "title", "description", "theme", "purpose", "colorScheme",
          "typographyStyle", "imageStyle", "designComplexity", 
          "aiEnhancement", "orientation", "size", "tags"
        ]
      }
    }
  });
}