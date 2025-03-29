import CityInput from '@/components/CityInput.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { computed } from 'vue';

vi.mock('@/composables/useCitySearch', () => ({
  default: (query: any) => {
    const results = computed(() =>
      query.value === 'New' ? [{ id: 1, name: 'New York', country: 'USA' }] : []
    );
    const error = computed(() =>
      query.value === 'Error' ? 'An error occurred' : null
    );
    const isLoading = computed(() => query.value === 'Loading');
    return { results, error, isLoading };
  },
}));

describe('CityInput.vue', () => {
  it('renders input and label', () => {
    const wrapper = mount(CityInput);

    expect(wrapper.find('label[for="city"]')).toBeDefined();
    expect(wrapper.find('input[id="city"]')).toBeDefined();
  });

  it('displays loading state', async () => {
    const wrapper = mount(CityInput);

    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('Loading');

    expect(wrapper.find('ul').text()).toContain('Loading...');
  });

  it('displays error message', async () => {
    const wrapper = mount(CityInput);
    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('Error');

    expect(wrapper.find('ul').text()).toContain('Error: An error occurred');
  });

  it('displays search results', async () => {
    const wrapper = mount(CityInput);

    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('New');

    const results = wrapper.findAll('li');
    expect(results).toHaveLength(1);
    expect(results[0].text()).toContain('New York, USA');
  });

  it('emits "select" event when a city is selected', async () => {
    const wrapper = mount(CityInput);
    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('New');
    const result = wrapper.find('li');
    await result.trigger('click');
    expect(wrapper.emitted('select')).toBeDefined();
    expect(wrapper.emitted('select')![0]).toEqual([
      { id: 1, name: 'New York', country: 'USA' },
    ]);
  });

  it('put city name into the input when a city is selected', async () => {
    const wrapper = mount(CityInput);
    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('New');
    const result = wrapper.find('li');
    await result.trigger('click');
    expect((input.element as HTMLInputElement).value).toBe('New York');
  });

  it('resets the input when focused after a city is selected', async () => {
    const wrapper = mount(CityInput);
    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('New');
    const result = wrapper.find('li');
    await result.trigger('click');
    await input.trigger('focus');
    expect((input.element as HTMLInputElement).value).toBe('New York');
  });
});
