import CoordinatesInput from '@/components/CoordinatesInput.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/composables/useGeolocation', () => ({
  default: () => {
    return {
      getLocation: vi.fn(() => {
        return Promise.resolve({
          latitude: 40.7128,
          longitude: -74.006,
        });
      }),
      error: null,
      isLoading: false,
    };
  },
}));

describe('CoordinatesInput.vue', () => {
  it('renders inputs and labels for coordinates', () => {
    const wrapper = mount(CoordinatesInput, {
      props: {
        currentLocation: null,
      },
    });

    expect(wrapper.find('input[id="latitude"]').exists()).toBe(true);
    expect(wrapper.find('input[id="longitude"]').exists()).toBe(true);
  });

  it('emits coordinates when input values change', async () => {
    const wrapper = mount(CoordinatesInput, {
      props: {
        currentLocation: null,
      },
    });
    const latitudeInput = wrapper.find('input[id="latitude"]');
    const longitudeInput = wrapper.find('input[id="longitude"]');

    await latitudeInput.setValue('40.7128');
    await wrapper.setProps({
      currentLocation: { latitude: 40.7128, longitude: 0 },
    });
    await longitudeInput.setValue('-74.0060');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted()).toHaveProperty('update:location');
    expect(wrapper.emitted()['update:location'][0]).toEqual([
      { latitude: 40.7128, longitude: 0 },
    ]);
    expect(wrapper.emitted()['update:location'][1]).toEqual([
      { latitude: 40.7128, longitude: -74.006 },
    ]);
  });

  it('emits current location when the button is clicked', async () => {
    const wrapper = mount(CoordinatesInput, {
      props: {
        currentLocation: null,
      },
    });
    const button = wrapper.find('button');

    await button.trigger('click');

    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted()).toHaveProperty('update:location');
    expect(wrapper.emitted()['update:location'][0]).toEqual([
      { latitude: 40.7128, longitude: -74.006 },
    ]);
  });

  it('longitude and latitude inputs are filled with location from props', async () => {
    const wrapper = mount(CoordinatesInput, {
      props: {
        currentLocation: null,
      },
    });

    const latitudeInput = wrapper.find('input[id="latitude"]');
    const longitudeInput = wrapper.find('input[id="longitude"]');

    await wrapper.setProps({
      currentLocation: { latitude: 40.7128, longitude: -74.006 },
    });
    await wrapper.vm.$nextTick();

    expect((latitudeInput.element as HTMLInputElement).value).toBe('40.7128');
    expect((longitudeInput.element as HTMLInputElement).value).toBe('-74.006');
  });
});
