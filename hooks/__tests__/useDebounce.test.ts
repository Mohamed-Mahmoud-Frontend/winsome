/**
 * Unit tests for useDebounce hook.
 */
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("updates after delay when value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "first", delay: 500 } }
    );
    expect(result.current).toBe("first");

    rerender({ value: "second", delay: 500 });
    expect(result.current).toBe("first");

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("second");
  });

  it("resets timer when value changes again before delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    );
    rerender({ value: "b", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe("a");
    rerender({ value: "c", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe("a");
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe("c");
  });
});
