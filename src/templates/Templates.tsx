import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS, SAFE_AREA, EASINGS } from '../designSystem';

// Reusable Background Stage (No grain/vignette — handled on Kdenlive V4)
const NavyStage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 45%, ${COLORS.teal}44 0%, ${COLORS.navy} 75%)`,
      ...SAFE_AREA,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}
  >
    {/* Subtle nautical coordinate grid */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(${COLORS.gold}14 1px, transparent 1px), linear-gradient(90deg, ${COLORS.gold}14 1px, transparent 1px)`,
        backgroundSize: '120px 120px',
      }}
    />
    {children}
  </AbsoluteFill>
);

// TEMPLATE A: Ultra-Premium Word-by-Word Drop + Gold Hairline + Stagger
export const TitleCardTemplate: React.FC<{ words: string[]; subtitle: string }> = ({ words, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 0.3s Fade In/Out
  const opacity = interpolate(frame, [0, 18, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lineStart = 12 + words.length * 10;
  const lineWidth = interpolate(frame, [lineStart, lineStart + 28], [0, 640], {
    easing: EASINGS.expoOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subOpacity = interpolate(frame, [lineStart + 10, lineStart + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <NavyStage>
      <div style={{ opacity, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '28px', maxWidth: 1500 }}>
          {words.map((word, idx) => {
            const delay = 8 + idx * 9; // Staggered 0.15s per word
            const slam = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 220, mass: 0.9 } });
            const y = interpolate(slam, [0, 1], [-160, 0]);
            const scale = interpolate(slam, [0, 1], [1.45, 1]);
            const wordOpacity = interpolate(frame, [delay, delay + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const isHero = word === 'NEVER' || word === 'EXISTED' || word === 'BLANK';

            return (
              <span
                key={idx}
                style={{
                  fontFamily: FONTS.title,
                  fontSize: 138,
                  lineHeight: 0.98,
                  letterSpacing: '0.07em',
                  color: isHero ? COLORS.gold : COLORS.textWhite,
                  opacity: wordOpacity,
                  transform: `translateY(${y}px) scale(${scale})`,
                  textShadow: '0 16px 32px rgba(0,0,0,0.75)',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Gold Hairline */}
        <div
          style={{
            height: 3,
            width: lineWidth,
            backgroundColor: COLORS.gold,
            marginTop: 26,
            boxShadow: `0 0 18px ${COLORS.gold}88`,
          }}
        />

        {/* TV-Safe Subtitle with 50% Dark Backing */}
        <div
          style={{
            marginTop: 24,
            padding: '10px 26px',
            backgroundColor: COLORS.darkBacking,
            borderRadius: 4,
            opacity: subOpacity,
            fontFamily: FONTS.ui,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: '0.18em',
            color: COLORS.parchment,
          }}
        >
          {subtitle}
        </div>
      </div>
    </NavyStage>
  );
};

// TEMPLATE D1: Shot 29 Sonar Ping + Depth Counter (0 -> 1,400 m)
export const SonarTemplate: React.FC<{ targetDepth: number; coordinates: string }> = ({ targetDepth, coordinates }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [15, durationInFrames - 45], [0, 1], {
    easing: EASINGS.expoOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentDepth = Math.round(targetDepth * progress);
  const ringScale = interpolate((frame % 75) / 75, [0, 1], [0.2, 2.2]);
  const ringOpacity = interpolate((frame % 75) / 75, [0, 0.8, 1], [0.7, 0.2, 0]);

  return (
    <NavyStage>
      {/* Expanding Sonar Ping Ring */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: `3px solid ${COLORS.gold}`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      <div style={{ zIndex: 10, textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 40, color: COLORS.gold, letterSpacing: '0.2em' }}>
          MULTI-BEAM ECHO SOUNDER
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 165,
            fontWeight: 700,
            color: COLORS.textWhite,
            margin: '10px 0',
            textShadow: '0 12px 30px rgba(0,0,0,0.8)',
          }}
        >
          {currentDepth.toLocaleString()} m
        </div>
        <div
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            backgroundColor: COLORS.darkBacking,
            fontFamily: FONTS.mono,
            fontSize: 40,
            color: COLORS.parchment,
          }}
        >
          {coordinates} • NO LANDMASS DETECTED
        </div>
      </div>
    </NavyStage>
  );
};

// TEMPLATE D2: Shot 30 Typewriter Coordinates
export const TypewriterCoordsTemplate: React.FC<{ coordinates: string; label: string }> = ({ coordinates, label }) => {
  const frame = useCurrentFrame();
  const charCount = Math.floor(
    interpolate(frame, [15, 110], [0, coordinates.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <NavyStage>
      <div
        style={{
          zIndex: 10,
          padding: '48px 72px',
          backgroundColor: COLORS.darkBacking,
          borderLeft: `6px solid ${COLORS.gold}`,
        }}
      >
        <div style={{ fontFamily: FONTS.ui, fontWeight: 600, fontSize: 40, color: COLORS.gold, marginBottom: 16 }}>
          {label}
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 96, fontWeight: 700, color: COLORS.textWhite }}>
          {coordinates.slice(0, charCount)}
          <span style={{ opacity: cursorVisible ? 1 : 0, color: COLORS.gold }}>_</span>
        </div>
      </div>
    </NavyStage>
  );
};

// TEMPLATE F: Shot 40 Transparent Overlay Stamp Slam with Impact Shake
export const StampOverlayTemplate: React.FC<{ stampText: string }> = ({ stampText }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slam = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 280, mass: 1.1 } });
  const scale = interpolate(slam, [0, 1], [2.4, 1]);
  const opacity = interpolate(frame, [15, 20, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Micro impact shake right after stamp hits (frames 22-36)
  const shakeX = frame >= 22 && frame <= 36 ? Math.sin(frame * 2.5) * (36 - frame) * 1.2 : 0;
  const shakeY = frame >= 22 && frame <= 36 ? Math.cos(frame * 3.1) * (36 - frame) * 1.0 : 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale}) rotate(-8deg)`,
          border: `12px solid ${COLORS.stampRed}`,
          padding: '24px 60px',
          backgroundColor: 'rgba(10, 22, 40, 0.65)',
          fontFamily: FONTS.title,
          fontSize: 150,
          letterSpacing: '0.1em',
          color: COLORS.stampRed,
          boxShadow: '0 20px 50px rgba(0,0,0,0.75)',
        }}
      >
        {stampText}
      </div>
    </AbsoluteFill>
  );
};
