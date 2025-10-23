import { renderHook, act } from '@testing-library/react';
import useDebounce from '../useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });
    
    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  it('cancels previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'first' } }
    );

    rerender({ value: 'second' });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: 'third' });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should still be 'first' because we haven't waited full 500ms
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Now should be 'third' (the last value)
    expect(result.current).toBe('third');
  });

  it('uses custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 1000),
      { initialProps: { value: 'test' } }
    );

    rerender({ value: 'updated' });

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('test');

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated');
  });

  it('handles different data types', () => {
    const { result: numberResult } = renderHook(() => useDebounce(42, 500));
    expect(numberResult.current).toBe(42);

    const { result: objectResult } = renderHook(() => 
      useDebounce({ name: 'test' }, 500)
    );
    expect(objectResult.current).toEqual({ name: 'test' });

    const { result: arrayResult } = renderHook(() => 
      useDebounce([1, 2, 3], 500)
    );
    expect(arrayResult.current).toEqual([1, 2, 3]);
  });
});
