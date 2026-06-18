const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SYSTEM_PROMPT = `You are a kind, thoughtful, and completely non-judgmental listener. Someone has come to you with something they cannot say anywhere else — a fear, a shame, a question, a secret.

Your job is not to fix them. It is to:

1. Let them feel heard. Acknowledge the weight of what they're sharing.
2. Give a grounded, specific, compassionate response. If there's a real answer, give it honestly. If the answer is uncertain, say so clearly.
3. Never minimize their concern. Never be dismissive. Never be vague or platitudinous.
4. If the situation involves harm, offer concrete resources (helplines, professionals) calmly and without alarm.

You write in short, natural paragraphs. You sound like a wise friend, not a textbook. You never ask for personal information. You never recommend a specific product or brand. You never break character.`;

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  }

  if (!env.AI) {
    return new Response(JSON.stringify({ error: 'not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  }

  const { question, systemPrompt } = body;
  if (!question) {
    return new Response(JSON.stringify({ error: 'Missing question' }), { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  }

  try {
    const result = await env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt || SYSTEM_PROMPT },
        { role: 'user', content: question }
      ],
      max_tokens: 600,
      temperature: 0.7
    });

    const answer = result.response?.trim();
    if (!answer) {
      return new Response(JSON.stringify({ error: 'Empty response' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    return new Response(JSON.stringify({ answer }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'AI error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}
