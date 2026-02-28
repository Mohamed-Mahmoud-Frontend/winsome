🏨 Hotel Search Interface

Scalable, performance-optimized hotel search platform built with Next.js and TypeScript.

📌 Overview

This project implements a production-grade Hotel Search Interface with interactive Google Maps integration, infinite scrolling, efficient server-state management, and optimized rendering strategies.

The goal was to design a clean, modular, and scalable architecture that reflects senior-level frontend engineering practices.

🚀 Live Features
🔎 Search Interface

Location input with geocoding (Nominatim)

Check-in / Check-out date picker

Guests selector (adults / children)

Responsive and production-ready UI

“Search on Map” experience

🏨 Search Results

Reusable hotel cards

Image (lazy-loaded)

Name

Price per night

Rating

Short description

Infinite scroll

Skeleton loading states

User-friendly empty and error states

🗺 Google Maps Integration

All visible hotels rendered as markers

Dynamic data fetching based on map bounds

Smooth synchronization between map viewport and results list

Efficient marker rendering to prevent unnecessary re-renders

🏨 Hotel Details Page (/hotels/[id])

Image slider

Pricing breakdown

Amenities

Reviews section

Recommended hotels

ISR (Incremental Static Regeneration) — revalidated every 60 seconds

🏗 Architecture

The project follows a feature-based modular architecture with strict separation of concerns.

app/
features/
components/
core/services/
hooks/
types/
utils/
🔹 Architectural Decisions
Why React Query?

Server-state management

Automatic caching

Infinite pagination support

Background refetching

Optimized network usage

React Query is used strictly for server state, keeping client state isolated.

Why Zustand?

Lightweight global state management

Minimal boilerplate

Ideal for UI-level state (filters, bounds, search params)

Avoids unnecessary coupling with server state

This clean separation prevents state pollution and improves maintainability.

API Abstraction Layer

All API calls are isolated inside a dedicated service layer.

Benefits:

Easy testing

Replaceable data source (Mock / SearchApi)

Centralized error handling

Clear separation from UI

Dual Data Mode

The system supports:

Mock REST API (default)

Real Google Hotels data via SearchApi.io

Environment-controlled toggle:

USE_MOCK_HOTELS=0
SEARCHAPI_KEY=your_key

This ensures flexibility without modifying business logic.

⚡ Performance Optimization

Performance was treated as a primary concern.

Implemented Strategies

useInfiniteQuery for efficient pagination

Lazy-loaded images

Memoized hotel cards

Debounced geocoding requests

Map bounds-based fetching

Controlled marker re-renders

Optimized React Query cache strategy

ISR for hotel details page

Dynamic imports where appropriate

Lighthouse Optimization

The project structure and optimizations target 90%+ performance score:

Optimized image loading

Reduced unnecessary re-renders

Controlled data fetching

Minimal client-side JS where possible

🌍 SEO Optimization

Dynamic metadata using Next.js App Router

Optimized page titles per hotel

Structured URL patterns

ISR for better crawlability

Clean semantic markup

🧪 Testing

Unit tests implemented using:

Jest

React Testing Library

Covered examples:

HotelCard rendering

Search form behavior

Component interaction logic

Run tests:

npm test
npm run test:watch
🔐 Security

Configured HTTP security headers:

X-Frame-Options: DENY

X-Content-Type-Options: nosniff

Referrer-Policy: strict-origin-when-cross-origin

Cross-Origin-Opener-Policy: same-origin

📦 Tech Stack
Technology	Purpose
Next.js 16	Framework & App Router
React 19	UI layer
TypeScript	Type safety
Tailwind CSS 4	Styling
Zustand	Client state
TanStack React Query	Server state
Axios	HTTP abstraction
@react-google-maps/api	Maps integration
react-hot-toast	UX feedback
Jest + RTL	Testing
⚖ Trade-offs & Engineering Decisions

Client-side data fetching chosen for dynamic map-bound updates.

ISR used instead of full SSR to reduce API load.

Google Maps selected over lightweight alternatives for better ecosystem compatibility.

Mock-first architecture to ensure development independence from third-party API quotas.

📡 API Endpoints
GET /api/hotels

Returns paginated hotel results.

Response:

{
  results,
  nextPage,
  total
}
GET /api/hotels/[id]

Returns single hotel + recommended hotels.

GET /api/geocode?q=location

Returns:

{
  lat,
  lng,
  bounds
}
⚙️ Setup
Requirements

Node.js (LTS)

npm

Installation
npm install
Environment Variables (.env.local)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
SEARCHAPI_KEY=
USE_MOCK_HOTELS=
NEXT_PUBLIC_APP_URL=
Development
npm run dev
Production
npm run build
npm start
📈 Scalability Considerations

The architecture supports:

API provider replacement

Feature expansion (sorting, price breakdown, bookings)

SSR migration if required

Edge deployment compatibility

Rate-limiting & caching layer addition

🧠 Summary

This implementation demonstrates:

Clean scalable architecture

Strong separation of concerns

Advanced state management

Performance-first mindset

Production-ready UX

Maintainable and testable codebase