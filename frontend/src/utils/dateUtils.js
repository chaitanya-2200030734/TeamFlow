import { format, formatDistanceToNow, isToday, isPast } from 'date-fns';

export const formatDueDate = (date) => {
  if (!date) return 'No due date';
  return format(new Date(date), 'dd MMM yyyy');
};

export const timeAgo = (date) => {
  if (!date) return 'Recently';
  return `${formatDistanceToNow(new Date(date))} ago`;
};

export const isOverdue = (date, status) => {
  return Boolean(date && status !== 'done' && isPast(new Date(date)) && !isToday(new Date(date)));
};

export const dueTone = (date, status) => {
  if (isOverdue(date, status)) return 'danger';
  if (date && isToday(new Date(date))) return 'success';
  return 'muted';
};
