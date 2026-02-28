/**
 * Unit tests for SearchForm component.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchForm } from "../SearchForm";
import { useSearchStore } from "../../store/searchStore";

describe("SearchForm", () => {
  beforeEach(() => {
    useSearchStore.getState().setLocation("");
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    useSearchStore.getState().setDates(today, tomorrow);
    useSearchStore.getState().setGuests({ adults: 1, children: 0 });
  });

  it("renders location, dates, guests and search button", () => {
    render(<SearchForm />);
    expect(screen.getByPlaceholderText(/city or area/i)).toBeInTheDocument();
    const dateInputs = document.querySelectorAll('input[type="date"]');
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("updates store when user types location", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    const locationInput = screen.getByPlaceholderText(/city or area/i);
    await user.type(locationInput, "Cairo");
    expect(useSearchStore.getState().location).toBe("Cairo");
  });

  it("calls onSearch when search button is clicked", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchForm onSearch={onSearch} />);
    await user.click(screen.getByRole("button", { name: /search/i }));
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("disables search button when isLoading is true", () => {
    render(<SearchForm isLoading />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
