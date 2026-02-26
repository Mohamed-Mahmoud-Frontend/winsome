# Hotel Search Interface

A scalable, performance-optimized Hotel Search UI built with **Next.js 16** (App Router) and **TypeScript**. Implements a mock REST API for hotels, Google Maps integration with bounds-based loading, infinite scroll, and responsive layout.

## Setup and Run

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Go to Search** to open the search page.

### Environment (optional)

Create a `.env.local` file:

```env
# Use mock hotel data (no external API calls). Omit or set to 0 to use SearchApi.io.
USE_MOCK_HOTELS=1

# Google Maps: required for the map and markers. Get a key at https://console.cloud.google.com/
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

- **USE_MOCK_HOTELS=1**: Serves paginated mock data from `/api/hotels?use_mock=1`. No SearchApi.io key needed.
- **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**: If missing, the map area shows a short message and the list still works. See [docs/GOOGLE_MAPS_API_KEY.md](docs/GOOGLE_MAPS_API_KEY.md) for step-by-step instructions (Arabic + English).

### Build

```bash
npm run build
npm start
```

---

## Functional Overview

- **Search form**: Location, check-in/check-out dates, adults/children, Search button.
- **Hotel list**: Cards with image (lazy), name, price per night, rating, short description; infinite scroll.
- **Map**: Google Map with markers for visible hotels; moving/zooming updates bounds and refetches hotels for the new view.
- **Loading / errors**: Skeletons while loading, clear error state if the API fails.

---

## Architecture

### Folder structure

- **`app/`** – App Router: `layout`, `page`, `search/page`, `api/hotels`, `providers` (React Query).
- **`components/ui/`** – Reusable atoms: `Button`, `Input`, `Skeleton`.
- **`features/hotels/`** – Feature module:
  - **`api/hotelsApi.ts`** – API abstraction: `fetchHotels` (SearchApi.io) and `fetchHotelsPage` (mock paginated).
  - **`mocks/hotelMock.ts`** – Mock list + `getMockHotelsPaginated(page, limit, bounds)`.
  - **`store/searchStore.ts`** – Zustand store for search and map state.
  - **`hooks/useHotelsInfinite.ts`** – `useInfiniteQuery` for paginated hotels (keyed by bounds).
  - **`components/`** – `SearchForm`, `HotelCard`, `HotelCardSkeleton`, `HotelList`, `HotelsMap`, `SearchPageContent`.
- **`hooks/useDebounce.ts`** – `useDebounce` and `useDebouncedCallback` (used for map if needed later).
- **`services/apiClient.ts`** – Axios instance (`/api`), `createAbortController`, typed `get<T>()`.
- **`types/hotel.ts`** – Shared types (e.g. `HotelResult`, `MapBounds`, `Guests`).
- **`utils/cn.ts`** – `cn()` (clsx + tailwind-merge).

### Separation of concerns

- **UI**: Presentational components in `components/ui` and `features/hotels/components`.
- **State**: Zustand for client UI state (form + map); React Query for server state (hotels).
- **Data**: All HTTP via `apiClient` and `features/hotels/api`; API route at `app/api/hotels` (mock or proxy).

---

## State management

- **Zustand** (`useSearchStore`): Location, check-in/check-out, guests (adults/children), map center and **map bounds**. The list and map both react to the same bounds so that moving the map updates the store and refetches the list.
- **TanStack Query (React Query)**:
  - `useHotelsInfinite`: One `useInfiniteQuery` keyed by map bounds (and optional search params). Bounds change → new key → new fetch; scroll → `fetchNextPage`.
  - Caching and deduplication are handled by React Query; no manual cache layer.

---

## Performance considerations

- **Images**: `next/image` with `loading="lazy"` and `sizes` on hotel cards; Unsplash allowed in `next.config` `images.remotePatterns`.
- **List**: Infinite scroll via Intersection Observer on a sentinel; only a limited set of cards in the DOM.
- **Map**: Markers only for current `hotels`; bounds updated on map `idle` to avoid excessive requests during drag/zoom.
- **Re-renders**: Store selectors and stable query keys; list and map receive only the data they need.
- **API**: Single `/api/hotels` route; mock mode supports `page`, `limit`, and bounds so the client can paginate and filter by viewport without changing the backend surface.

---

## Trade-offs

- **Mock vs real API**: Mock is default (`USE_MOCK_HOTELS=1` or `use_mock=1`) to avoid API credits and simplify assessment. The same route can proxy to SearchApi.io when mock is off; client uses `fetchHotelsPage` for list and `fetchHotels` for a future “single search” flow if needed.
- **Map dependency**: Map requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Without it, the app still works with a placeholder and full list/mock behavior.
- **SSR**: Search page is client-rendered so that map and infinite query work without hydration issues; metadata is set via Next.js `metadata` for SEO. A future step could be SSR for the first page of results with the same API.
- **Guests**: Stored in Zustand and shown in the form; not sent to the mock API (structure is ready for a real backend that accepts guests).

---

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS
- TanStack Query v5, Zustand
- Axios, @react-google-maps/api
- clsx, tailwind-merge
