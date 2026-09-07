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

const r = (x = 0, y = 0, z = 0): Rotation => ({
  x,
  y,
  z,
});

const p = (
  duration: number,
  bones: Record<string, Rotation>
): Pose => ({
  duration,
  bones,
  morphs: {},
});

export const poseDictionary: Record<string, Pose[]> = {
  HELLO: [
    p(1000, {
      mixamorigRightArm: r(-0.35),
      mixamorigRightForeArm: r(-0.35),
      mixamorigRightHand: r(0, 0.1),
    }),
    p(1200, {
      mixamorigRightArm: r(-0.65),
      mixamorigRightForeArm: r(-0.65),
      mixamorigRightHand: r(0, 0.25),
    }),
    p(1400, {
      mixamorigRightArm: r(-0.45, 0, -0.12),
      mixamorigRightForeArm: r(-0.4),
      mixamorigRightHand: r(0, 0.45),
    }),
  ],

  WELCOME: [
    p(1000, {
      mixamorigRightArm: r(0, 0, 0.00),
      mixamorigRightForeArm: r(-0.15, 0, 0),
      mixamorigRightHand: r(0, 0, 0),
    }),

    p(1200, {
      mixamorigRightArm: r(0, 0, 0.55),
      mixamorigRightForeArm: r(-0.65, 0, 0),
      mixamorigRightHand: r(0.1, 0.1, 0),
    }),

    p(1400, {
      mixamorigRightArm: r(0, 0, 0.85),
      mixamorigRightForeArm: r(-0.75, 0, 0),
      mixamorigRightHand: r(0.1, 0.3, 0),
    }),

    p(1000, {
      mixamorigRightArm: r(0, 0, 0.65),
      mixamorigRightForeArm: r(-0.65, 0, 0),
      mixamorigRightHand: r(0, 0.2, 0),
    }),
  ],

  CHENNAI: [
    p(1000, {
      mixamorigRightArm: r(0, 0, 0.20),
      mixamorigRightForeArm: r(-0.35, 0, 0),
      mixamorigRightHand: r(0, 0, 0),
    }),

    p(1200, {
      mixamorigRightArm: r(0, 0, 0.65),
      mixamorigRightForeArm: r(-0.80, 0, 0),
      mixamorigRightHand: r(0.15, 0.1, 0),
    }),

    p(1300, {
      mixamorigRightArm: r(0, 0, 0.95),
      mixamorigRightForeArm: r(-0.60, 0.15, 0),
      mixamorigRightHand: r(0, 0.5, 0),
    }),

    p(1100, {
      mixamorigRightArm: r(0, 0, 0.70),
      mixamorigRightForeArm: r(-0.55, 0, 0),
      mixamorigRightHand: r(0, 0.3, 0),
    }),
  ],

  GOOD: [
    p(1000, {
      mixamorigRightArm: r(-0.3),
      mixamorigRightForeArm: r(-0.55),
      mixamorigRightHand: r(0.15),
    }),
    p(1300, {
      mixamorigRightArm: r(-0.2),
      mixamorigRightForeArm: r(-0.7),
      mixamorigRightHand: r(0.4),
    }),
  ],

  MORNING: [
    p(900, {
      mixamorigRightArm: r(-0.35, -0.1),
      mixamorigRightForeArm: r(-0.55),
      mixamorigRightHand: r(0, -0.2),
    }),
    p(1200, {
      mixamorigRightArm: r(-0.65, -0.15),
      mixamorigRightForeArm: r(-0.8),
      mixamorigRightHand: r(0, -0.4),
    }),
    p(1300, {
      mixamorigRightArm: r(-0.35, 0.1),
      mixamorigRightForeArm: r(-0.5),
      mixamorigRightHand: r(0, -0.15),
    }),
  ],

  EVERYONE: [
    p(900, {
      mixamorigRightArm: r(-0.4, 0.2),
      mixamorigRightForeArm: r(-0.35, 0.2),
      mixamorigRightHand: r(0, 0.3),
    }),
    p(1200, {
      mixamorigRightArm: r(-0.55, -0.2),
      mixamorigRightForeArm: r(-0.55, 0.15),
      mixamorigRightHand: r(0, -0.35),
    }),
  ],

  THANK_YOU: [
    p(1000, {
      mixamorigRightArm: r(-0.35),
      mixamorigRightForeArm: r(-0.7),
      mixamorigRightHand: r(-0.25, 0, 0.15),
    }),
    p(1500, {
      mixamorigRightArm: r(-0.2),
      mixamorigRightForeArm: r(-0.35),
      mixamorigRightHand: r(-0.1, 0.35, 0.15),
    }),
    p(1100, {
      mixamorigRightArm: r(-0.1),
      mixamorigRightForeArm: r(-0.2),
      mixamorigRightHand: r(0, 0.1),
    }),
  ],

  WATCH: [
    p(900, {
      mixamorigRightArm: r(-0.55, 0.1),
      mixamorigRightForeArm: r(-0.5),
      mixamorigRightHand: r(0, 0.3),
    }),
    p(1300, {
      mixamorigRightArm: r(-0.8, 0.15),
      mixamorigRightForeArm: r(-0.7),
      mixamorigRightHand: r(0, 0.5),
    }),
  ],

  GREAT: [
    p(1000, {
      mixamorigRightArm: r(-0.45),
      mixamorigRightForeArm: r(-0.45),
      mixamorigRightHand: r(0.2),
    }),
    p(1300, {
      mixamorigRightArm: r(-0.65, -0.1),
      mixamorigRightForeArm: r(-0.6),
      mixamorigRightHand: r(0.4),
    }),
  ],

  DAY: [
    p(1000, {
      mixamorigRightArm: r(-0.3, 0.15),
      mixamorigRightForeArm: r(-0.5, -0.2),
      mixamorigRightHand: r(0, -0.25),
    }),
    p(1300, {
      mixamorigRightArm: r(-0.2, 0.3),
      mixamorigRightForeArm: r(-0.4, -0.25),
      mixamorigRightHand: r(0, -0.45),
    }),
  ],
};

export function getPose(gloss: string): Pose[] {
  return poseDictionary[gloss.toUpperCase()] ?? [];
}