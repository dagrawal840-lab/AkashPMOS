import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key === 'REPLACE_ME') {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }
  return new Anthropic({ apiKey: key });
}

export async function generateQSRBrief(): Promise<string> {
  const client = getClient();

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content:
          'You are a QSR industry analyst. Summarize what is happening in the QSR (quick service restaurant) industry this week and what should Yum Brands (owner of KFC, Pizza Hut, Taco Bell) watch competitively. Focus on: competitor moves, consumer trends, macro pressures (inflation, labor costs), and any notable openings or closures. Be concise — 3-4 paragraphs max. Do not fabricate specific data points; note where data would be needed.',
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude');
  return block.text;
}
