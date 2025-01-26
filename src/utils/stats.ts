/**
 * Render a statical value, mostly numbers, in a fail-safe way (for i.E. optional stat data)
 * @param value The value to render
 * @param unit The typed unit string to enforce consistent UIs
 * @returns The renderable statistical value
 */
export function renderStatValue(
  value: number | string | undefined | null = undefined,
  unit: "" | "MB/s" | "MB" | "GB" | "%" = "",
  fractionDigits: 0 | 2 = 2,
) {
  if (value === undefined || value === null) {
    return "n.A.";
  }

  if (typeof value === "number") {
    return `${value.toFixed(fractionDigits)}${unit}`;
  }

  return `${value}${unit}`;
}
