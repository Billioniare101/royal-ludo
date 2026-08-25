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
    text: '#F8F4E8',
    tint: '#E3B34D',

    // Core surfaces
    background: '#10182B',
    foreground: '#F8F4E8',

    // Cards / elevated surfaces
    card: '#19233A',
    cardForeground: '#F8F4E8',

    // Primary action color (buttons, links, active states)
    primary: '#E3B34D',
    primaryForeground: '#1A1930',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#273653',
    secondaryForeground: '#F8F4E8',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#273653',
    mutedForeground: '#A8B4CC',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#2E4468',
    accentForeground: '#F8F4E8',

    // Destructive actions (delete, error states)
    destructive: '#E15E62',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#334867',
    input: '#334867',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
