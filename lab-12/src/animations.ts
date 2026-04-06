import type { Variants } from 'framer-motion';

export const DURATION_MICRO = 0.15;
export const DURATION_ENTER = 0.28;
export const DURATION_EXIT = 0.18;
export const DURATION_ITEM = 0.25;
export const STAGGER_CHILDREN = 0.08;
export const SLIDE_OFFSET = 16;
export const CARD_LIFT = 20;

export const pageVariants: Variants = {
  initial: { opacity: 0, x: -SLIDE_OFFSET },
  animate: { opacity: 1, x: 0, transition: { duration: DURATION_ENTER, ease: 'easeOut' } },
  exit:    { opacity: 0, x:  SLIDE_OFFSET, transition: { duration: DURATION_EXIT,  ease: 'easeIn'  } },
};

export const gridVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: STAGGER_CHILDREN } },
};

export const cardEnterVariants: Variants = {
  hidden:  { opacity: 0, y: CARD_LIFT },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION_ITEM } },
};

export const toastVariants: Variants = {
  initial: { opacity: 0, x: 48, scale: 0.9 },
  animate: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0, x: 48, scale: 0.85,
    transition: { duration: DURATION_EXIT },
  },
};
