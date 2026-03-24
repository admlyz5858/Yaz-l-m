import { View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

import { Brand } from '@/constants/theme';

type Props = {
  size?: number;
  showGlow?: boolean;
};

/**
 * Marka logosu: kitap + dijital ağaç (devre hatları, uç düğümler, üst parıltı).
 */
export function LadekLogo({ size = 120, showGlow = true }: Props) {
  const w = size;
  const h = size * 0.95;
  const cx = w / 2;
  const bookY = h * 0.62;

  return (
    <View style={{ width: w, height: h }}>
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Defs>
          <LinearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#f8fafc" />
            <Stop offset="1" stopColor="#e2e8f0" />
          </LinearGradient>
          <LinearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={Brand.glow} />
            <Stop offset="1" stopColor={Brand.electric} />
          </LinearGradient>
          <RadialGradient id="topGlow" cx="50%" cy="35%" rx="40%" ry="30%">
            <Stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <Stop offset="0.4" stopColor={Brand.glowTop} stopOpacity="0.8" />
            <Stop offset="1" stopColor={Brand.electric} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Kitap tabanı */}
        <Path
          d={`M ${cx - w * 0.28} ${bookY} L ${cx - w * 0.32} ${h * 0.88} L ${cx + w * 0.32} ${h * 0.88} L ${cx + w * 0.28} ${bookY} Z`}
          fill="url(#bookGrad)"
          stroke={Brand.electricDim}
          strokeWidth={1.5}
        />
        <Line
          x1={cx}
          y1={bookY}
          x2={cx}
          y2={h * 0.88}
          stroke={Brand.navyLight}
          strokeWidth={1}
          opacity={0.35}
        />

        {/* Devre gövdesi / dallar */}
        <Path
          d={`M ${cx} ${bookY - 2} L ${cx} ${h * 0.22} M ${cx} ${h * 0.38} L ${cx - w * 0.18} ${h * 0.28} M ${cx} ${h * 0.38} L ${cx + w * 0.18} ${h * 0.28} M ${cx} ${h * 0.52} L ${cx - w * 0.22} ${h * 0.45} M ${cx} ${h * 0.52} L ${cx + w * 0.22} ${h * 0.45}`}
          stroke="url(#lineGrad)"
          strokeWidth={2.2}
          strokeLinecap="round"
        />

        {/* Uç düğümler */}
        {[
          [cx, h * 0.18],
          [cx - w * 0.18, h * 0.28],
          [cx + w * 0.18, h * 0.28],
          [cx - w * 0.22, h * 0.45],
          [cx + w * 0.22, h * 0.45],
        ].map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={w * 0.035} fill={Brand.electric} stroke="#fff" strokeWidth={1} />
        ))}

        {/* Üst parıltı */}
        {showGlow ? <Circle cx={cx} cy={h * 0.2} r={w * 0.12} fill="url(#topGlow)" /> : null}
      </Svg>
    </View>
  );
}

/** Küçük favicon / satır içi ikon (sadece ağaç) */
export function LadekMark({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Defs>
        <LinearGradient id="mline" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={Brand.glow} />
          <Stop offset="1" stopColor={Brand.electric} />
        </LinearGradient>
      </Defs>
      <Path d="M16 28 L12 28 L10 20 L22 20 L20 28 Z" fill="#f1f5f9" stroke={Brand.electricDim} strokeWidth="0.5" />
      <Path
        d="M16 20 L16 8 M16 14 L11 10 M16 14 L21 10 M16 17 L9 15 M16 17 L23 15"
        stroke="url(#mline)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="16" cy="7" r="2" fill={Brand.electric} />
    </Svg>
  );
}
