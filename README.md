# WeHire

Branded recruitment microsite platform for small businesses in Indonesia.

## Getting Started

### 1. Clone and install
```bash
git clone <repo>
cd wehire
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in the values (see comments in the file for instructions).

### 3. Run the dev server
```bash
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APPS_SCRIPT_URL` | Yes | Google Apps Script Web App deployment URL |
| `NEXT_PUBLIC_BASE_DOMAIN` | Prod only | Root domain for subdomain routing (e.g. `wehire.app`) |

For full setup details see `.env.example`.
