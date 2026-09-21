'use client';
import React from 'react';
import type { StrokePlan } from '../../core/stroke-composer';
import { usePointerTracker } from '../../hooks/usePointerTracker';

const PALETTE = [
  '#38bdf8','#818cf8','#a78bfa','#f472b6',
  '#fbbf24','#34d399','#f87171','#c084fc',
];

interface StrokeWritingCanvasProps {
  plan: StrokePlan;
  currentStrokeIdx: number;
  doneStrokes: Set<number>;
  errorStroke: number | null;
  onStrokeEnd: (points: { x: number; y: number; t: number }[]) => void;
  viewSize?: number;
  className?: string;
}

export function StrokeWritingCanvas({
  plan,
  currentStrokeIdx,
  doneStrokes,
  errorStroke,
  onStrokeEnd,
  viewSize  = 200,
  className = '',
}: StrokeWritingCanvasProps) {
  const { svgRef, isDrawing, trailToPolyline, pointerHandlers } = usePointerTracker({
    viewSize,
    onStrokeEnd,
  });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      width="100%" height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ touchAction: 'none', cursor: isDrawing ? 'crosshair' : 'default', overflow: 'visible' }}
      {...pointerHandlers}
    >
      {/* 격자 */}
      <g opacity="0.15">
        <line x1={viewSize/2} y1="8"         x2={viewSize/2} y2={viewSize-8} stroke="white" strokeWidth="0.8"/>
        <line x1="8"         y1={viewSize/2} x2={viewSize-8} y2={viewSize/2} stroke="white" strokeWidth="0.8"/>
        <rect x="10" y="10" width={viewSize-20} height={viewSize-20} rx="10"
              fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,4"/>
      </g>

      {/* 배경 가이드 실루엣 (연한 회색) */}
      <g opacity="0.12">
        {plan.strokes.map((st, i) => (
          <path key={i} d={st.d} fill="none" stroke="white"
                strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
        ))}
      </g>

      {/* 완료된 획 (색상 확정) */}
      {plan.strokes.map((st, i) => {
        if (!doneStrokes.has(i)) return null;
        return (
          <path key={`done-${i}`} d={st.d}
                fill="none" stroke={PALETTE[i % PALETTE.length]}
                strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"
                opacity={0.9}/>
        );
      })}

      {/* 현재 대기 획 — 강조 표시 */}
      {!doneStrokes.has(currentStrokeIdx) && plan.strokes[currentStrokeIdx] && (
        <path
          d={plan.strokes[currentStrokeIdx].d}
          fill="none"
          stroke={errorStroke === currentStrokeIdx ? '#f87171' : 'rgba(255,255,255,0.30)'}
          strokeWidth={errorStroke === currentStrokeIdx ? 16 : 14}
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            filter: errorStroke === currentStrokeIdx
              ? 'drop-shadow(0 0 8px #f87171)'
              : 'drop-shadow(0 0 6px rgba(56,189,248,0.5))',
          }}
        />
      )}

      {/* 사용자 드래그 궤적 */}
      {isDrawing && (
        <polyline
          points={trailToPolyline()}
          fill="none"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* 획순 번호 뱃지 */}
      {plan.strokes.map((st, i) => {
        const isDone    = doneStrokes.has(i);
        const isCurrent = i === currentStrokeIdx;
        const color     = isDone ? PALETTE[i % PALETTE.length]
                        : isCurrent ? '#38bdf8'
                        : 'rgba(255,255,255,0.3)';
        return (
          <g key={`badge-${i}`}>
            <circle cx={st.bx} cy={st.by} r={8} fill="#0f172a" stroke={color} strokeWidth={2}/>
            <text x={st.bx} y={st.by + 3.5}
                  textAnchor="middle" fontSize={8.5} fontWeight="900"
                  fill={isDone || isCurrent ? 'white' : 'rgba(255,255,255,0.4)'}
                  fontFamily="system-ui,sans-serif">
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
