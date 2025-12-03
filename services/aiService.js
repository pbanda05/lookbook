// OpenAI API Service for Outfit Generation
// IMPORTANT: don't ship a real key in code in production.
const OPENAI_API_KEY =
  process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function getCategory(item) {
  if (item.category) return item.category; // 'top' | 'bottom' | 'shoes' | 'accessory'
  const name = item.name?.toLowerCase() || '';

  if (
    name.includes('t-shirt') ||
    name.includes('tee') ||
    name.includes('shirt') ||
    name.includes('top') ||
    name.includes('blouse') ||
    name.includes('hoodie') ||
    name.includes('sweater') ||
    name.includes('crewneck') ||
    name.includes('jacket') ||
    name.includes('coat') ||
    name.includes('quarter-zip') ||
    name.includes('blazer') ||
    name.includes('cardigan')
  ) {
    return 'top';
  }

  if (
    name.includes('jeans') ||
    name.includes('pants') ||
    name.includes('trousers') ||
    name.includes('slacks') ||
    name.includes('shorts') ||
    name.includes('skirt') ||
    name.includes('joggers') ||
    name.includes('sweatpants') ||
    name.includes('leggings') ||
    name.includes('cargos') ||
    name.includes('chinos') ||
    name.includes('capris') 
  ) {
    return 'bottom';
  }

  if (
    name.includes('shoe') ||
    name.includes('sneaker') ||
    name.includes('trainer') ||
    name.includes('boot') ||
    name.includes('sandal') ||
    name.includes('heel') ||
    name.includes('air force') ||
    name.includes('jordan')
  ) {
    return 'shoes';
  }

  return 'accessory';
}

function isTop(item) {
  return getCategory(item) === 'top';
}
function isBottom(item) {
  return getCategory(item) === 'bottom';
}
function isShoe(item) {
  return getCategory(item) === 'shoes';
}


// ---------- utility helpers ----------

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// score an item based on Profile prefs
function scoreItemForPreferences(item, preferences) {
  if (!preferences) return 0;
  const { stylePreferences = [], favoriteColors = [] } = preferences;
  const name = item.name?.toLowerCase() || '';
  let score = 0;

  favoriteColors.forEach((color) => {
    if (name.includes(color.toLowerCase())) score += 2;
  });

  stylePreferences.forEach((style) => {
    if (name.includes(style.toLowerCase())) score += 3;
  });

  return score;
}

