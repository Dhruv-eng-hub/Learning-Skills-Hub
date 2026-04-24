# Learning Skills Hub

## Run locally (frontend + backend)

This repo includes:

- **Frontend**: Vite + React
- **Backend**: Express API at `http://localhost:5000/api`
- **Dev proxy**: Vite proxies `/api` → `http://localhost:5000`

### Install

```bash
npm install
```

### Start (recommended)

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

### Optional: point frontend to a different backend

The frontend uses `VITE_API_BASE_URL` (defaults to `/api`).

PowerShell:

```bash
$env:VITE_API_BASE_URL="http://localhost:5000/api"
```
