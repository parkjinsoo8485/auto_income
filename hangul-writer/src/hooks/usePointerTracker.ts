'use client';
import { useState, useCallback, useRef } from 'react';
import type { PointerPoint } from '../core/stroke-evaluator';

interface UsePointerTrackerOptions {
  viewSize?: number;
  onStrokeEnd?: (points: PointerPoint[]) => void;
}

export function usePointerTracker({
  viewSize = 200,
  onStrokeEnd,
}: UsePointerTrackerOptions = {}) {
  const [isDrawing, setIsDrawing]     = useState(false);
  const [trailPoints, setTrailPoints] = useState<PointerPoint[]>([]);
  const pointsRef = useRef<PointerPoint[]>([]);
  const svgRef    = useRef<SVGSVGElement>(null);

  const getSVGPoint = useCallback(
    (e: React.PointerEvent<SVGSVGElement>): PointerPoint | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const scaleX = viewSize / rect.width;
      const scaleY = viewSize / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
        t: e.timeStamp,
      };
    },
    [viewSize],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const pt = getSVGPoint(e);
      if (!pt) return;
      pointsRef.current = [pt];
      setTrailPoints([pt]);
      setIsDrawing(true);
    },
    [getSVGPoint],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDrawing) return;
      const pt = getSVGPoint(e);
      if (!pt) return;
      pointsRef.current = [...pointsRef.current, pt];
      setTrailPoints((prev) => [...prev, pt]);
    },
    [isDrawing, getSVGPoint],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDrawing) return;
      setIsDrawing(false);
      const pts = pointsRef.current;
      onStrokeEnd?.(pts);
      // trail 잠시 후 클리어
      setTimeout(() => setTrailPoints([]), 500);
    },
    [isDrawing, onStrokeEnd],
  );

  /** 유저 궤적을 SVG polyline points 문자열로 변환 */
  const trailToPolyline = useCallback(
    () => trailPoints.map((p) => `${p.x},${p.y}`).join(' '),
    [trailPoints],
  );

  return {
    svgRef,
    isDrawing,
    trailPoints,
    trailToPolyline,
    pointerHandlers: { onPointerDown, onPointerMove, onPointerUp },
  };
}
