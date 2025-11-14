import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { insertPrayerIntentionSchema, chatMessageSchema } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function sendTelegramMessage(message: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram credentials not configured");
    throw new Error("Telegram configuration missing");
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get all prayer intentions
  app.get("/api/prayer-intentions", async (_req, res) => {
    try {
      const intentions = await storage.getPrayerIntentions();
      res.json(intentions);
    } catch (error) {
      console.error("Error fetching prayer intentions:", error);
      res.status(500).json({ error: "Failed to fetch prayer intentions" });
    }
  });

  // Create a new prayer intention and send to Telegram
  app.post("/api/prayer-intentions", async (req, res) => {
    try {
      // Validate request data
      const validatedData = insertPrayerIntentionSchema.parse(req.body);
      
      // Save to storage
      let intention;
      try {
        intention = await storage.createPrayerIntention(validatedData);
      } catch (storageError) {
        console.error("Storage error creating prayer intention:", storageError);
        return res.status(500).json({ error: "Failed to save prayer intention" });
      }

      // Send to Telegram (optional - doesn't fail the request)
      const telegramMessage = `
🙏 <b>New Prayer Request</b>

<b>From:</b> ${intention.name}

<b>Prayer Intention:</b>
${intention.intention}

<i>Submitted at: ${new Date(intention.createdAt).toLocaleString()}</i>
      `.trim();

      try {
        await sendTelegramMessage(telegramMessage);
      } catch (telegramError) {
        console.error("Failed to send to Telegram, but prayer saved:", telegramError);
      }

      res.json(intention);
    } catch (error: any) {
      // Handle validation errors
      if (error?.name === "ZodError") {
        console.error("Validation error:", error);
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      
      // Handle unexpected errors
      console.error("Unexpected error creating prayer intention:", error);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  // Chat endpoint with OpenAI
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = chatMessageSchema.parse(req.body);

      const systemPrompt = `You are a helpful and compassionate AI assistant for Kariua Parish Catholic Church, led by Fr. Karani. 
Your role is to:
- Answer questions about Catholic faith, teachings, and traditions
- Provide information about the parish and its activities
- Offer spiritual guidance with reverence and respect
- Help visitors understand Catholic prayers, sacraments, and devotions
- Be welcoming and supportive to people of all backgrounds

The parish features:
- Sacred music including hymns and recorded masses
- Traditional Catholic prayers (Rosary, Novenas, daily prayers)
- Prayer intentions submitted by parishioners
- A welcoming community under Fr. Karani's pastoral care

Always respond with warmth, respect, and spiritual sensitivity. If you don't know something specific about the parish, be honest but helpful.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_completion_tokens: 500,
      });

      const response = completion.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";

      res.json({ response });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
