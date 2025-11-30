# Quick Setup: Google Search Engine ID

Your Google API key has been added: `AIzaSyAan-A74t18rUSxGzYxBuF-60su_xJs-7Q`

**You also need a Search Engine ID (CX) to use Google Custom Search:**

## Get Your Search Engine ID (CX) - 2 Minutes

1. Go to [Google Custom Search](https://cse.google.com/cse/)
2. Click **"Add"** to create a new search engine
3. In **"Sites to search"**, enter: `*` (asterisk to search entire web)
4. Click **"Create"**
5. Go to **"Setup"** → **"Basics"**
6. Enable:
   - ✅ **"Search the entire web"**
   - ✅ **"Image search"**
7. Copy your **Search Engine ID** (it looks like: `017576662512468239146:omuauf_lfve`)

## Add to Your Project

Create a `.env` file in the root directory with:

```
EXPO_PUBLIC_GOOGLE_API_KEY=AIzaSyAan-A74t18rUSxGzYxBuF-60su_xJs-7Q
EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

Then restart your Expo server.

## Alternative: Use Without Search Engine ID

If you don't want to set up the Search Engine ID right now, the app will use an improved fallback with product-specific images that match your search terms (shoes show shoe images, etc.).

