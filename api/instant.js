// api/instant.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const query = req.query.q;
  const OPENAI_KEY = process.env.OPENAI_KEY;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter." });
  }

  try {
    // 1️⃣ First try to fetch summary from Wikipedia
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const wikiResponse = await fetch(wikiUrl);
    const wikiData = await wikiResponse.json();

    if (wikiData?.extract) {
      return res.status(200).json({
        source: "Wikipedia",
        title: wikiData.title || "Result",
        description: wikiData.extract,
        url: wikiData.content_urls?.desktop?.page || null,
        thumbnail: wikiData.thumbnail?.source || null,
      });
    }

    // 2️⃣ If Wikipedia doesn't have it, fallback to OpenAI (if key is available)
    if (!OPENAI_KEY) {
      return res.status(404).json({ error: "No Wikipedia result and no OpenAI key available." });
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI assistant that gives concise factual answers." },
          { role: "user", content: query },
        ],
        max_tokens: 200,
      }),
    });

    const aiData = await openaiResponse.json();
    const answer = aiData?.choices?.[0]?.message?.content?.trim() || "No answer found.";

    return res.status(200).json({
      source: "OpenAI",
      title: "AI Answer",
      description: answer,
    });
  } catch (error) {
    console.error("Instant Answer Error:", error);
    res.status(500).json({
      error: "Instant answer failed.",
      details: error.message,
    });
  }
}