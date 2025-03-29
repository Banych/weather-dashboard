import { format, subDays } from 'date-fns';

export const MAX_END_DATE = subDays(new Date(), 2);
export const MAX_END_DATE_FORMATTED = format(MAX_END_DATE, 'yyyy-MM-dd');
export const MAX_START_DATE = subDays(new Date(), 7);
export const MAX_START_DATE_FORMATTED = format(MAX_START_DATE, 'yyyy-MM-dd');
