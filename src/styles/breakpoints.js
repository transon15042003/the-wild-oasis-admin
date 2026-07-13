export const breakpoints = {
  tablet: "768px",
  desktop: "1200px",
};

export const media = {
  max: (key) => `@media (max-width: ${breakpoints[key]})`,
};
