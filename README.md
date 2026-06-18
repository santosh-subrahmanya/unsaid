# Unsaid

Everything you couldn't say — now you can.

A fully anonymous, zero-trace confessional where you can ask anything and get a kind, specific, calibrated response. No accounts. No tracking. No storage.

## Deploy

1. Get an OpenAI API key at https://platform.openai.com/api-keys
2. In the OpenAI dashboard, restrict the key to your domain:
   https://platform.openai.com/account/api-keys → "Restrict to domain" → enter `*.yoursite.com`
3. Open `index.html` and replace `REPLACE_ME` with your API key
4. Deploy to Cloudflare Pages:
   - Drag the folder onto https://dash.cloudflare.com → Pages → Create → Direct Upload
   - Or connect a GitHub repo

## Cost

- Hosting: $0 (Cloudflare Pages free tier)
- AI: ~$0.001 per answer (gpt-4o-mini)
- Domain: ~$10/year
