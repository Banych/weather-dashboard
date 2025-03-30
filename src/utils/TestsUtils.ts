import { DEBOUNCE_TIME } from '@/constants/DebounceConstants';
import { flushPromises } from '@vue/test-utils';
import { vi } from 'vitest';

export const advanceTimerAgainstDebounce = async () => {
  vi.advanceTimersByTime(DEBOUNCE_TIME);
  await flushPromises();
};
