import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// Initialize OpenAI client from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateRequest {
  protagonistName: string;
  setting: string;
  season: string;
  romanticInterest: string;
  adultThemed: boolean;
}

/**
 * Vercel serverless function to generate a screenplay using OpenAI
 */
export default async (req: VercelRequest, res: VercelResponse) => {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const input = req.body as GenerateRequest;

    // Validate input
    if (!input.protagonistName || !input.setting || !input.season || !input.romanticInterest) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build the system prompt
    const systemPrompt = `You are a screenwriter specializing in Hallmark-style romantic comedies. 
Your screenplays should follow standard screenplay format with:
- Scene headings (INT./EXT., LOCATION, TIME OF DAY)
- Action descriptions
- Character names in ALL CAPS above dialogue
- Dialogue
- Parentheticals for character actions

The screenplay should be SHORT (5-8 scenes max) and follow this structure:
1. Inciting incident (protagonist arrives in small town)
2. Meet-cute or initial conflict
3. Growing connection/tension
4. Complication or misunderstanding
5. Resolution and romantic payoff

Keep it light, wholesome, and charming.`;

    // Build the user prompt
    const themeNote = input.adultThemed
      ? 'Add mature themes, subtle innuendo, and emotional complexity without explicit content. Think cable TV romance.'
      : 'Keep it wholesome and family-friendly.';

    const userPrompt = `Write a short Hallmark-style romantic comedy screenplay with these details:
- Protagonist: ${input.protagonistName}
- Setting: Small town called ${input.setting}
- Season/Time: ${input.season}
- Romantic Interest: ${input.romanticInterest}
- Tone: ${themeNote}

Format: Standard screenplay format. Make it engaging but brief.`;

    // Call OpenAI Chat Completions API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1200,
      temperature: 0.8,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const screenplay = completion.choices[0]?.message?.content ?? 'Failed to generate screenplay';

    return res.status(200).json({
      title: `${input.season} in ${input.setting}`.toUpperCase(),
      content: screenplay,
    });
  } catch (error) {
    console.error('Error generating screenplay:', error);
    return res.status(500).json({
      error: 'Failed to generate screenplay',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
