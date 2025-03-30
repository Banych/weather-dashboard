import CityInput from '@/components/CityInput.vue';
import { advanceTimerAgainstDebounce } from '@/utils/TestsUtils';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders input and label', () => {
    const wrapper = mount(CityInput);

    expect(wrapper.find('label[for="city"]')).toBeDefined();
    expect(wrapper.find('input[id="city"]')).toBeDefined();
  });

  it('displays loading state', async () => {
    const wrapper = mount(CityInput);

    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('Loading');

    await advanceTimerAgainstDebounce();

    expect(wrapper.find('ul').text()).toContain('Loading...');
  });

  it('displays error message', async () => {
    const wrapper = mount(CityInput);
    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('Error');

    await advanceTimerAgainstDebounce();

    expect(wrapper.find('ul').text()).toContain('Error: An error occurred');
  });

  it('displays search results', async () => {
    const wrapper = mount(CityInput);

    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('New');

    await advanceTimerAgainstDebounce();

    const results = wrapper.findAll('li');
    expect(results).toHaveLength(1);
    expect(results[0].text()).toContain('New York, USA');
  });

  it('emits "select" event when a city is selected', async () => {
    const wrapper = mount(CityInput);
    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('New');

    await advanceTimerAgainstDebounce();

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

    await advanceTimerAgainstDebounce();

    const result = wrapper.find('li');
    await result.trigger('click');
    expect((input.element as HTMLInputElement).value).toBe('New York');
  });

  it('resets the input when focused after a city is selected', async () => {
    const wrapper = mount(CityInput);
    const input = wrapper.find('input[placeholder="Enter city name"]');
    await input.setValue('New');

    await advanceTimerAgainstDebounce();

    const result = wrapper.find('li');
    await result.trigger('click');
    await input.trigger('focus');
    expect((input.element as HTMLInputElement).value).toBe('New York');
  });
});
