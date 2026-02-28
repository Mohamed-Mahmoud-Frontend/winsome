# 🏨 Hotel Search

Hotel search with Google Maps, infinite scroll, and real or mock data. Built with Next.js 16, React 19, TypeScript, Tailwind.

## Features

- **Search:** Location (Nominatim geocoding), dates, guests. Results as cards with image, price, rating, infinite scroll.
- **Map:** Hotels as markers; data loads by map bounds. Map loads after first user interaction (for performance).
- **Detail page** `/hotels/[id]`: Image slider, pricing, amenities, reviews, recommended. ISR 60s.

## Data: Real vs Mock

- **Real:** Set `SEARCHAPI_KEY` in `.env.local` → Google Hotels via [SearchApi.io](https://www.searchapi.io/).
- **Mock:** Omit the key, or set `USE_MOCK_HOTELS=1` to force mock.

## Setup

```bash
npm install
```

**.env.local**

| Variable | Description |
|---------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JS API key |
| `SEARCHAPI_KEY` | SearchApi.io key (omit for mock) |
| `USE_MOCK_HOTELS` | `1` = force mock |

```bash
npm run dev    # development
npm run build && npm start   # production
```

## API

- **GET /api/hotels** — Paginated results. Real: `q`, `check_in_date`, `check_out_date`, `adults` (+ optional `next_page_token`, bounds). Mock: `page`, `limit`.
- **GET /api/hotels/[id]** — One hotel + recommended. Uses SearchApi when key set, else mock.
- **GET /api/geocode?q=...** — Nominatim. Returns `{ lat, lng, bounds }`.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind · Zustand · TanStack Query · Axios · @react-google-maps/api · Jest + RTL

## Scripts

- `npm test` / `npm run test:watch` — Tests
- Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, COOP
