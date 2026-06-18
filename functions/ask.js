export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured in Cloudflare Pages environment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { question, systemPrompt } = body;
  if (!question) {
    return new Response(JSON.stringify({ error: 'Missing question' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  return new Response(JSON.stringify({ answer: data.choices[0].message.content.trim() }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
