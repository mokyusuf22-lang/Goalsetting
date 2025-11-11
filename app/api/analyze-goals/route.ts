import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { answers, questions } = await req.json();

    // Construct a comprehensive prompt for the GPT model
    const prompt = `
      You are an AI assistant tasked with analyzing user responses from a questionnaire to generate insights into their goals, motivations, and current barriers.

      Here are the user's responses:

      ${Object.keys(answers).map(key => {
        const question = questions.find((q: any) => q.id === parseInt(key));
        return question ? `${question.title}: ${answers[key]}` : '';
      }).filter(Boolean).join('\n')}

      Based on these responses, provide a friendly, human-readable, and concise analysis (2-3 paragraphs max) covering:
      1. Their current life situation (e.g., financially stable but seeking personal growth).
      2. Their likely focus area (e.g., "career development," "financial stability," "mental wellbeing," "community engagement").
      3. A possible goal or next direction (e.g., "stabilize finances before pursuing training," "build confidence and social support," "explore new career paths").
    `;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // You can use 'gpt-4' or other models if available
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300, // Adjust as needed for the desired output length
      temperature: 0.7, // Controls randomness: lower for more focused, higher for more creative
    });

    const analysis = chatCompletion.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json({ error: 'Failed to generate analysis.' }, { status: 500 });
  }
}
