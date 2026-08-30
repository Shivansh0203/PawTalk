import { transitions, easing } from './tokens';

/**
 * PawTalk Motion Presets
 * Every animation must communicate state, feedback, hierarchy or continuity
 * Remove animations that exist purely for decoration
 */

export const motionPresets = {
  // ============= PAGE TRANSITIONS =============
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: easing.easeOut },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: easing.easeOut },
  },

  slideInFromLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: easing.easeOut },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: easing.easeOut },
  },

  // ============= LISTENING RING (SIGNATURE ANIMATION) =============
  // Communicates: "I am listening and ready"
  listeningRingBreathe: {
    animate: {
      scale: [1, 1.008, 1],
    },
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  listeningRingPulse: (delay: number) => ({
    animate: {
      opacity: [0.4, 0.6, 0.4],
      scale: [1, 1.012, 1],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    },
  }),

  // ============= CAMERA PREVIEW TRANSITION =============
  // Communicates: "Entering camera mode"
  cameraPreviewMorph: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: {
      duration: 0.4,
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },

  // ============= ANALYSIS SEQUENCE (SIGNATURE) =============
  // Communicates: "System is processing - watching, listening, understanding"
  analysisStageIn: (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: {
      duration: 0.4,
      delay,
      ease: easing.easeOut,
    },
  }),

  analysisWaveform: (i: number) => ({
    animate: {
      scaleY: [0.3, 0.8, 0.3],
      opacity: [0.6, 1, 0.6],
    },
    transition: {
      duration: 1.2,
      repeat: Infinity,
      delay: i * 0.1,
      ease: 'easeInOut',
    },
  }),

  analysisConverge: {
    animate: {
      y: [0, -8, 0],
      opacity: [0.5, 1, 0.5],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // ============= EMOTION RESULT REVEAL =============
  // Communicates: "Here is the result" - staggered reveal builds understanding
  resultHeadlineReveal: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.5,
      ease: easing.easeOut,
      delay: 0.1,
    },
  },

  resultSubtextReveal: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.5,
      ease: easing.easeOut,
      delay: 0.3,
    },
  },

  confidenceIndicator: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.4,
      ease: easing.easeOut,
      delay: 0.4,
    },
  },

  // ============= EMOTION SPECTRUM INDICATOR =============
  // Communicates: "The indicator is moving to this position"
  spectrumIndicatorSlide: (position: number) => ({
    animate: { x: position },
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
      duration: 0.6,
    },
  }),

  // ============= HISTORY TIMELINE =============
  // Communicates: "Items appear from top to bottom chronologically"
  timelineItemReveal: (index: number) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: {
      duration: 0.4,
      delay: index * 0.05,
      ease: easing.easeOut,
    },
  }),

  timelineDotPulse: {
    animate: {
      scale: [1, 1.2, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // ============= NAVIGATION INDICATOR =============
  // Communicates: "Active page has changed"
  navUnderline: {
    layoutId: 'nav-underline',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },

  navScaleIcon: {
    whileHover: { scale: 1.08 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },

  // ============= BUTTON & CONTROL INTERACTIONS =============
  // Communicates: "Button responds to interaction"
  buttonHover: {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98, y: 0 },
    transition: { duration: 0.15 },
  },

  buttonPress: {
    whileTap: { scale: 0.97 },
    transition: { duration: 0.1 },
  },

  // ============= TOGGLE SWITCH =============
  // Communicates: "State has changed"
  toggleSwitch: {
    initial: false,
    animate: (enabled: boolean) => ({ x: enabled ? 20 : 0 }),
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },

  // ============= UPLOAD & FILE INTERACTIONS =============
  uploadFileAppear: {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: { duration: 0.2, ease: easing.easeOut },
  },

  dragOverHighlight: {
    whileDrag: { scale: 1.02, borderColor: '#8b5cf6' },
    transition: { duration: 0.2 },
  },

  // ============= CHAT MESSAGE ANIMATIONS =============
  // Communicates: "Message appears from the sender's side"
  chatMessageUserReveal: {
    initial: { opacity: 0, y: 20, x: 20 },
    animate: { opacity: 1, y: 0, x: 0 },
    exit: { opacity: 0, y: -20, x: 20 },
    transition: { duration: 0.3, ease: easing.easeOut },
  },

  chatMessageMiaReveal: {
    initial: { opacity: 0, y: 20, x: -20 },
    animate: { opacity: 1, y: 0, x: 0 },
    exit: { opacity: 0, y: -20, x: -20 },
    transition: { duration: 0.3, ease: easing.easeOut },
  },

  // Communicates: "Mia is typing"
  typingDot: (i: number) => ({
    animate: { y: [0, -6, 0] },
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay: i * 0.1,
      ease: 'easeInOut',
    },
  }),

  // ============= MODAL INTERACTIONS =============
  // Communicates: "Modal is opening/closing"
  modalBackdropFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  modalContentScale: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: {
      duration: 0.3,
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },

  // ============= SETTINGS TRANSITIONS =============
  themeTransition: {
    transition: { duration: 0.4, ease: easing.easeInOut },
  },

  fontSizeAdjust: {
    transition: { duration: 0.3, ease: easing.easeOut },
  },

  settingItemReveal: (index: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.3,
      delay: index * 0.05,
      ease: easing.easeOut,
    },
  }),

  // ============= SUCCESS & ERROR STATES =============
  // Communicates: "Action succeeded/failed"
  successCheckmark: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },

  errorShake: {
    animate: { x: [-8, 8, -8, 8, 0] },
    transition: { duration: 0.4, ease: easing.easeInOut },
  },
};

/**
 * Motion configuration respecting user's prefers-reduced-motion
 */
export const getMotionConfig = (reduceMotion: boolean) => {
  if (reduceMotion) {
    return {
      duration: 0.01,
      delay: 0,
    };
  }
  return {
    duration: 0.3,
    delay: 0,
  };
};
