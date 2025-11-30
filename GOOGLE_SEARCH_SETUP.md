# Google Custom Search API Setup Guide

To enable real Google Shopping search results in the wishlist feature, follow these steps:

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Custom Search API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Custom Search API"
   - Click "Enable"

## Step 2: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key
4. (Optional) Restrict the API key to "Custom Search API" for security

## Step 3: Create a Custom Search Engine

1. Go to [Google Custom Search](https://cse.google.com/cse/)
2. Click "Add" to create a new search engine
3. In "Sites to search", enter: `*` (to search the entire web)
4. Click "Create"
5. Go to "Setup" > "Basics"
6. Enable "Search the entire web"
7. Enable "Image search"
8. Copy your **Search Engine ID** (CX)

## Step 4: Add to Your Project

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following lines:

```
EXPO_PUBLIC_GOOGLE_API_KEY=your_api_key_here
EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

3. Restart your Expo development server

## Note

- The free tier of Google Custom Search API allows 100 queries per day
- For production use, you may need to upgrade to a paid plan
- Without API keys, the app will use an improved fallback with product-specific images based on search terms

## Current Fallback Behavior

If Google API is not configured, the app uses:
- Product-specific images based on search terms (shoes, shirts, jeans, etc.)
- Realistic pricing
- Brand names from popular fashion brands

The images are now more accurate and match the search query better than before.

