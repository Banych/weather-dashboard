import { describe, it, expect, vi, beforeEach } from 'vitest';
import useGeolocation from '@/composables/useGeolocation';

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should set error if geolocation is not supported', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });

    const { getLocation, error, isLoading } = useGeolocation();

    await getLocation();

    expect(error.value).toBe('Geolocation is not supported by this browser.');
    expect(isLoading.value).toBe(false);
  });

  it('should resolve with coordinates when geolocation succeeds', async () => {
    const mockCoords = { latitude: 10, longitude: 20 };
    const mockGetCurrentPosition = vi.fn((success: PositionCallback) => {
      success({ coords: mockCoords } as GeolocationPosition);
    });

    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition: mockGetCurrentPosition },
      writable: true,
    });

    const { getLocation, error, isLoading } = useGeolocation();

    const result = await getLocation();

    expect(result).toEqual(mockCoords);
    expect(error.value).toBeNull();
    expect(isLoading.value).toBe(false);
  });

  it('should set error if geolocation fails', async () => {
    const mockError = { message: 'User denied Geolocation' };
    const mockGetCurrentPosition = vi.fn((_, error: PositionErrorCallback) => {
      error(mockError as GeolocationPositionError);
    });

    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition: mockGetCurrentPosition },
      writable: true,
    });

    const { getLocation, error, isLoading } = useGeolocation();

    await expect(getLocation()).rejects.toEqual(mockError);
    expect(error.value).toBe(mockError.message);
    expect(isLoading.value).toBe(false);
  });
});
