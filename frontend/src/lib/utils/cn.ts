/**
 * Utility function to merge Tailwind CSS classes
 * Similar to clsx or classnames but optimized for Tailwind
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

