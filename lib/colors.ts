// MAISON TUNIS - Premium Dark Luxury Color Palette
// Inspired by ultra-premium brands: Hermès, Loro Piana, Brunello Cucinelli

export const colors = {
  // Dark luxury backgrounds
  charcoal: '#0C0A08',        // Primary dark
  charcoalLight: '#14110E',   // Secondary dark
  charcoalDark: '#060504',    // Darkest
  
  // Premium warm accents
  bronze: '#D4A574',          // Warm bronze/gold
  bronzeLight: '#E8C5A0',     // Light bronze
  bronzeDark: '#A67C52',      // Dark bronze
  
  // Elegant earth tones
  terracotta: '#B85C38',
  stone: '#9D9080',
  stoneDark: '#7A6F63',
  
  // Luxury neutrals
  cream: '#F5F0E8',           // Cream/off-white
  ivory: '#EDE8E0',           // Light ivory
  white: '#FEFBF8',           // Brilliant white
  
  // Supporting colors
  sage: '#8B9D83',            // Muted green
  slate: '#6B7280',           // Cool gray
  rose: '#B8956A',            // Rose-like tone
  
  // Semantic
  background: '#0C0A08',
  backgroundSecondary: '#14110E',
  foreground: '#F5F0E8',
  foregroundSecondary: '#EDE8E0',
  border: '#2A2620',
  borderLight: '#3A3530',
  accent: '#D4A574',          // Primary accent
  accentForeground: '#0C0A08',
  muted: '#A9A09B',
  mutedForeground: '#6B6259',
  
  // Status colors
  success: '#6B9E7F',
  error: '#C9544D',
  warning: '#D4A574',
  info: '#7BA3C0',
};

export type ColorKey = keyof typeof colors;


