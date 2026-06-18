// MAISON TUNIS - 8pt Grid Spacing System
// All spacing values are multiples of 8px for consistency

export const spacing = {
  // Base unit: 8px
  0: '0px',
  1: '4px',   // 0.5rem - Half unit
  2: '8px',   // 1rem - Base unit
  3: '12px',  // 1.5rem - 1.5 units
  4: '16px',  // 2rem - 2 units
  5: '20px',  // 2.5rem - 2.5 units
  6: '24px',  // 3rem - 3 units
  8: '32px',  // 4rem - 4 units
  10: '40px', // 5rem - 5 units
  12: '48px', // 6rem - 6 units
  16: '64px', // 8rem - 8 units
  20: '80px', // 10rem - 10 units
  24: '96px', // 12rem - 12 units
  32: '128px', // 16rem - 16 units
  40: '160px', // 20rem - 20 units
  48: '192px', // 24rem - 24 units
  56: '224px', // 28rem - 28 units
  64: '256px', // 32rem - 32 units
  72: '288px', // 36rem - 36 units
  80: '320px', // 40rem - 40 units
  96: '384px', // 48rem - 48 units
} as const

// Semantic spacing aliases
export const spacingSemantic = {
  xs: spacing[1],      // 4px
  sm: spacing[2],      // 8px
  md: spacing[3],      // 12px
  lg: spacing[4],      // 16px
  xl: spacing[6],      // 24px
  '2xl': spacing[8],   // 32px
  '3xl': spacing[12],  // 48px
  '4xl': spacing[16],  // 64px
  '5xl': spacing[20],  // 80px
  '6xl': spacing[24],  // 96px
} as const

export type SpacingValue = keyof typeof spacing
export type SpacingSemantic = keyof typeof spacingSemantic
