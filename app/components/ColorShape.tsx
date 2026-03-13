"use client";

import { ReactElement } from "react";

interface ColorShapeProps {
  shape: string;
  color: string;
  size?: number;
}

const SHAPE_PATHS: Record<string, (s: number) => ReactElement> = {
  circle: (s) => <circle cx={s/2} cy={s/2} r={s*0.42} />,
  square: (s) => <rect x={s*0.1} y={s*0.1} width={s*0.8} height={s*0.8} rx={s*0.05} />,
  triangle: (s) => <polygon points={`${s/2},${s*0.08} ${s*0.92},${s*0.88} ${s*0.08},${s*0.88}`} />,
  star: (s) => {
    const cx = s/2, cy = s/2, r1 = s*0.44, r2 = s*0.18;
    const pts = Array.from({length: 10}, (_, i) => {
      const a = (Math.PI * 2 * i / 10) - Math.PI/2;
      const r = i % 2 === 0 ? r1 : r2;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return <polygon points={pts} />;
  },
  heart: (s) => <path d={`M${s/2},${s*0.85} C${s*0.15},${s*0.6} ${s*0.02},${s*0.3} ${s*0.25},${s*0.18} C${s*0.38},${s*0.12} ${s*0.48},${s*0.2} ${s/2},${s*0.35} C${s*0.52},${s*0.2} ${s*0.62},${s*0.12} ${s*0.75},${s*0.18} C${s*0.98},${s*0.3} ${s*0.85},${s*0.6} ${s/2},${s*0.85}Z`} />,
  pentagon: (s) => {
    const cx = s/2, cy = s/2, r = s*0.42;
    const pts = Array.from({length: 5}, (_, i) => {
      const a = (Math.PI * 2 * i / 5) - Math.PI/2;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return <polygon points={pts} />;
  },
  hexagon: (s) => {
    const cx = s/2, cy = s/2, r = s*0.42;
    const pts = Array.from({length: 6}, (_, i) => {
      const a = (Math.PI * 2 * i / 6) - Math.PI/6;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return <polygon points={pts} />;
  },
  trapezoid: (s) => <polygon points={`${s*0.2},${s*0.15} ${s*0.8},${s*0.15} ${s*0.95},${s*0.85} ${s*0.05},${s*0.85}`} />,
  diamond: (s) => <polygon points={`${s/2},${s*0.05} ${s*0.9},${s/2} ${s/2},${s*0.95} ${s*0.1},${s/2}`} />,
  ellipse: (s) => <ellipse cx={s/2} cy={s/2} rx={s*0.44} ry={s*0.3} />,
  semicircle: (s) => <path d={`M${s*0.08},${s*0.6} A${s*0.42},${s*0.42} 0 0 1 ${s*0.92},${s*0.6} L${s*0.08},${s*0.6}Z`} />,
  star8: (s) => {
    const cx = s/2, cy = s/2, r1 = s*0.44, r2 = s*0.22;
    const pts = Array.from({length: 16}, (_, i) => {
      const a = (Math.PI * 2 * i / 16) - Math.PI/2;
      const r = i % 2 === 0 ? r1 : r2;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return <polygon points={pts} />;
  },
  cross: (s) => <path d={`M${s*0.35},${s*0.1} h${s*0.3} v${s*0.25} h${s*0.25} v${s*0.3} h${-s*0.25} v${s*0.25} h${-s*0.3} v${-s*0.25} h${-s*0.25} v${-s*0.3} h${s*0.25}Z`} />,
  arrow: (s) => <polygon points={`${s/2},${s*0.08} ${s*0.88},${s*0.5} ${s*0.65},${s*0.5} ${s*0.65},${s*0.92} ${s*0.35},${s*0.92} ${s*0.35},${s*0.5} ${s*0.12},${s*0.5}`} />,
  droplet: (s) => <path d={`M${s/2},${s*0.08} C${s*0.52},${s*0.2} ${s*0.88},${s*0.5} ${s*0.88},${s*0.65} C${s*0.88},${s*0.82} ${s*0.72},${s*0.95} ${s/2},${s*0.95} C${s*0.28},${s*0.95} ${s*0.12},${s*0.82} ${s*0.12},${s*0.65} C${s*0.12},${s*0.5} ${s*0.48},${s*0.2} ${s/2},${s*0.08}Z`} />,
  shield: (s) => <path d={`M${s/2},${s*0.08} L${s*0.88},${s*0.25} L${s*0.85},${s*0.6} C${s*0.8},${s*0.8} ${s*0.6},${s*0.95} ${s/2},${s*0.95} C${s*0.4},${s*0.95} ${s*0.2},${s*0.8} ${s*0.15},${s*0.6} L${s*0.12},${s*0.25}Z`} />,
  sun: (s) => {
    const cx = s/2, cy = s/2;
    const inner = s*0.2, outer = s*0.42;
    const pts = Array.from({length: 24}, (_, i) => {
      const a = (Math.PI * 2 * i / 24) - Math.PI/2;
      const r = i % 2 === 0 ? outer : inner;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return <polygon points={pts} />;
  },
  flower: (s) => {
    const cx = s/2, cy = s/2, pr = s*0.16;
    const petals = Array.from({length: 6}, (_, i) => {
      const a = (Math.PI * 2 * i / 6);
      const px = cx + s*0.22 * Math.cos(a);
      const py = cy + s*0.22 * Math.sin(a);
      return <circle key={i} cx={px} cy={py} r={pr} />;
    });
    return <>{petals}<circle cx={cx} cy={cy} r={s*0.12} /></>;
  },
  cloud: (s) => <path d={`M${s*0.2},${s*0.65} A${s*0.15},${s*0.15} 0 0 1 ${s*0.25},${s*0.35} A${s*0.18},${s*0.18} 0 0 1 ${s*0.55},${s*0.25} A${s*0.2},${s*0.2} 0 0 1 ${s*0.85},${s*0.45} A${s*0.15},${s*0.15} 0 0 1 ${s*0.8},${s*0.65}Z`} />,
  crescent: (s) => <path d={`M${s*0.55},${s*0.08} C${s*0.05},${s*0.08} ${s*0.05},${s*0.92} ${s*0.55},${s*0.92} C${s*0.3},${s*0.7} ${s*0.3},${s*0.3} ${s*0.55},${s*0.08}Z`} />,
  leaf: (s) => <path d={`M${s/2},${s*0.08} C${s*0.85},${s*0.2} ${s*0.92},${s*0.6} ${s/2},${s*0.92} C${s*0.08},${s*0.6} ${s*0.15},${s*0.2} ${s/2},${s*0.08}Z`} />,
  wave: (s) => <path d={`M${s*0.05},${s*0.5} C${s*0.2},${s*0.2} ${s*0.3},${s*0.2} ${s*0.4},${s*0.5} C${s*0.5},${s*0.8} ${s*0.6},${s*0.8} ${s*0.7},${s*0.5} C${s*0.8},${s*0.2} ${s*0.85},${s*0.2} ${s*0.95},${s*0.5} L${s*0.95},${s*0.7} C${s*0.85},${s*0.4} ${s*0.8},${s*0.4} ${s*0.7},${s*0.7} C${s*0.6},${s} ${s*0.5},${s} ${s*0.4},${s*0.7} C${s*0.3},${s*0.4} ${s*0.2},${s*0.4} ${s*0.05},${s*0.7}Z`} />,
  crown: (s) => <polygon points={`${s*0.08},${s*0.85} ${s*0.15},${s*0.3} ${s*0.32},${s*0.55} ${s/2},${s*0.2} ${s*0.68},${s*0.55} ${s*0.85},${s*0.3} ${s*0.92},${s*0.85}`} />,
  rainbow: (s) => <path d={`M${s*0.05},${s*0.75} A${s*0.45},${s*0.45} 0 0 1 ${s*0.95},${s*0.75} L${s*0.82},${s*0.75} A${s*0.32},${s*0.32} 0 0 0 ${s*0.18},${s*0.75}Z`} />,
  gem: (s) => <polygon points={`${s*0.2},${s*0.35} ${s*0.35},${s*0.12} ${s*0.65},${s*0.12} ${s*0.8},${s*0.35} ${s/2},${s*0.9}`} />,
  arrowLeft: (s) => <polygon points={`${s*0.1},${s/2} ${s*0.5},${s*0.12} ${s*0.5},${s*0.35} ${s*0.88},${s*0.35} ${s*0.88},${s*0.65} ${s*0.5},${s*0.65} ${s*0.5},${s*0.88}`} />,
  arrowRight: (s) => <polygon points={`${s*0.9},${s/2} ${s*0.5},${s*0.12} ${s*0.5},${s*0.35} ${s*0.12},${s*0.35} ${s*0.12},${s*0.65} ${s*0.5},${s*0.65} ${s*0.5},${s*0.88}`} />,
  hollowStar: (s) => {
    const cx = s/2, cy = s/2, r1 = s*0.44, r2 = s*0.18;
    const pts = Array.from({length: 10}, (_, i) => {
      const a = (Math.PI * 2 * i / 10) - Math.PI/2;
      const r = i % 2 === 0 ? r1 : r2;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return <polygon points={pts} fillOpacity={0} strokeWidth={s*0.05} />;
  },
  infinity: (s) => <path d={`M${s/2},${s/2} C${s*0.35},${s*0.2} ${s*0.1},${s*0.2} ${s*0.1},${s/2} C${s*0.1},${s*0.8} ${s*0.35},${s*0.8} ${s/2},${s/2} C${s*0.65},${s*0.2} ${s*0.9},${s*0.2} ${s*0.9},${s/2} C${s*0.9},${s*0.8} ${s*0.65},${s*0.8} ${s/2},${s/2}Z`} />,
  deltoid: (s) => <polygon points={`${s/2},${s*0.05} ${s*0.9},${s*0.85} ${s/2},${s*0.55} ${s*0.1},${s*0.85}`} />,
  butterfly: (s) => {
    return (
      <>
        <ellipse cx={s*0.28} cy={s*0.3} rx={s*0.2} ry={s*0.17} transform={`rotate(-20,${s*0.28},${s*0.3})`} />
        <ellipse cx={s*0.72} cy={s*0.3} rx={s*0.2} ry={s*0.17} transform={`rotate(20,${s*0.72},${s*0.3})`} />
        <ellipse cx={s*0.3} cy={s*0.62} rx={s*0.15} ry={s*0.13} transform={`rotate(-15,${s*0.3},${s*0.62})`} />
        <ellipse cx={s*0.7} cy={s*0.62} rx={s*0.15} ry={s*0.13} transform={`rotate(15,${s*0.7},${s*0.62})`} />
        <rect x={s*0.47} y={s*0.18} width={s*0.06} height={s*0.6} rx={s*0.03} />
      </>
    );
  },
  lightning: (s) => <polygon points={`${s*0.65},${s*0.05} ${s*0.2},${s*0.48} ${s*0.5},${s*0.48} ${s*0.35},${s*0.95} ${s*0.8},${s*0.52} ${s*0.5},${s*0.52}`} />,
};

export default function ColorShape({ shape, color, size = 80 }: ColorShapeProps) {
  const renderer = SHAPE_PATHS[shape];
  if (!renderer) return <span style={{ fontSize: size * 0.6 }}>{"\uD83C\uDFA8"}</span>;

  const needsStroke = color === "#FFFFFF" || color === "#FFFDD0" || color === "#F5F5DC";
  const isHollow = shape === "hollowStar" || shape === "infinity";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{}}
    >
      <g
        fill={isHollow ? "none" : color}
        stroke={isHollow ? color : (needsStroke ? "#999" : color)}
        strokeWidth={isHollow ? size * 0.05 : (needsStroke ? 2 : 0)}
      >
        {renderer(size)}
      </g>
    </svg>
  );
}
