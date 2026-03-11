import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";
import axios from "axios";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  app.get(api.financialData.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const data = await storage.getFinancialData(req.user.id);

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json(data);
  });

  app.post(api.financialData.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const input = api.financialData.update.input.parse(req.body);
      const data = await storage.upsertFinancialData(req.user.id, input);

      res.status(200).json(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      throw err;
    }
  });

  app.get(api.chat.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const messages = await storage.getChatMessages(req.user.id);
    res.json(messages);
  });

  app.post(api.chat.send.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const input = api.chat.send.input.parse(req.body);

      // Save user message
      await storage.createChatMessage(req.user.id, {
        role: "user",
        content: input.message,
      });

      const allMessages = await storage.getChatMessages(req.user.id);
      const financialData = await storage.getFinancialData(req.user.id);

      const systemPrompt = `
You are a smart AI financial advisor.
Give clear, short, and practical financial advice.

User Financial Profile:
Income: ₹${financialData?.income || 0}
Expenses: ₹${financialData?.expenses || 0}
Assets: ₹${financialData?.assets || 0}
Liabilities: ₹${financialData?.liabilities || 0}
Credit Score: ${financialData?.creditScore || 0}
EPF: ${financialData?.epfDetails || "None"}
Investments: ${JSON.stringify(financialData?.investments || [])}
`;

      // Format conversation properly
      const messages = [
        { role: "system", content: systemPrompt },
        ...allMessages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      ];

      // Call Groq API
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-8b-8192",
          messages: messages,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiReplyContent =
        response.data?.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a response.";

      const aiReply = await storage.createChatMessage(req.user.id, {
        role: "assistant",
        content: aiReplyContent,
      });

      res.status(200).json(aiReply);

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      console.error("AI ERROR:", err?.response?.data || err.message);

      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
