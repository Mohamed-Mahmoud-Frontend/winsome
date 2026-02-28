import type { Metadata } from "next";
import { SearchPageContent } from "@/features/hotels/components/SearchPageContent";

export const metadata: Metadata = {
  title: "Search Hotels | Hotel Search",
  description:
    "Search and compare hotels. View results on the map, filter by dates and guests, and find the best deals.",
  openGraph: {
    title: "Search Hotels | Hotel Search",
    description: "Search and compare hotels. View results on the map.",
  },
};

export default function SearchPage() {
  return <SearchPageContent />;
}
