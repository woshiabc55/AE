import { useEffect, useRef } from "react";
import type { Bead } from "@/types";
import { renderBeads } from "@/engine/beadRenderer";
import { DEFAULT_PALETTE } from "@/types";

interface Props {
  beads: Bead[];
  gridSize: number;
  size?: number;
  palette?: string[];
}

export default function BeadThumbnail({
  beads,
  gridSize,
  size = 120,
  palette = DEFAULT_PALETTE,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cellSize = size / gridSize;
    canvas.width = size;
    canvas.height = size;
    renderBeads(ctx, beads, {
      cellSize,
      palette,
      showGrid: false,
      showHalfDivider: false,
      gridSize,
    });
  }, [beads, gridSize, size, palette]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-bead"
      style={{ width: size, height: size, imageRendering: "pixelated" }}
    />
  );
}
