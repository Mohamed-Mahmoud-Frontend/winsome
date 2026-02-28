export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  ne: GeoCoordinates;
  sw: GeoCoordinates;
}

export interface HotelPrice {
  amount: number;
  currency: string;
  period?: string;
  total?: number;
}

/** توزيع التقييمات: عدد المراجعات لكل مستوى star (1–5) */
export interface RatingBreakdown {
  1?: number;
  2?: number;
  3?: number;
  4?: number;
  5?: number;
}

export interface HotelReview {
  text: string;
  author?: string;
  rating?: number;
  date?: string;
}

export interface HotelResult {
  title: string;
  link: string;
  displayed_link?: string;
  thumbnail?: string;
  position?: number;
  rating?: number;
  reviews?: number;
  /** توزيع التقييمات (عدد المراجعات لكل star) */
  rating_breakdown?: RatingBreakdown;
  /** نصوص المراجعات للعرض في صفحة التفاصيل */
  review_list?: HotelReview[];
  price?: HotelPrice;
  type?: string;
  description?: string;
  address?: string;
  place_id?: string;
  latitude?: number;
  longitude?: number;
  extensions?: string[];
  images?: string[];
}

export interface SearchMetadata {
  id: string;
  status: string;
  created_at: string;
  processed_at: string;
  total_time_taken: number;
  engine_url: string;
  google_hotels_url?: string;
}

export interface SearchApiHotelsResponse {
  search_metadata: SearchMetadata;
  search_parameters: SearchParameters;
  hotels_results?: HotelResult[];
  organic_results?: HotelResult[];
  serpapi_pagination?: {
    next?: string;
    current?: number;
  };
  error?: string;
}

export interface SearchParameters {
  engine: string;
  q?: string;
  check_in_date?: string;
  check_out_date?: string;
  gl?: string;
  hl?: string;
  currency?: string;
  ll?: string;
  start?: number;
}

export interface Guests {
  adults: number;
  children: number;
}

export interface HotelSearchState {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: Guests;
  mapCenter: GeoCoordinates;
  mapBounds: MapBounds | null;
  setLocation: (location: string) => void;
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (guests: Guests) => void;
  setMapCenter: (center: GeoCoordinates) => void;
  setMapBounds: (bounds: MapBounds | null) => void;
}
