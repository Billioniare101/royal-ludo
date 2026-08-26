/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#FFF6DE',
    tint: '#E8C878',

    // Core surfaces
    background: '#16091F',
    foreground: '#FFF6DE',

    // Cards / elevated surfaces
    card: '#2A1235',
    cardForeground: '#FFF6DE',

    // Primary action color (buttons, links, active states)
    primary: '#E8C878',
    primaryForeground: '#291126',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#3A1A43',
    secondaryForeground: '#FFF6DE',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#2E1837',
    mutedForeground: '#B69BB5',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#5A284F',
    accentForeground: '#FFF6DE',

    // Destructive actions (delete, error states)
    destructive: '#991B1B',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#56365B',
    input: '#56365B',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 16,
};

export default colors;
