# AI Outfit Generation Setup

The Generate Outfit feature uses OpenAI's GPT-4o-mini to intelligently select items from your closet and create stylish outfits.

## Setup Instructions

### 1. Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Click "Create new secret key"
4. Copy your API key (you'll only see it once!)

### 2. Add API Key to Your App

**Option A: Using Environment Variables (Recommended for Production)**

1. Create a `.env` file in the root of your project:
   ```
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

2. Install `expo-constants` if not already installed:
   ```bash
   npx expo install expo-constants
   ```

3. Update `services/aiService.js` to read from environment:
   ```javascript
   import Constants from 'expo-constants';
   const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || 'YOUR_OPENAI_API_KEY';
   ```

**Option B: Direct Configuration (Quick Setup for Testing)**

1. Open `services/aiService.js`
2. Replace `'YOUR_OPENAI_API_KEY'` with your actual API key:
   ```javascript
   const OPENAI_API_KEY = 'sk-your-actual-api-key-here';
   ```

⚠️ **Security Note**: Never commit your API key to version control! Use environment variables for production.

### 3. Test the Feature

1. Add at least 3 items to your closet
2. Go to the Generate Outfit screen
3. Enter a vibe (e.g., "casual", "formal", "date night")
4. Tap "Generate Outfit"
5. The AI will select items and create a styled outfit description

## Cost Information

- **Model Used**: GPT-4o-mini (cost-efficient)
- **Approximate Cost**: ~$0.001-0.002 per outfit generation
- **Alternative**: You can change to `gpt-4` in `aiService.js` for better results (higher cost)

## Troubleshooting

- **"API key not configured"**: Make sure you've added your API key to `services/aiService.js`
- **"Rate limit exceeded"**: You've hit OpenAI's rate limit. Wait a few minutes and try again
- **"Network error"**: Check your internet connection
- **Invalid API key**: Verify your API key is correct and has credits in your OpenAI account

## Customization

You can customize the AI's behavior by modifying the prompt in `services/aiService.js`. The AI currently:
- Selects 3-5 items that complement each other
- Matches the desired vibe/style
- Provides styling descriptions and reasoning

