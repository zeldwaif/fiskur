/**
 * Motion configuration for JS-driven transitions (e.g. the landing screen slide).
 * Keeping timing/easing/direction/distance here means animations can be re-tuned
 * without editing the components that use them.
 */
export const motion = {
  landing: {
    duration: 600, // ms (within the requested 500–700ms window)
    easing: "cubic-bezier(0.2, 0.9, 0.24, 1)",
    /** Landing slides out to the left; app enters from the right. */
    outgoingTransform: "translateX(-100%)",
    incomingFrom: "translateX(100%)",
    reducedMotionDuration: 1, // effectively instant for reduced-motion users
  },
} as const;
