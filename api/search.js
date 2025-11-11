// api/search.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const query = req.query.q;
  const GOOGLE_CSE_KEY = process.env.GOOGLE_CSE_KEY;
  const GOOGLE_CSE_CX = process.env.GOOGLE_CSE_CX;

  // ✅ Check if query exists
  if (!query) {
    return res.status(400).json({ error: "Missing search query." });
  }

  try {
    // Build the Google Custom Search API request
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CSE_KEY}&cx=${GOOGLE_CSE_CX}&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url);
    const data = await response.json();

    // ✅ Check for errors from API
    if (data.error) {
      return res
        .status(500)
        .json({ error: data.error.message || "Google Search API error" });
    }

    // ✅ Format results for frontend
    const results = (data.items || []).map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    }));

    // ✅ Send back as JSON
    res.status(200).json({ query, results });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      error: "Search failed",
      details: error.message,
    });
  }
}