function pickWithPreferences(items, preferences) {
  if (!items || items.length === 0) return null;
  const scored = items.map((item) => ({
    item,
    score: scoreItemForPreferences(item, preferences) + Math.random(), // tiny noise
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0].item;
}

// ---------- core: select outfit in JS ----------

// function selectOutfitFromCloset(closetItems, vibe, preferences) {
//   const tops = closetItems.filter(isTop);
//   const bottoms = closetItems.filter(isBottom);
//   const shoes = closetItems.filter(isShoe);
//   const accessories = closetItems.filter(
//     (item) => !isTop(item) && !isBottom(item) && !isShoe(item)
//   );

//   if (!tops.length || !bottoms.length || !shoes.length) {
//     // super basic fallback: random 3–5 items
//     console.warn(
//       'Not enough categorized items for top+bottom+shoes – using random mix.'
//     );
//     const shuffled = shuffle(closetItems);
//     const num = Math.min(5, Math.max(3, shuffled.length));
//     const chosen = shuffled.slice(0, num);
//     const indices = chosen.map((item) => closetItems.indexOf(item));
//     return { indices, items: chosen };
//   }

//   const top = pickWithPreferences(tops, preferences);
//   const bottom = pickWithPreferences(bottoms, preferences);
//   const shoe = pickWithPreferences(shoes, preferences);

//   const usedIds = new Set(
//     [top, bottom, shoe].map((i) => i.id ?? `${i.name}-${i.imageUri || ''}`)
//   );

//   const extrasPool = shuffle(
//     accessories.filter(
//       (item) =>
//         !usedIds.has(item.id ?? `${item.name}-${item.imageUri || ''}`)
//     )
//   );

//   // 0–2 extras so total is 3–5 items
//   const extraCount =
//     extrasPool.length === 0 ? 0 : Math.floor(Math.random() * 3); // 0,1,2
//   const extras = extrasPool.slice(0, extraCount);

//   const finalItems = [top, bottom, shoe, ...extras];
//   const indices = finalItems.map((item) => closetItems.indexOf(item));

//   return { indices, items: finalItems };
// }
function normalizeCombo(indices) {
  return [...indices].sort((a, b) => a - b).join('-');
}

function selectOutfitFromCloset(
  closetItems,
  vibe,
  preferences,
  previousOutfits = []
) {
  const tops = closetItems.filter(isTop);
  const bottoms = closetItems.filter(isBottom);
  const shoes = closetItems.filter(isShoe);
  const accessories = closetItems.filter(
    (item) => !isTop(item) && !isBottom(item) && !isShoe(item)
  );

  // Fallback if we cannot guarantee core pieces
  if (!tops.length || !bottoms.length || !shoes.length) {
    console.warn(
      'Not enough categorized items for top+bottom+shoes – using random mix.'
    );
    const shuffled = shuffle(closetItems);
    const num = Math.min(5, Math.max(3, shuffled.length));
    const chosen = shuffled.slice(0, num);
    const indices = chosen.map((item) => closetItems.indexOf(item));
    return { indices, items: chosen };
  }

  const previousKeys = (previousOutfits || []).map(normalizeCombo);
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const top = pickWithPreferences(tops, preferences);
    const bottom = pickWithPreferences(bottoms, preferences);
    const shoe = pickWithPreferences(shoes, preferences);

    const usedIds = new Set(
      [top, bottom, shoe].map(
        (i) => i.id ?? `${i.name}-${i.imageUri || ''}`
      )
    );

    const extrasPool = shuffle(
      accessories.filter(
        (item) =>
          !usedIds.has(item.id ?? `${item.name}-${item.imageUri || ''}`)
      )
    );

    // 0–2 extras so total is 3–5 items
    const extraCount =
      extrasPool.length === 0 ? 0 : Math.floor(Math.random() * 3); // 0,1,2
    const extras = extrasPool.slice(0, extraCount);

    const finalItems = [top, bottom, shoe, ...extras];
    const indices = finalItems.map((item) =>
      closetItems.indexOf(item)
    );
    const key = normalizeCombo(indices);

    // If this combo hasn't been used, or we're out of attempts, accept it
    if (!previousKeys.includes(key) || attempt === maxAttempts - 1) {
      return { indices, items: finalItems };
    }
  }

  // Failsafe (should basically never hit)
  const shuffled = shuffle(closetItems);
  const num = Math.min(5, Math.max(3, shuffled.length));
  const chosen = shuffled.slice(0, num);
  const indices = chosen.map((item) => closetItems.indexOf(item));
  return { indices, items: chosen };
}
// ---------- AI: describe an already-chosen outfit ----------

async function describeOutfitWithAI(chosenItems, vibe, preferences) {
  const hasValidApiKey =
    OPENAI_API_KEY &&
    OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE' &&
    OPENAI_API_KEY.trim().length > 0 &&
    OPENAI_API_KEY.startsWith('sk-');

  const itemList = chosenItems.map((i) => `- ${i.name}`).join('\n');

  const styleProfileText = preferences
    ? `User style preferences:
${JSON.stringify(
  {
    stylePreferences: preferences.stylePreferences || [],
    favoriteColors: preferences.favoriteColors || [],
  },
  null,
  2
)}`
    : 'User has no explicit style preferences.';

  // If no key, just return a simple local description
  if (!hasValidApiKey) {
    const names = chosenItems.map((i) => i.name).join(', ');
    return {
      description: `A ${vibe} outfit featuring ${names}.`,
      reasoning:
        'Pieces were chosen to include a top, a bottom, and shoes, with extras that fit your style preferences.',
    };
  }

  const prompt = `You are a fashion stylist.

The app has ALREADY selected this specific outfit from the user's closet:
${itemList}

Desired vibe/style: ${vibe}

${styleProfileText}

Write:
- a short, stylish outfit description (1–3 sentences)
- a short reasoning (1–3 sentences) explaining why it works for the vibe and user.

Respond ONLY as JSON in this exact format:
{
  "description": "text...",
  "reasoning": "text..."
}`;

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional fashion stylist. Always respond with valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 250,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to call OpenAI');
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  const parsed = JSON.parse(text);

  return {
    description: parsed.description || '',
    reasoning: parsed.reasoning || '',
  };
}

// ---------- main function used by your screen ----------

export async function generateOutfitWithAI(
  closetItems,
  vibe,
  preferences,
  previousOutfits = []
) {
  // 1) pick the items in JS, avoiding repeats
  const { indices, items } = selectOutfitFromCloset(
    closetItems,
    vibe,
    preferences,
    previousOutfits
  );

  // 2) ask AI to describe them
  try {
    const { description, reasoning } = await describeOutfitWithAI(
      items,
      vibe,
      preferences
    );
    return {
      selectedItemIndices: indices,
      description: description || 'Generated outfit',
      reasoning: reasoning || '',
    };
  } catch (err) {
    console.error('AI description failed, using simple fallback:', err);
    const names = items.map((i) => i.name).join(', ');
    return {
      selectedItemIndices: indices,
      description: `A ${vibe} outfit featuring ${names}.`,
      reasoning:
        'Includes a top, a bottom, and shoes, plus extras that complement the vibe.',
    };
  }
}