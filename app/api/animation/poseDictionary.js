import { createBoneRotation } from "./types.js";

export const poseDictionary = {
  HELLO: {
    duration: 600,
    bones: {
      CC_Base_R_Upperarm: createBoneRotation(0.2, 0.1, 1.2),
      CC_Base_R_Forearm: createBoneRotation(0.0, 0.0, 0.8),
      CC_Base_R_Hand: createBoneRotation(0.0, 0.2, 0.0),
      CC_Base_Head: createBoneRotation(0.0, 0.1, 0.0),
    },
    morphs: {
      Mouth_Smile: 0.8,
      Eye_Blink_L: 0.0,
      Eye_Blink_R: 0.0,
    },
  },

  WELCOME: {
    duration: 600,
    bones: {
      CC_Base_R_Upperarm: createBoneRotation(0.3, 0.1, 1.0),
      CC_Base_R_Forearm: createBoneRotation(0.1, 0.0, 0.6),
      CC_Base_R_Hand: createBoneRotation(0.0, 0.3, 0.1),
    },
    morphs: {},
  },

  NEWS: {
    duration: 600,
    bones: {
      CC_Base_R_Upperarm: createBoneRotation(0.4, 0.0, 0.9),
      CC_Base_R_Forearm: createBoneRotation(0.2, 0.0, 0.5),
    },
    morphs: {},
  },

  LIVE: {
    duration: 600,
    bones: {
      CC_Base_R_Upperarm: createBoneRotation(0.25, 0.15, 1.1),
      CC_Base_R_Forearm: createBoneRotation(0.0, 0.1, 0.7),
    },
    morphs: {},
  },
};

export function getPose(gloss) {
  return poseDictionary[gloss.toUpperCase()] ?? null;
}