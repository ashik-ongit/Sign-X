export type Rotation = {
  x: number;
  y: number;
  z: number;
};

export type Pose = {
  duration: number;
  bones: Record<string, Rotation>;
  morphs: Record<string, number>;
};

export const poseDictionary: Record<string, Pose> = {
  HELLO: {
    duration: 3000,

    bones: {
      // Right upper arm:
      // negative X = raises arm for this GLB
      mixamorigRightArm: {
        x: -0.1745,
        y: 0,
        z: 0,
      },

      // Start with zero elbow rotation.
      mixamorigRightForeArm: {
        x: 0,
        y: 0,
        z: 0,
      },

      mixamorigRightHand: {
        x: 0,
        y: 0,
        z: 0,
      },
    },

    morphs: {},
  },

  WELCOME: {
    duration: 3000,

    bones: {
      mixamorigRightArm: {
        x: 0,
        y: 0,
        z: 0,
      },

      mixamorigRightForeArm: {
        x: 0,
        y: 0,
        z: 0,
      },

      mixamorigRightHand: {
        x: 0,
        y: 0,
        z: 0,
      },
    },

    morphs: {},
  },

  NEWS: {
    duration: 3000,

    bones: {
      mixamorigRightArm: {
        x: 0.1745,
        y: 0,
        z: 0,
      },

      mixamorigRightForeArm: {
        x: 0,
        y: 0,
        z: 0,
      },

      mixamorigRightHand: {
        x: 0,
        y: 0,
        z: 0,
      },
    },

    morphs: {},
  },

  LIVE: {
    duration: 3000,

    bones: {
      mixamorigRightArm: {
        x: -0.0873,
        y: 0,
        z: 0,
      },

      mixamorigRightForeArm: {
        x: 0,
        y: 0,
        z: 0,
      },

      mixamorigRightHand: {
        x: 0,
        y: 0,
        z: 0,
      },
    },

    morphs: {},
  },
};

export function getPose(gloss: string): Pose | null {
  return poseDictionary[gloss.toUpperCase()] ?? null;
}