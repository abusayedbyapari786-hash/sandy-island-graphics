import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Database, Smartphone, Compass, MapPin } from 'lucide-react';
import { COLORS, FONTS, SAFE_AREA, EASINGS } from '../designSystem';

// Reusable Parchment/Navy Stage (No grain/vignette — handled in Kdenlive V4)
const MapStage: React.FC<{ parchment?: boolean; children: React.ReactNode }> = ({ parchment = false, children }) => (
  <AbsoluteFill
    style={{
      background: parchment
        ? `radial-gradient(circle at 50% 50%, #F3EAD3 0%, ${COLORS.parchment} 70%, #CBB894 100%)`
        : `radial-gradient(circle at 50% 45%, ${COLORS.teal}44 0%, ${COLORS.navy} 75%)`,
      ...SAFE_AREA,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(${parchment ? '#8B735522' : COLORS.gold + '18'} 1px, transparent 1px), linear-gradient(90deg, ${parchment ? '#8B735522' : COLORS.gold + '18'} 1px, transparent 1px)`,
        backgroundSize: '120px 120px',
      }}
    />
    {children}
  </AbsoluteFill>
);

// TEMPLATE B: Shot 11 SVG Ink Stroke-Draw ("Sandy Island")
export const InkWriteTemplate: React.FC = () => {
  const frame = useCurrentFrame();
  const drawProg = interpolate(frame, [15, 130], [1, 0], { easing: EASINGS.smoothOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textOpacity = interpolate(frame, [50, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <MapStage parchment>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        {/* Hand-drawn island SVG path */}
        <svg width="420" height="240" viewBox="0 0 420 240">
          <path
            d="M80,140 C95,80 180,60 260,85 C330,105 350,165 290,190 C220,215 110,195 80,140 Z"
            fill="rgba(139, 115, 85, 0.18)"
            stroke="#2C1E12"
            strokeWidth="5"
            strokeDasharray="850"
            strokeDashoffset={850 * drawProg}
          />
        </svg>
        <div
          style={{
            fontFamily: FONTS.history,
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 110,
            color: '#1E140B',
            opacity: textOpacity,
            marginTop: 10,
          }}
        >
          Sandy Island
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 32, color: '#5C4328', opacity: textOpacity }}>
          19°15&apos; S, 159°55&apos; E • LOGGED 1876
        </div>
      </div>
    </MapStage>
  );
};

// TEMPLATE C: Map Engine (Shots 13, 14, 18, 19, 24, 36, 39, 42, 46)
export const MapEngineTemplate: React.FC<{ mode: string; title?: string; subtitle?: string }> = ({ mode, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const zoom = interpolate(frame, [0, durationInFrames], mode === 'zoomOut' ? [1.22, 1.0] : [1.0, 1.12]);
  const animP = interpolate(frame, [15, durationInFrames - 30], [0, 1], { easing: EASINGS.expoOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <MapStage parchment={mode === 'ed' || mode === 'erase'}>
      <div style={{ transform: `scale(${zoom})`, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Shot 13 & 42: Map Line Copy / Loop */}
        {(mode === 'copy' || mode === 'loop') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ padding: 40, border: `3px solid ${COLORS.gold}`, backgroundColor: COLORS.darkBacking, borderRadius: 8 }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 36, color: COLORS.gold }}>SOURCE CHART (1876)</div>
              <div style={{ fontFamily: FONTS.history, fontSize: 64, color: COLORS.textWhite, marginTop: 10 }}>Sandy Island</div>
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 72, color: COLORS.stampRed, opacity: animP }}>
              {mode === 'loop' ? '↻ LOOP' : '⟹ COPY'}
            </div>
            <div style={{ padding: 40, border: `3px solid ${COLORS.teal}`, backgroundColor: COLORS.darkBacking, borderRadius: 8, opacity: animP }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 36, color: '#5EEAD4' }}>{mode === 'loop' ? 'NEW EDITION' : 'ADMIRALTY CHART'}</div>
              <div style={{ fontFamily: FONTS.history, fontSize: 64, color: COLORS.textWhite, marginTop: 10 }}>Sandy Island</div>
            </div>
          </div>
        )}

        {/* Shot 14: Timeline 1876 -> 1900 -> 1908 */}
        {mode === 'timeline' && (
          <div style={{ width: 1400 }}>
            <div style={{ height: 6, width: `${animP * 100}%`, backgroundColor: COLORS.gold, marginBottom: 30 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {['1876 • SIGHTED', '1900 • COPIED', '1908 • ADMIRALTY'].map((item, i) => (
                <div key={i} style={{ padding: '16px 28px', backgroundColor: COLORS.darkBacking, borderTop: `4px solid ${COLORS.stampRed}`, fontFamily: FONTS.title, fontSize: 56, color: COLORS.textWhite }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shot 18 & 19: E.D. Stamp & 1974 Eraser */}
        {(mode === 'ed' || mode === 'erase') && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: FONTS.history, fontSize: 92, fontWeight: 700, color: '#1E140B', opacity: mode === 'erase' ? 1 - animP * 0.85 : 1, textDecoration: mode === 'erase' && animP > 0.5 ? 'line-through' : 'none' }}>
              SANDY ISLAND
            </div>
            <div style={{ fontFamily: FONTS.title, fontSize: 130, color: COLORS.stampRed, opacity: animP, marginTop: 10 }}>
              {mode === 'ed' ? 'E.D. — EXISTENCE DOUBTFUL' : '1974: REMOVED FROM FRENCH CHARTS'}
            </div>
          </div>
        )}

        {/* Shot 24: Digital Pixelation */}
        {mode === 'pixelate' && (
          <div style={{ textAlign: 'center', padding: '50px 80px', backgroundColor: COLORS.darkBacking, border: `2px solid ${COLORS.gold}` }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 42, color: COLORS.gold }}>WORLD VECTOR SHORELINE DATABASE</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 88, color: COLORS.textWhite, marginTop: 16 }}>
              POLYGON_ID: #SANDY_1876
            </div>
            <div style={{ fontFamily: FONTS.ui, fontSize: 38, color: '#5EEAD4', marginTop: 16 }}>
              PAPER ERROR CONVERTED TO DIGITAL VECTOR
            </div>
          </div>
        )}

        {/* Shot 36: 3 Phantom Island Pins */}
        {mode === 'pins' && (
          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { name: 'DOUGHERTY ISLAND', sub: 'REPORTED 1841 • SOUTHERN OCEAN' },
              { name: 'FRISLAND', sub: '16TH–17TH CENTURY • NORTH ATLANTIC' },
              { name: 'BERMEJA', sub: '2009 SEARCH: NOT FOUND • GULF OF MEXICO' },
            ].map((pin, idx) => {
              const s = spring({ frame: frame - (15 + idx * 25), fps, config: { damping: 14 } });
              return (
                <div key={idx} style={{ transform: `scale(${s})`, padding: '36px 40px', backgroundColor: COLORS.darkBacking, borderTop: `6px solid ${COLORS.stampRed}`, width: 480, textAlign: 'center' }}>
                  <MapPin size={56} color={COLORS.stampRed} style={{ margin: '0 auto 14px' }} />
                  <div style={{ fontFamily: FONTS.title, fontSize: 64, color: COLORS.textWhite }}>{pin.name}</div>
                  <div style={{ fontFamily: FONTS.ui, fontSize: 30, color: COLORS.gold, marginTop: 10 }}>{pin.sub}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Shot 39: Gulf of Mexico Search Grid */}
        {mode === 'search' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 460, height: 460, borderRadius: '50%', border: `4px dashed ${COLORS.gold}`, margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${frame * 0.8}deg)` }}>
              <Compass size={120} color={COLORS.gold} />
            </div>
            <div style={{ fontFamily: FONTS.title, fontSize: 84, color: COLORS.textWhite }}>GULF OF MEXICO SURVEY (2009)</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 42, color: COLORS.stampRed }}>RESULT: OPEN WATER • NO ISLAND</div>
          </div>
        )}

        {/* Shot 46: Thesis Zoom Out */}
        {mode === 'zoomOut' && (
          <div style={{ textAlign: 'center', padding: '50px 90px', backgroundColor: COLORS.darkBacking }}>
            <div style={{ fontFamily: FONTS.title, fontSize: 145, color: COLORS.gold, letterSpacing: '0.08em' }}>{title}</div>
            <div style={{ fontFamily: FONTS.ui, fontSize: 42, color: COLORS.textWhite, marginTop: 12 }}>{subtitle}</div>
          </div>
        )}
      </div>
    </MapStage>
  );
};

