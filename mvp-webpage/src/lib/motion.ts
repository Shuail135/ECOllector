export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const hoverLift = {
  y: -6,
  scale: 1.02,
};

export const hoverTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
} as const;
