'use client';
import React, { useMemo } from 'react';
import type { StrokePlan, ComposedStroke } from '../../core/stroke-composer';

import type { SegmentedGlyph } from '../../core/glyph-segmenter';

const PALETTE = [
  '#38bdf8','#818cf8','#a78bfa','#f472b6',
  '#fbbf24','#34d399','#f87171','#c084fc',
  '#2dd4bf','#fb923c','#e879f9',
];

interface StrokeAnimatedViewProps {
  plan: StrokePlan;
  /** 표시할 획까지의 인덱스 (0-based exclusive: 0=없음, n=n개 표시) */
  revealUpTo: number;
  speed?: number;
  showGrid?: boolean;
  showNumbers?: boolean;
  showGuide?: boolean;
  viewSize?: number;
  className?: string;
  /** 완성형 폰트 역분해 세그먼트 데이터 (전달 시 100% 폰트 본체 획순 렌더링) */
  segmentedGlyph?: SegmentedGlyph | null;
  fontMatrix?: number[];
}

function StrokeMaskLayer({
  stroke,
  idx,
  strokeDur,
  gapDur,
  viewSize,
  segmentedGlyph,
  fontMatrix = [0.17, 0, 0, -0.17, 18, 168],
}: {
  stroke: ComposedStroke;
  idx: number;
  strokeDur: number;
  gapDur: number;
  viewSize: number;
  segmentedGlyph?: SegmentedGlyph | null;
  fontMatrix?: number[];
}) {
  const color     = PALETTE[idx % PALETTE.length];
  const startTime = (idx * (strokeDur + gapDur)).toFixed(2);
  const maskLen   = stroke.len * 1.5;
  const maskId    = `mask_s${idx}`;
  const animId    = `drawMask_${idx}`;
  const badgeId   = `badgePop_${idx}`;
  const mStr      = fontMatrix.join(' ');

  // 해당 획이 전담하는 폰트 조각 선택 (격리 마스킹 핵심)
  let targetPath = '';
  if (segmentedGlyph) {
    if (stroke.role === 'cho') {
      targetPath = segmentedGlyph.choPath;
    } else if (stroke.role === 'jung') {
      targetPath = segmentedGlyph.jungPath;
    } else if (stroke.role === 'jong') {
      if (segmentedGlyph.jongPaths.length > 1) {
        // 겹받침: X좌표 기준 좌/우 배정
        targetPath = stroke.bx < 100 ? segmentedGlyph.jongPaths[0] : segmentedGlyph.jongPaths[1];
      } else {
        targetPath = segmentedGlyph.jongPath;
      }
    }
  }

  return (
    <>
      {/* CSS 애니메이션 인라인 스타일 */}
      <style>{`
        @keyframes ${animId} {
          0%   { stroke-dashoffset: ${maskLen}; opacity: 0; }
          8%   { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes ${badgeId} {
          0%   { opacity: 0; transform: scale(0.3); }
          70%  { transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }
        .mask-sk-${idx} {
          stroke-dasharray: ${maskLen};
          stroke-dashoffset: ${maskLen};
          animation: ${animId} ${strokeDur.toFixed(2)}s cubic-bezier(0.4,0,0.2,1) ${startTime}s forwards;
        }
        .badge-anim-${idx} {
          transform-origin: ${stroke.bx}px ${stroke.by}px;
          animation: ${badgeId} 0.3s ease-out ${startTime}s forwards;
          opacity: 0;
        }
      `}</style>

      {/* mask 정의 */}
      <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={viewSize} height={viewSize}>
        <path
          d={stroke.d}
          fill="none"
          stroke="white"
          strokeWidth={30}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`mask-sk-${idx}`}
        />
      </mask>

      {/* 마스크 적용 레이어: 폰트 세그먼트가 있으면 폰트 살점 그대로 렌더링, 없으면 굵은 뼈대선 폴백 */}
      <g mask={`url(#${maskId})`}>
        {targetPath ? (
          <path
            d={targetPath}
            fill={color}
            transform={`matrix(${mStr})`}
          />
        ) : (
          <path
            d={stroke.d}
            fill="none"
            stroke={color}
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </g>
    </>
  );
}

export function StrokeAnimatedView({
  plan,
  revealUpTo,
  speed      = 1.0,
  showGrid   = true,
  showNumbers = true,
  showGuide  = true,
  viewSize   = 200,
  className  = '',
  segmentedGlyph,
  fontMatrix = [0.17, 0, 0, -0.17, 18, 168],
}: StrokeAnimatedViewProps) {
  const strokeDur = 0.65 / speed;
  const gapDur    = 0.22 / speed;
  const half      = viewSize / 2;
  const mStr      = fontMatrix.join(' ');

  const visibleStrokes = useMemo(
    () => plan.strokes.slice(0, revealUpTo),
    [plan.strokes, revealUpTo],
  );

  return (
    <svg
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {visibleStrokes.map((st, i) => (
          <StrokeMaskLayer
            key={`mask-layer-${i}`}
            stroke={st}
            idx={i}
            strokeDur={strokeDur}
            gapDur={gapDur}
            viewSize={viewSize}
            segmentedGlyph={segmentedGlyph}
            fontMatrix={fontMatrix}
          />
        ))}
      </defs>

      {/* 격자 가이드 */}
      {showGrid && (
        <g opacity={0.15}>
          <line x1={half} y1={8}      x2={half}        y2={viewSize - 8} stroke="white" strokeWidth={0.8}/>
          <line x1={8}    y1={half}   x2={viewSize - 8} y2={half}        stroke="white" strokeWidth={0.8}/>
          <line x1={10}   y1={10}     x2={viewSize - 10} y2={viewSize - 10} stroke="white" strokeWidth={0.5} strokeDasharray="3,4"/>
          <line x1={viewSize - 10} y1={10} x2={10} y2={viewSize - 10}   stroke="white" strokeWidth={0.5} strokeDasharray="3,4"/>
          <rect x={10} y={10} width={viewSize - 20} height={viewSize - 20} rx={10}
                fill="none" stroke="white" strokeWidth={0.8}/>
        </g>
      )}

      {/* 은은한 전체 글리프/획 가이드 밑바탕 */}
      {showGuide && (
        segmentedGlyph?.totalPath ? (
          <path
            d={segmentedGlyph.totalPath}
            fill="#334155"
            opacity={0.35}
            transform={`matrix(${mStr})`}
          />
        ) : (
          <g opacity={0.15}>
            {plan.strokes.map((st, i) => (
              <path
                key={`guide-${i}`}
                d={st.d}
                fill="none"
                stroke="white"
                strokeWidth={14}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        )
      )}

      {/* 획순 번호 뱃지 */}
      {showNumbers && visibleStrokes.map((st, i) => {
        const color = PALETTE[i % PALETTE.length];
        return (
          <g key={`badge-${i}`} className={`badge-anim-${i}`}>
            <circle cx={st.bx} cy={st.by} r={8} fill="#0f172a" stroke={color} strokeWidth={2}/>
            <text
              x={st.bx} y={st.by + 3.5}
              textAnchor="middle" fontSize={8.5} fontWeight="900"
              fill="white" fontFamily="system-ui,sans-serif"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
