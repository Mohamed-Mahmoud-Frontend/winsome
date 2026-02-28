import type { HotelResult, HotelReview } from "@/types/hotel";
import { slugify } from "@/utils/slug";

const MOCK_REVIEWS: Record<string, HotelReview[]> = {
  "ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QAQ": [
    { text: "غرف مريحة وفطور ممتاز. الموظفون لطيفون جداً.", author: "أحمد م.", rating: 4, date: "2024-01-15" },
    { text: "Great location and clean rooms. Would stay again.", author: "Sarah K.", rating: 4, date: "2024-02-01" },
    { text: "الإفطار المتوسطي رائع والخدمة سريعة.", author: "محمد ع.", rating: 5, date: "2024-02-10" },
    { text: "Quiet at night, good value for money.", author: "John D.", rating: 3, date: "2024-01-28" },
  ],
  "ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QBQ": [
    { text: "فندق بوتيك أنيق، مناسب للعائلات.", author: "فاطمة س.", rating: 5, date: "2024-02-05" },
    { text: "Modern design and friendly staff. Highly recommend.", author: "Emma L.", rating: 4, date: "2024-01-20" },
    { text: "البار في الطابق العلوي جميل والمنظر رائع.", author: "خالد أ.", rating: 4, date: "2024-02-12" },
  ],
  "ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QCQ": [
    { text: "قريب من المترو، عملي جداً.", author: "نورا ح.", rating: 4, date: "2024-01-18" },
    { text: "Clean and comfortable. Good for a short stay.", author: "Mike R.", rating: 4, date: "2024-02-08" },
    { text: "الغرف بسيطة لكن مرتبة والسعر معقول.", author: "يوسف م.", rating: 3, date: "2024-02-14" },
  ],
  "ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QDQ": [
    { text: "تجربة فاخرة، الصالة الرياضية والطعام ممتازان.", author: "سارة إ.", rating: 5, date: "2024-02-02" },
    { text: "Best hotel in the area. Full service as expected.", author: "David W.", rating: 5, date: "2024-01-25" },
    { text: "المطعم يقدم أطباق متنوعة والخدمة ممتازة.", author: "علي ب.", rating: 4, date: "2024-02-11" },
    { text: "Great for business trips. Fast Wi-Fi and quiet rooms.", author: "Lisa M.", rating: 4, date: "2024-01-30" },
  ],
  "ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QEQ": [
    { text: "مثالي للمسافرين من المطار، التوصيلة سريعة.", author: "عمرو ت.", rating: 5, date: "2024-02-06" },
    { text: "Convenient for JFK. Breakfast was good.", author: "Chris P.", rating: 4, date: "2024-01-22" },
    { text: "غرف واسعة وإفطار مجاني مميز.", author: "هند ك.", rating: 4, date: "2024-02-15" },
    { text: "Good value near airport. Shuttle on time.", author: "Anna B.", rating: 4, date: "2024-01-12" },
  ],
};

