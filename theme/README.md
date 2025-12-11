# Theme Colors

This directory contains the centralized color theme configuration for the application.

## Files

- `colors.ts` - Main theme file with all color definitions
- `index.ts` - Barrel export for easy imports

## Usage

### Importing in TypeScript/TSX

```typescript
// Import specific exports
import { themeColors, getThemeColor, themeColorsFlat } from '@/theme';

// Use nested colors
const primaryColor = themeColors.blue[600]; // '#2563eb'

// Use flat colors
const primaryColorFlat = themeColorsFlat.blue600; // '#2563eb'

// Use helper function
const primaryColorHelper = getThemeColor('blue.600'); // '#2563eb'
```

### Using in Tailwind Classes

The colors are available as Tailwind utility classes. The CSS variables are automatically mapped to Tailwind color classes:

```tsx
<div className="bg-blue-600 text-white">
  Primary button
</div>

<div className="bg-red-500 text-white">
  Error state
</div>

<div className="bg-gray-50 text-gray-900">
  Light background
</div>
```

### Using in Inline Styles

For inline styles, you can import and use the theme colors directly:

```tsx
import { themeColors } from '@/theme';

<div style={{ backgroundColor: themeColors.blue[600], color: themeColors.white }}>
  Styled div
</div>
```

### Using CSS Variables

All colors are available as CSS variables in `globals.css`:

```css
.custom-element {
  background-color: var(--color-blue-600);
  color: var(--color-white);
}
```

## Color Structure

- **Base colors**: `background`, `foreground`
- **Gray scale**: `gray[50-900]`
- **Blue colors**: `blue[100, 400, 600, 700]` - Primary actions
- **Red colors**: `red[100, 400, 500, 600, 700]` - Errors and destructive actions
- **Zinc colors**: `zinc[50, 400, 600, 950]` - Neutral grays
- **Semantic colors**: `white`, `black`
- **Custom colors**: Hover states and special cases
- **Border colors**: Border-related color definitions
- **Text colors**: Text-related color definitions

## Adding New Colors

1. Add the color to `theme/colors.ts` in the appropriate category
2. Update the CSS variable in `app/globals.css` if you want it available as a Tailwind class
3. The color will be immediately available for use

## Source of Truth

`theme/colors.ts` is the single source of truth for all colors. CSS variables in `globals.css` should be kept in sync with this file.