// TEMPLATE D3: Shot 45 Data Row -> Generic App Icons Copy
export const DataPropagationTemplate: React.FC = () => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [20, 120], [0, 1], { easing: EASINGS.expoOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <MapStage>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50 }}>
        <div style={{ padding: '28px 54px', backgroundColor: COLORS.darkBacking, border: `3px solid ${COLORS.stampRed}`, display: 'flex', alignItems: 'center', gap: 24 }}>
          <Database size={54} color={COLORS.stampRed} />
          <span style={{ fontFamily: FONTS.mono, fontSize: 46, color: COLORS.textWhite }}>1 CORRUPTED ENTRY</span>
        </div>
        <div style={{ display: 'flex', gap: 45, opacity: prog, transform: `translateY(${(1 - prog) * 40}px)` }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{ padding: '30px 36px', backgroundColor: COLORS.darkBacking, borderTop: `4px solid ${COLORS.gold}`, textAlign: 'center' }}>
              <Smartphone size={56} color={COLORS.gold} style={{ margin: '0 auto 12px' }} />
              <div style={{ fontFamily: FONTS.mono, fontSize: 32, color: COLORS.textWhite }}>MAP APP #{n}</div>
            </div>
          ))}
        </div>
      </div>
    </MapStage>
  );
};

