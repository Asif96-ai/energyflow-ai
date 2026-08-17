import { analyzeEnergyData } from "../utils/analyzer";

export async function generateNaturalLanguageInsights(energyData) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Missing OpenRouter API Key in .env.local");

  // Step 1 & 2: Run Statistical Analysis
  const metrics = analyzeEnergyData(energyData);

  // Step 3: Build Generative AI Prompt
  const prompt = `You are an expert AI Energy Consultant analyzing user electricity data.

ANALYTICAL SUMMARY:
- Total Consumption: ${metrics.totalConsumption} kWh over ${metrics.dataCount} days
- Average Daily Usage: ${metrics.avgDaily} kWh
- Peak Usage Day: ${metrics.peakDay.date} (${metrics.peakDay.consumption} kWh)
- Lowest Usage Day: ${metrics.minDay.date} (${metrics.minDay.consumption} kWh)
- Weekly Consumption Trend: ${metrics.weeklyTrendPercent}% change

RAW DATA TIME-SERIES:
${JSON.stringify(energyData)}

TASK:
Generate 3 distinct, natural-language energy optimization recommendations based on the data above. 
Respond ONLY in valid JSON format matching this schema:
[
  { "title": "Short Title", "description": "Natural language advice explaining why this happened and what action to take." }
]`;

  // Step 4: Execute LLM Call
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "EnergyFlow AI",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    }),
  });

  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

  const resData = await response.json();
  const rawText = resData.choices[0].message.content;

  // Clean reasoning tokens (<think>...</think>) from DeepSeek R1
  const cleanJson = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
}