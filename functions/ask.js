const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  }

  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
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

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt || 'You are a kind, thoughtful listener.' },
        { role: 'user', content: question }
      ],
      max_tokens: 600,
      temperature: 0.7
    })
  });

  const data = await openaiRes.json();

  if (!openaiRes.ok) {
    return new Response(JSON.stringify({ error: data.error?.message || 'OpenAI API error' }), {
      status: openaiRes.status,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  return new Response(JSON.stringify({ answer: data.choices[0].message.content.trim() }), {
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}
