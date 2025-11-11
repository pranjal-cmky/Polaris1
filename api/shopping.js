// api/shopping.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const query = req.query.q;
  const SERPAPI_KEY = process.env.SERPAPI_KEY;

  // ✅ Check for missing query
  if (!query) {
    return res.status(400).json({ error: "Missing search query." });
  }

  // ✅ Check if key exists
  if (!SERPAPI_KEY) {
    return res.status(500).json({ error: "Missing SERPAPI_KEY environment variable." });
  }

  try {
    // 🛒 Build API request
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
      query
    )}&api_key=${SERPAPI_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    // ⚙️ Format results for the frontend
    const results = (data.shopping_results || []).map((item) => ({
      title: item.title || "No title",
      price: item.extracted_price || "N/A",
      source: item.source || "Unknown",
      link: item.link || "",
      thumbnail: item.thumbnail || "",
      rating: item.rating || "No rating",
    }));

    // ✅ Return results
    res.status(200).json({ query, results });
  } catch (error) {
    console.error("Shopping Error:", error);
    res.status(500).json({
      error: "Failed to fetch shopping results.",
      details: error.message,
    });
  }
}