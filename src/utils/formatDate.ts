export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(date);
};
