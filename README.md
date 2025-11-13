# 🌟 Polaris — Smart Mini Browser

Polaris is a lightweight, fast, and intelligent mini-browser designed for mobile devices.  
It includes a custom homepage, wallpapers, instant answers, and multi-source search powered by APIs.

---

## 🚀 Features

### 🔍 Multi-Source Search
Polaris collects results from:
- Google CSE  
- Wikipedia  
- SerpAPI (optional)  
- Custom AI instant answers (OpenAI / Gemini optional)

### ⚡ Instant Answers
When you search, Polaris displays:
- Direct facts  
- Quick summaries  
- Top news results  
- Optional AI-powered answers  

### 🎨 Customizable UI
Polaris includes:
- Built-in wallpapers (`default.png`, `mountain.png`, `aurora.png`, `beach.png`)
- Icon support (`icon-192.png`, `icon-512.png`)
- Clean PWA-ready home UI

### 📱 PWA Support
- installable on Android  
- offline homepage  
- service worker caching  

---

## 📁 Project Structure

```
Polaris/
│
├── api/
│   ├── search.js
│   ├── instant.js
│   └── shopping.js
│
├── assets/
│   └── www/
│       ├── index.html
│       ├── style.css
│       ├── main.js
│       ├── sw.js
│       ├── manifest.webmanifest
│       ├── icons/
│       │   ├── icon-192.png
│       │   └── icon-512.png
│       └── wallpapers/
│           ├── default.png
│           ├── mountain.png
│           ├── aurora.png
│           └── beach.png
│
├── LICENSE
└── README.md
```

---

## 🔧 Environment Variables

Create these on **Vercel → Project → Settings → Environment Variables**:

| Variable | Source |
|---------|--------|
| `GOOGLE_CSE_KEY` | Your Google CSE API key |
| `GOOGLE_CSE_CX` | Your CSE Search Engine ID |
| `SERPAPI_KEY` | (Optional) Shopping results |
| `OPENAI_KEY` | (Optional) Instant AI results |

No keys should be stored inside the code.

---

## 🚀 Deployment (Vercel)

1. Upload your project to GitHub  
2. Go to **vercel.com → Add New Project**  
3. Import your Polaris repo  
4. Add the environment variables  
5. Deploy ✔  

Your browser backend will now work via:

```
/api/search?q=your query
/api/instant?q=your query
/api/shopping?q=your query
```

---

## 📜 License

This project is under the **Apache 2.0 License**.  
You may modify and distribute your own versions.

---

## 🌟 Credits

Created by **Pranjal Yadav**  
Powered by:
- Google Search API  
- Wikipedia  
- Vercel Edge Functions  
- OpenAI/Gemini (optional)