const MOCK_LIST: HotelResult[] = [
  {
    title: "The Andrew Hotel",
    link: "http://www.andrewhotel.com/",
    address: "New York, US",
    description: "Plush, modern quarters & an Mediterranean restaurant/bar, plus free breakfast & Wi-Fi.",
    extensions: ["Free breakfast", "Free Wi‑Fi", "Parking ($)", "Air conditioning", "Pet-friendly", "Bar"],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
    latitude: 40.788177,
    longitude: -73.725245,
    place_id: "ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QAQ",
    position: 1,
    price: { amount: 113, currency: "USD", period: "night" },
    rating: 3.9,
    reviews: 1133,
    rating_breakdown: { 1: 23, 2: 45, 3: 283, 4: 453, 5: 329 },
    review_list: MOCK_REVIEWS["ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QAQ"],
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    type: "hotel",
  },
  {
    title: "The One Boutique Hotel",
    link: "http://theone-ny.com/",
    address: "New York, US",
    description: "Boutique stay with modern amenities.",
    extensions: ["Free Wi‑Fi", "Bar"],
    latitude: 40.7834,
    longitude: -73.9662,
    place_id: "ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QBQ",
    position: 2,
    price: { amount: 145, currency: "USD", period: "night" },
    rating: 4.2,
    reviews: 892,
    rating_breakdown: { 1: 9, 2: 27, 3: 125, 4: 357, 5: 374 },
    review_list: MOCK_REVIEWS["ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QBQ"],
    thumbnail: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
    type: "hotel",
  },
  {
    title: "Sky Hotel Flushing",
    link: "http://skyhotelny.com/",
    address: "New York, US",
    description: "Comfortable rooms near transit.",
    extensions: ["Free Wi‑Fi", "Parking"],
    latitude: 40.7654,
    longitude: -73.8301,
    place_id: "ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QCQ",
    position: 3,
    price: { amount: 99, currency: "USD", period: "night" },
    rating: 4.0,
    reviews: 456,
    rating_breakdown: { 1: 14, 2: 23, 3: 91, 4: 182, 5: 146 },
    review_list: MOCK_REVIEWS["ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QCQ"],
    thumbnail: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
    type: "hotel",
  },
  {
    title: "The Roslyn, Tapestry Collection by Hilton",
    link: "https://www.hilton.com/",
    address: "New York, US",
    description: "Upscale stay with full service.",
    extensions: ["Free Wi‑Fi", "Gym", "Restaurant"],
    latitude: 40.8012,
    longitude: -73.6501,
    place_id: "ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QDQ",
    position: 4,
    price: { amount: 189, currency: "USD", period: "night" },
    rating: 4.5,
    reviews: 1203,
    rating_breakdown: { 1: 6, 2: 12, 3: 72, 4: 361, 5: 752 },
    review_list: MOCK_REVIEWS["ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QDQ"],
    thumbnail: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400",
    type: "hotel",
  },
  {
    title: "Holiday Inn Express Jamaica - Jfk Airtrain",
    link: "https://www.ihg.com/",
    address: "New York, US",
    description: "Convenient for airport and city.",
    extensions: ["Free breakfast", "Free Wi‑Fi", "Airport shuttle"],
    latitude: 40.6912,
    longitude: -73.7901,
    place_id: "ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QEQ",
    position: 5,
    price: { amount: 129, currency: "USD", period: "night" },
    rating: 4.1,
    reviews: 2104,
    rating_breakdown: { 1: 42, 2: 63, 3: 252, 4: 841, 5: 906 },
    review_list: MOCK_REVIEWS["ChgIhoDLm9qdqrjDARoLL2cvMXRoZjloMG0QEQ"],
    thumbnail: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
    type: "hotel",
  },
];

export interface MockHotelsResponse {
  results: HotelResult[];
  nextPage: number | null;
  total: number;
}

export interface MockHotelsParams {
  page?: number;
  limit?: number;
  sw_lat?: number;
  sw_lng?: number;
  ne_lat?: number;
  ne_lng?: number;
}

export function getMockHotelsPaginated(params: MockHotelsParams): MockHotelsResponse {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(20, Math.max(5, params.limit ?? 10));
  let list = MOCK_LIST;
  if (params.sw_lat != null && params.ne_lat != null && params.sw_lng != null && params.ne_lng != null) {
    list = list.filter((h) => {
      const lat = h.latitude;
      const lng = h.longitude;
      if (lat == null || lng == null) return true;
      return lat >= params.sw_lat! && lat <= params.ne_lat! && lng >= params.sw_lng! && lng <= params.ne_lng!;
    });
  }
  const total = list.length;
  const start = (page - 1) * limit;
  const results = list.slice(start, start + limit);
  const nextPage = start + results.length < total ? page + 1 : null;
  return { results, nextPage, total };
}

export function getHotelById(placeIdOrSlug: string): HotelResult | null {
  const byId = MOCK_LIST.find((h) => h.place_id === placeIdOrSlug);
  if (byId) return byId;
  const bySlug = MOCK_LIST.find((h) => slugify(h.title) === placeIdOrSlug);
  return bySlug ?? null;
}

export function getFirstMockHotel(): HotelResult {
  return MOCK_LIST[0];
}

export function getRecommendedHotels(current: HotelResult, limit = 4): HotelResult[] {
  return MOCK_LIST.filter((h) => h.place_id !== current.place_id).slice(0, limit);
}
