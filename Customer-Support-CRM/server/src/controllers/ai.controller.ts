import { Request, Response } from 'express';
import { generateChatbotResponse } from '../services/ai.service';

export async function chatWithBot(req: Request, res: Response): Promise<void> {
  try {
    const { message, history = [], customerName } = req.body;

    if (!message || !message.trim()) {
      res.status(400).json({ success: false, error: 'Message cannot be empty' });
      return;
    }

    const result = await generateChatbotResponse(message, history, customerName);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('chatWithBot error:', error);
    res.status(500).json({ success: false, error: 'Failed to process AI chat message' });
  }
}