// TEMPLATE E: Date Cards (Shots 32 & 33)
export const DateCardTemplate: React.FC<{ dateText: string; headline: string }> = ({ dateText, headline }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(frame, [0, 18, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <MapStage>
      <div style={{ opacity, padding: '55px 85px', backgroundColor: COLORS.darkBacking, borderLeft: `8px solid ${COLORS.gold}`, maxWidth: 1500 }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 46, color: COLORS.gold, marginBottom: 16 }}>{dateText}</div>
        <div style={{ fontFamily: FONTS.title, fontSize: 108, color: COLORS.textWhite, lineHeight: 1.05 }}>{headline}</div>
      </div>
    </MapStage>
  );
};

// TEMPLATE G: Illustration Cards (Shots 16 & 44)
export const IllustrationTemplate: React.FC<{ variant: 'size' | 'agloe' }> = ({ variant }) => {
  return (
    <MapStage>
      <div style={{ padding: '50px 80px', backgroundColor: COLORS.darkBacking, border: `2px solid ${COLORS.gold}`, textAlign: 'center', maxWidth: 1450 }}>
        {variant === 'size' ? (
          <>
            <div style={{ fontFamily: FONTS.mono, fontSize: 40, color: COLORS.gold }}>HISTORICAL CHART ESTIMATES</div>
            <div style={{ fontFamily: FONTS.title, fontSize: 115, color: COLORS.textWhite, margin: '18px 0' }}>
              REPORTED SIZE: TENS OF SQUARE MILES
            </div>
            <div style={{ fontFamily: FONTS.ui, fontSize: 38, color: COLORS.parchment }}>
              UNCONFIRMED DIMENSIONS • NO SURVEY RECORDED
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'inline-block', padding: '6px 18px', backgroundColor: COLORS.stampRed, fontFamily: FONTS.mono, fontSize: 28, color: '#fff', marginBottom: 20 }}>
              ILLUSTRATION
            </div>
            <div style={{ fontFamily: FONTS.title, fontSize: 115, color: COLORS.gold }}>AGLOE, NEW YORK</div>
            <div style={{ fontFamily: FONTS.ui, fontSize: 42, color: COLORS.textWhite, marginTop: 14 }}>
              A FICTIONAL COPYRIGHT TRAP THAT BECAME A REAL PLACE NAME
            </div>
          </>
        )}
      </div>
    </MapStage>
  );
};

// TEMPLATE H: Transparent Lower Third & Recreation Badge
export const LowerThirdTemplate: React.FC<{ text: string; isBadge?: boolean }> = ({ text, isBadge = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(frame, [0, 18, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (isBadge) {
    return (
      <AbsoluteFill style={{ ...SAFE_AREA, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
        <div style={{ opacity, padding: '10px 24px', backgroundColor: 'rgba(10, 22, 40, 0.8)', border: `2px solid ${COLORS.gold}`, fontFamily: FONTS.mono, fontSize: 36, color: COLORS.gold }}>
          {text}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ ...SAFE_AREA, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
      <div style={{ opacity, padding: '16px 32px', backgroundColor: COLORS.darkBacking, borderBottom: `5px solid ${COLORS.stampRed}` }}>
        <div style={{ fontFamily: FONTS.ui, fontWeight: 600, fontSize: 44, color: COLORS.textWhite }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};
