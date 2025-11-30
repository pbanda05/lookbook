// OpenAI API Service for Outfit Generation
// IMPORTANT: Replace 'YOUR_OPENAI_API_KEY' with your actual API key
// You can get one from https://platform.openai.com/api-keys
// For production, store this in environment variables or secure storage (e.g., Expo Constants)

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Smart fallback algorithm when API key is not configured
function generateOutfitFallback(closetItems, vibe) {
  const vibeLower = vibe.toLowerCase();
  const shuffled = [...closetItems];
  
  // Shuffle array randomly
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Select 3-5 items, ensuring shoes are included if available
  const shoes = shuffled.filter(item => 
    item.name?.toLowerCase().includes('shoe') || 
    item.name?.toLowerCase().includes('sneaker') ||
    item.name?.toLowerCase().includes('boot') ||
    item.name?.toLowerCase().includes('sandal') ||
    item.name?.toLowerCase().includes('air force') ||
    item.name?.toLowerCase().includes('jordan')
  );
  
  const nonShoes = shuffled.filter(item => !shoes.includes(item));
  const numItems = Math.min(Math.max(3, Math.floor(Math.random() * 3) + 3), shuffled.length);
  
  let selectedItems = [];
  if (shoes.length > 0 && numItems > 0) {
    // Always include at least one pair of shoes
    selectedItems.push(shoes[0]);
    const remaining = numItems - 1;
    selectedItems = [...selectedItems, ...nonShoes.slice(0, Math.min(remaining, nonShoes.length))];
  } else {
    selectedItems = shuffled.slice(0, numItems);
  }
  
  const selectedIndices = selectedItems.map(item => closetItems.indexOf(item));
  
  // Generate a description based on vibe
  const vibeDescriptions = {
    casual: 'A relaxed and comfortable',
    formal: 'An elegant and sophisticated',
    'date night': 'A romantic and stylish',
    'business casual': 'A professional yet approachable',
    sporty: 'An athletic and functional',
    edgy: 'A bold and statement-making',
  };
  
  const vibeDesc = vibeDescriptions[vibeLower] || 'A stylish';
  const itemNames = selectedItems.map(item => item.name).join(', ');
  
  return {
    selectedItemIndices: selectedIndices,
    description: `${vibeDesc} ${vibe} outfit featuring ${itemNames}`,
    reasoning: `These items work together to create a cohesive ${vibe} look that's perfect for the occasion.`,
  };
}

export async function generateOutfitWithAI(closetItems, vibe) {
  // Check if API key is valid (not placeholder and not empty)
  const hasValidApiKey = OPENAI_API_KEY && 
                         OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY' && 
                         OPENAI_API_KEY.trim().length > 0 &&
                         OPENAI_API_KEY.startsWith('sk-');

  if (!hasValidApiKey) {
    console.log('⚠️ Using fallback outfit generation (no valid API key configured)');
    console.log('API Key status:', OPENAI_API_KEY ? 'Present but invalid' : 'Missing');
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    return generateOutfitFallback(closetItems, vibe);
  }

  console.log('🤖 Using OpenAI AI to generate outfit...');
  try {

    // Create a list of available items for the AI
    const itemsList = closetItems.map((item, index) => 
      `${index + 1}. ${item.name}`
    ).join('\n');

    const prompt = `You are a fashion stylist. Given the following items in a user's closet and their desired vibe, select 3-5 items that would create a cohesive, stylish outfit. IMPORTANT: Every outfit MUST include shoes. If there are shoes available in the closet, you MUST include at least one pair of shoes in your selection.

Available items in closet:
${itemsList}

Desired vibe/style: ${vibe}

Please respond with ONLY a JSON object in this exact format:
{
  "selectedItemIndices": [0, 2, 4],
  "description": "A stylish description of the outfit",
  "reasoning": "Brief explanation of why these items work together"
}

The selectedItemIndices should be the array indices (0-based) of the items you selected from the list above. Select items that complement each other and match the desired vibe. CRITICAL: Always include shoes if available in the closet.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency, can use 'gpt-4' for better results
        messages: [
          {
            role: 'system',
            content: 'You are a professional fashion stylist. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      throw new Error(errorData.error?.message || 'Failed to generate outfit');
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;
    const result = JSON.parse(responseText);

    console.log('✅ AI outfit generated successfully');
    console.log('Selected items:', result.selectedItemIndices);

    return {
      selectedItemIndices: result.selectedItemIndices || [],
      description: result.description || 'Generated outfit',
      reasoning: result.reasoning || '',
    };
  } catch (error) {
    console.error('❌ AI Generation Error:', error);
    
    // If API call fails, fall back to smart algorithm
    if (error.message?.includes('API key') || error.message?.includes('401')) {
      console.log('⚠️ API key error detected, using fallback');
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateOutfitFallback(closetItems, vibe);
    }
    
    // For other errors, try fallback before throwing
    console.log('⚠️ AI generation failed, using fallback algorithm');
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateOutfitFallback(closetItems, vibe);
  }
}

