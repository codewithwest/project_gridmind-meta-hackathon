# GridMind — Meta Hackathon

GridMind is a prototype energy-intelligence web app for homes and small farms. It combines a visual energy dashboard, transparent sample calculations, and a server-side Meta Model API advisor.

> **Demo disclaimer:** Dashboard values are illustrative sample data, not live measurements, verified equipment ratings, electrical design advice, or safety certification.

## Setup

Requirements: Node.js 20.9+, npm, and Meta Model API access.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `MODEL_API_KEY` in `.env.local`. Never commit secrets or expose API keys with a `NEXT_PUBLIC_` prefix. Open http://localhost:3000.

## Environment

- `MODEL_API_KEY`: server-side API key
- `META_MODEL`: model ID configured for your account
- `META_API_BASE_URL`: API base URL configured for your account

The starter defaults to `https://api.meta.ai/v1` and `muse-spark-1.3`; verify current model IDs and API compatibility in the official docs before relying on them.

## API

`POST /api/energy-advisor` accepts JSON such as `{ "question": "What should I check before running the pump longer?" }`. The server validates the input and passes illustrative sample system context to the configured model. Provider errors and credentials are not returned to the browser.

## Safety and security

- The dashboard uses illustrative values only; it is not connected to live equipment.
- Model output is not electrical safety advice or a substitute for a qualified installer.
- Confirm equipment ratings and relevant local codes before real-world decisions.
- Add rate limiting and quotas before public launch.
- `.env.local` is ignored by Git; `.env.example` contains no secrets.

## Hackathon contributions

This repository is dedicated to the GridMind hackathon implementation and is separate from other projects. Planned additions include equipment photo intake, SAM 3.1 segmentation overlays, and a deterministic what-if simulator. Reused third-party code or assets must have compatible licences and attribution.

## Official references

- https://dev.meta.ai/docs/overview
- https://dev.meta.ai/docs/quickstart
- https://nextjs.org/docs
