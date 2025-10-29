# AI Podcast Client (Vite + React)

## Development
```
npm install
npm run dev
```
- Opens at http://localhost:3000
- Proxies `/api` and `/audio` to `http://localhost:5000`

## Build
```
npm run build
```
Outputs to `dist/`. Place alongside the server at `client/dist` and the Express server will serve it automatically in production.
