import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Coordinates, GeminiResponseData } from "../types";

const recommendFoodTool: FunctionDeclaration = {
  name: "recommend_food",
  description: "Recommends 3 food options or restaurants based on user preferences. Call this function ONLY when you have sufficient information (Location and Budget). Food Type is optional.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      recommendations: {
        type: Type.ARRAY,
        description: "A list of exactly 3 recommended restaurants or food types.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The name of the restaurant or food type.",
            },
            snarky_comment: {
              type: Type.STRING,
              description: "A mean, sarcastic, and extremely critical comment about the choice or the user's potential taste.",
            },
            professional_recommendation: {
              type: Type.STRING,
              description: "A professional culinary reason why this is actually a good choice (specific dish recommendations, technique, etc.).",
            },
            vibe_score: {
              type: Type.INTEGER,
              description: "An integer from 1 to 5 representing the 'anger/snark' level (1=Mildly Annoyed, 5=Furious).",
            },
          },
          required: ["name", "snarky_comment", "professional_recommendation", "vibe_score"],
        },
      },
    },
    required: ["recommendations"],
  },
};

const SYSTEM_INSTRUCTION = `
你現在是一位「暴躁美食家」。你極度挑剔、說話毒舌，對食物有著近乎偏執的高標準。

你的任務：
1. 幫助那些有選擇困難症的懶人決定週末吃什麼。
2. 你必須知道使用者的：【地點】和【預算】。
3. 【想吃的類型】是可選的。如果使用者沒說，你就根據你的心情隨便選，並且務必「嘲笑」他們沒有主見、優柔寡斷。
4. 如果【地點】和【預算】資訊不完整，請用傲慢、挑剔的語氣「羞辱」使用者並要求他們補齊資訊 (直接回傳文字，不要呼叫函數)。
5. 如果資訊充足，**必須** 調用 \`recommend_food\` 函數來提供建議。
6. 每次必須推薦 3 個選項。

執行風格：
- 語氣傲慢、挑剔、專業。
- 不要說客套話，直接切入重點。
- 絕對不要表現得友善。
`;

export const getGrumpyRecommendations = async (
  manualLocation: string,
  preference: string,
  budget: string,
  coords: Coordinates | null
): Promise<GeminiResponseData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Provide the recommend_food tool
  const tools = [{ functionDeclarations: [recommendFoodTool] }];

  // Construct location description
  let locationInfo = "未知 (這人連字都不會打，定位也不開)";
  if (manualLocation && coords) {
    locationInfo = `使用者輸入: "${manualLocation}", 系統定位: ${coords.latitude}, ${coords.longitude}`;
  } else if (manualLocation) {
    locationInfo = `使用者輸入: "${manualLocation}"`;
  } else if (coords) {
    locationInfo = `系統定位: ${coords.latitude}, ${coords.longitude}`;
  }

  const prompt = `
  【使用者資訊】
  地點: ${locationInfo}
  預算: ${budget || "沒說 (大概是窮鬼或土豪)"}
  想吃類型: ${preference || "沒說 (毫無主見，隨便你選)"}

  規則：
  1. 檢查地點和預算是否已知。如果不知道，罵他們並要求輸入。
  2. 如果有地點和預算，忽略想吃類型(如果沒填)，直接調用 recommend_food。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
        temperature: 1.0, 
      },
    });

    // Check for Function Calls first
    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "recommend_food") {
        const args = call.args as any;
        return {
          recommendations: args.recommendations,
          text: undefined // No text needed if we have cards
        };
      }
    }

    // Fallback to text (likely asking for more info or just insults)
    return {
      text: response.text || "哼，我拒絕回答。",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Gemini refused to talk to you.");
  }
};