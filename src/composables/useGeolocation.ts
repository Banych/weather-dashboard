import { ref } from 'vue';

export default () => {
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const getLocation = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.');
      }

      return new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position.coords);
          },
          (err) => {
            error.value = err.message;
            reject(err);
          }
        );
      });
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    getLocation,
    isLoading,
    error,
  };
};
