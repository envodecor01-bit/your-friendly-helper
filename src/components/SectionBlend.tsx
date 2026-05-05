/**
 * Smooth gradient blend between consecutive sections so transitions
 * don't feel like hard cuts. Place at the top or bottom of a section.
 */
export function SectionBlend({
  position = "top",
  height = "h-32",
  via = "via-background/60",
}: {
  position?: "top" | "bottom";
  height?: string;
  via?: string;
}) {
  const dir =
    position === "top"
      ? `bg-gradient-to-b from-background ${via} to-transparent top-0`
      : `bg-gradient-to-t from-background ${via} to-transparent bottom-0`;
  return (
    <div className={`pointer-events-none absolute inset-x-0 z-20 ${height} ${dir}`} aria-hidden />
  );
}
