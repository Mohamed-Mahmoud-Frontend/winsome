/**
 * Unit tests for HotelCard component.
 */
import { render, screen } from "@testing-library/react";
import { HotelCard } from "../HotelCard";
import type { HotelResult } from "@/types/hotel";

const mockHotel: HotelResult = {
  title: "Test Hotel",
  link: "https://example.com",
  thumbnail: "https://example.com/img.jpg",
  rating: 4.5,
  reviews: 100,
  price: { amount: 99, currency: "USD", period: "night" },
  description: "A nice place to stay",
};

describe("HotelCard", () => {
  it("renders hotel title, rating, price and description", () => {
    render(<HotelCard hotel={mockHotel} />);
    expect(screen.getByText("Test Hotel")).toBeInTheDocument();
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    expect(screen.getByText(/99/)).toBeInTheDocument();
    expect(screen.getByText("A nice place to stay")).toBeInTheDocument();
  });

  it("links to detail page when place_id is present", () => {
    const hotelWithPlaceId = { ...mockHotel, place_id: "ChIJxxx" };
    render(<HotelCard hotel={hotelWithPlaceId} />);
    const link = screen.getByRole("link", { name: /test hotel/i });
    expect(link).toHaveAttribute("href", "/hotels/ChIJxxx");
  });

  it("shows external link when place_id is absent", () => {
    render(<HotelCard hotel={mockHotel} />);
    const link = screen.getByRole("link", { name: /test hotel/i });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders without rating when rating is undefined", () => {
    const hotelNoRating = { ...mockHotel, rating: undefined, reviews: undefined };
    render(<HotelCard hotel={hotelNoRating} />);
    expect(screen.getByText("Test Hotel")).toBeInTheDocument();
    expect(screen.queryByText(/4\.5/)).not.toBeInTheDocument();
  });

  it("renders No image when thumbnail is missing", () => {
    const hotelNoThumb = { ...mockHotel, thumbnail: undefined };
    render(<HotelCard hotel={hotelNoThumb} />);
    expect(screen.getByText("No image")).toBeInTheDocument();
  });
});
