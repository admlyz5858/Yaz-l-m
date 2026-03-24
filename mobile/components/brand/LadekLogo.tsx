import { useId } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import { Brand } from '@/constants/theme';

type Props = {
  size?: number;
  showGlow?: boolean;
};

/**
 * LadeK Academy amblemi: açık kitap + PCB/neural ağaç, cyan→navy geçişi, üst yıldız parıltısı.
 * (Tasarım sayfasıyla hizalı; çoklu örnek için benzersiz gradient id.)
 */
export function LadekLogo({ size = 120, showGlow = true }: Props) {
  const uid = useId().replace(/:/g, '');
  const w = size;
  const h = size * 1.02;
  const cx = w / 2;
  const bookTop = h * 0.58;
  const bookBot = h * 0.92;

  const bookL = cx - w * 0.3;
  const bookR = cx + w * 0.3;
  const spineW = w * 0.04;

  return (
    <View style={{ width: w, height: h }}>
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Defs>
          <LinearGradient id={`${uid}-bookL`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#ffffff" />
            <Stop offset="0.5" stopColor="#e0f2fe" />
            <Stop offset="1" stopColor="#bae6fd" />
          </LinearGradient>
          <LinearGradient id={`${uid}-bookR`} x1="1" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#f8fafc" />
            <Stop offset="1" stopColor="#e2e8f0" />
          </LinearGradient>
          <LinearGradient id={`${uid}-cover`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Brand.electric} />
            <Stop offset="0.5" stopColor={Brand.royal} />
            <Stop offset="1" stopColor={Brand.navy} />
          </LinearGradient>
          <LinearGradient id={`${uid}-tree`} x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0" stopColor={Brand.electric} />
            <Stop offset="0.45" stopColor={Brand.electricDim} />
            <Stop offset="1" stopColor={Brand.navy} />
          </LinearGradient>
          <RadialGradient id={`${uid}-halo`} cx="50%" cy="28%" rx="55%" ry="45%">
            <Stop offset="0" stopColor={Brand.electric} stopOpacity="0.45" />
            <Stop offset="0.5" stopColor={Brand.electricDim} stopOpacity="0.15" />
            <Stop offset="1" stopColor={Brand.navyDeep} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={`${uid}-star`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <Stop offset="0.35" stopColor={Brand.glowTop} stopOpacity="0.9" />
            <Stop offset="1" stopColor={Brand.electric} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {showGlow ? <Circle cx={cx} cy={h * 0.32} r={w * 0.42} fill={`url(#${uid}-halo)`} /> : null}

        {/* Kitap — perspektif hissi */}
        <Path
          d={`M ${cx - spineW / 2} ${bookTop} L ${bookL} ${bookTop + h * 0.03} L ${bookL} ${bookBot} L ${cx - spineW / 2} ${bookBot - h * 0.02} Z`}
          fill={`url(#${uid}-bookL)`}
          stroke={Brand.electricDim}
          strokeWidth={1.2}
        />
        <Path
          d={`M ${cx + spineW / 2} ${bookTop} L ${bookR} ${bookTop + h * 0.03} L ${bookR} ${bookBot} L ${cx + spineW / 2} ${bookBot - h * 0.02} Z`}
          fill={`url(#${uid}-bookR)`}
          stroke={Brand.electricDim}
          strokeWidth={1.2}
        />
        <Path
          d={`M ${cx - spineW / 2} ${bookTop} L ${cx + spineW / 2} ${bookTop} L ${cx + spineW / 2} ${bookBot - h * 0.02} L ${cx - spineW / 2} ${bookBot - h * 0.02} Z`}
          fill={`url(#${uid}-cover)`}
        />
        <Line
          x1={cx}
          y1={bookTop}
          x2={cx}
          y2={bookBot - h * 0.02}
          stroke="#ffffff"
          strokeWidth={0.8}
          opacity={0.35}
        />

        {/* Dijital ağaç — gövde + PCB dalları */}
        <G stroke={`url(#${uid}-tree)`} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path
            d={`M ${cx} ${bookTop - 2} L ${cx} ${h * 0.14}`}
            strokeWidth={w * 0.022}
          />
          <Path
            d={`M ${cx} ${h * 0.32} L ${cx - w * 0.2} ${h * 0.22} M ${cx} ${h * 0.32} L ${cx + w * 0.2} ${h * 0.22}`}
            strokeWidth={w * 0.018}
          />
          <Path
            d={`M ${cx} ${h * 0.42} L ${cx - w * 0.24} ${h * 0.36} M ${cx} ${h * 0.42} L ${cx + w * 0.24} ${h * 0.36}`}
            strokeWidth={w * 0.016}
          />
          <Path
            d={`M ${cx} ${h * 0.5} L ${cx - w * 0.18} ${h * 0.48} M ${cx} ${h * 0.5} L ${cx + w * 0.18} ${h * 0.48}`}
            strokeWidth={w * 0.014}
          />
          <Path
            d={`M ${cx - w * 0.2} ${h * 0.22} L ${cx - w * 0.28} ${h * 0.12} M ${cx + w * 0.2} ${h * 0.22} L ${cx + w * 0.28} ${h * 0.12}`}
            strokeWidth={w * 0.014}
          />
          <Path
            d={`M ${cx - w * 0.24} ${h * 0.36} L ${cx - w * 0.32} ${h * 0.26} M ${cx + w * 0.24} ${h * 0.36} L ${cx + w * 0.32} ${h * 0.26}`}
            strokeWidth={w * 0.012}
          />
        </G>

        {(
          [
            [cx, h * 0.12],
            [cx - w * 0.28, h * 0.12],
            [cx + w * 0.28, h * 0.12],
            [cx - w * 0.2, h * 0.22],
            [cx + w * 0.2, h * 0.22],
            [cx - w * 0.32, h * 0.26],
            [cx + w * 0.32, h * 0.26],
            [cx - w * 0.24, h * 0.36],
            [cx + w * 0.24, h * 0.36],
            [cx - w * 0.18, h * 0.48],
            [cx + w * 0.18, h * 0.48],
          ] as const
        ).map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={w * 0.028} fill={Brand.electric} stroke="#fff" strokeWidth={1.2} />
        ))}

        {/* Üst yıldız / odak */}
        {showGlow ? (
          <>
            <Circle cx={cx} cy={h * 0.11} r={w * 0.055} fill={`url(#${uid}-star)`} />
            <Polygon
              points={`${cx},${h * 0.04} ${cx + w * 0.015},${h * 0.09} ${cx + w * 0.04},${h * 0.09} ${cx + w * 0.02},${h * 0.115} ${cx + w * 0.03},${h * 0.15} ${cx},${h * 0.125} ${cx - w * 0.03},${h * 0.15} ${cx - w * 0.02},${h * 0.115} ${cx - w * 0.04},${h * 0.09} ${cx - w * 0.015},${h * 0.09}`}
              fill="#ffffff"
              opacity={0.85}
            />
          </>
        ) : null}
      </Svg>
    </View>
  );
}

export function LadekMark({ size = 32 }: { size?: number }) {
  return <LadekLogo size={size} showGlow={false} />;
}
