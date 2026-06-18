# Unsaid

Everything you couldn't say — now you can.

A fully anonymous, zero-trace confessional where you can ask anything and get a kind, specific, calibrated response. No accounts. No tracking. No storage.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to https://dash.cloudflare.com → Pages → Create a project → Connect to Git
3. Select the repo
4. Build settings: Framework = **None**, Build output = leave as `/`
5. Under **Environment variables (advanced)**, add:
   - `OPENAI_API_KEY` = your OpenAI API key
6. Deploy

## Cost

- Hosting: $0 (Cloudflare Pages free tier — 100k requests/day)
- AI: ~$0.001 per answer (gpt-4o-mini)
- Domain: ~$10/year
