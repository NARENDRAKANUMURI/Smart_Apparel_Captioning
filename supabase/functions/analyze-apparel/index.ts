import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const guessMimeFromBase64 = (b64: string) => {
  const s = b64.trim();
  // Common magic prefixes for base64-encoded images
  if (s.startsWith('/9j/')) return 'image/jpeg';
  if (s.startsWith('iVBOR')) return 'image/png';
  if (s.startsWith('R0lGOD')) return 'image/gif';
  if (s.startsWith('UklGR')) return 'image/webp';
  return 'image/jpeg';
};

const toDataUrl = (maybeBase64: string) => {
  const s = maybeBase64.trim();
  if (s.startsWith('data:')) return s;
  const mime = guessMimeFromBase64(s);
  return `data:${mime};base64,${s}`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!imageUrl && !imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Please provide an image URL or base64 image' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageContent = imageBase64 
      ? { type: "image_url", image_url: { url: toDataUrl(imageBase64) } }
      : { type: "image_url", image_url: { url: imageUrl } };

    const systemPrompt = `You are an expert fashion analyst and apparel detection system. Your job is to analyze images and:

1. FIRST, determine if the image contains clothing/apparel items. Valid apparel includes:
   - Tops (shirts, t-shirts, blouses, sweaters, jackets, coats)
   - Bottoms (pants, jeans, shorts, skirts)
   - Dresses and jumpsuits
   - Footwear (shoes, boots, sandals)
   - Accessories worn on body (hats, scarves, bags, jewelry)
   - Activewear and sportswear
   - Formal wear and ethnic wear

2. If the image does NOT contain valid apparel/clothing:
   - Return: { "isValid": false, "reason": "Brief explanation of what was detected instead" }

3. If the image DOES contain valid apparel:
   - Return a detailed JSON response with:
   {
     "isValid": true,
     "caption": "A detailed, natural language description of the apparel item(s)",
     "items": [
       {
         "type": "category of item",
         "color": "primary color(s)",
         "pattern": "solid/striped/printed/etc",
         "style": "casual/formal/sporty/etc",
         "material": "estimated material if visible",
         "details": "notable features or design elements"
       }
     ],
     "occasion": "suggested occasion for wearing",
     "fashionTips": "brief styling suggestion"
   }

IMPORTANT: Only respond with valid JSON. No additional text.`;

    console.log('Sending request to Lovable AI...');
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: "Analyze this image and provide apparel detection results:" },
              imageContent
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('AI Response:', content);

    // Parse the JSON response from AI
    let analysisResult;
    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysisResult = {
        isValid: true,
        caption: content,
        items: [],
        occasion: "Various",
        fashionTips: "Unable to parse detailed analysis"
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-apparel function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze image';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
