export const isSelfTarget = (event: Event): boolean => {
  return event.target === event.currentTarget;
};