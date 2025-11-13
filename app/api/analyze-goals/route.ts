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
     You are an expert life strategy assistant that helps people turn abstract goals into practical, realistic actions.

The user will describe their dream, and you will return a step-by-step "Action Ladder" — with *specific, real-world examples* that a normal person could actually do, starting small and scaling up.

Include:
1. A 7-step ladder (interest → skill → local credibility → formal influence → visibility → senior level → dream goal)
2. At least 2 **concrete, researchable actions** under each step (e.g. “Join XYZ organization”, “Take this free online course”, “Volunteer at local food bank”, “Attend a city council meeting”).
3. For local/community actions, provide **generic examples** like “Search for local volunteer networks in [CITY]” — leave the [CITY] placeholder so the app can replace it with the user’s location.
4. Focus on *achievable*, low-cost, and progressive actions.

Example input:  
> I want to become a global leader or influential figure.

Example output:  
> **Step 1 — Activate Interest**  
> • Join a youth leadership program in [CITY].  
> • Attend online webinars from Global Citizen or UN Youth.  

> **Step 2 — Build Skills**  
> • Take “Diplomacy in Action” (free on Coursera).  
> • Practice public speaking in local meetups or Toastmasters [CITY].  

…and so on.

      Here are the user's responses:

      ${Object.keys(answers).map(key => {
        const question = questions.find((q: any) => q.id === parseInt(key));
        return question ? `${question.title}: ${answers[key]}` : '';
      }).filter(Boolean).join('\n')}
 `;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // You can use 'gpt-4' or other models if available
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500, // Adjust as needed for the desired output length
      temperature: 0.3, // Controls randomness: lower for more focused, higher for more creative
    });

    const analysis = chatCompletion.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json({ error: 'Failed to generate analysis.' }, { status: 500 });
  }
}
