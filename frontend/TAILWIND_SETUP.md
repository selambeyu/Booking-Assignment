# Tailwind CSS Setup

This project uses Tailwind CSS for styling. All components have been migrated from custom CSS to Tailwind utility classes.

## Installation

Tailwind CSS has been added to the project. To install dependencies, run:

```bash
npm install
```

## Configuration Files

- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration for Tailwind
- `src/index.css` - Contains Tailwind directives

## Usage

### Utility Classes

All components now use Tailwind utility classes instead of custom CSS:

- **Layout**: `flex`, `grid`, `gap`, `padding`, `margin`
- **Colors**: `bg-blue-500`, `text-gray-800`, `border-gray-300`
- **Spacing**: `p-4`, `m-2`, `gap-4`
- **Typography**: `text-xl`, `font-bold`, `text-center`
- **Responsive**: `md:grid-cols-2`, `lg:grid-cols-3`

### Component Structure

All UI components (`Button`, `Input`, `ErrorMessage`, `LoadingSpinner`) now use Tailwind classes with the `cn()` utility function for conditional classes.

### Custom Utility Function

The `cn()` function in `src/utils/cn.ts` is used to merge Tailwind classes conditionally:

```tsx
import { cn } from '../utils/cn';

<button className={cn(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-500',
  className
)}>
```

## VS Code Support

VS Code settings have been configured to:
- Ignore CSS linter warnings for Tailwind directives
- Enable Tailwind IntelliSense for the `cn()` function

Install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension for better autocomplete.

## Benefits

✅ **No custom CSS files** - All styling is done with utility classes
✅ **Consistent design system** - Tailwind's design tokens ensure consistency
✅ **Smaller bundle size** - Only used classes are included in production
✅ **Faster development** - No need to write custom CSS
✅ **Responsive by default** - Easy responsive design with breakpoint prefixes

## Migration Notes

All custom CSS files have been removed:
- `components/ui/*.css` - Replaced with Tailwind classes
- `pages/*.css` - Replaced with Tailwind classes
- `components/Layout.css` - Replaced with Tailwind classes
- `App.css` - Removed (not needed)

All components maintain the same visual appearance but now use Tailwind utility classes.

