import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS, SAFE_AREA, EASINGS } from '../designSystem';

// Ultra-Premium 3D Navy Stage with Volumetric Light & Floating Gold Dust Particles
const NavyStage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const camScale = interpolate(frame, [0, durationInFrames], [1.0, 1.09]);
  const particles = Array.from({ length: 28 }, (_, i) => ({
    x: (i * 197) % 1920,
    y: ((i * 313 - frame * (0.6 + (i % 4) * 0.25)) + 2160) % 1080,
    size: 2.5 + (i % 3) * 1.5,
    opacity: 0.2 + (i % 5) * 0.1,
  }));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #133A52 0%, ${COLORS.navy} 68%, #040914 100%)`,
        ...SAFE_AREA,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Slowly Zooming Nautical Grid & Topographic Contours */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `scale(${camScale})`,
          backgroundImage: `linear-gradient(${COLORS.gold}1A 1px, transparent 1px), linear-gradient(90deg, ${COLORS.gold}1A 1px, transparent 1px), radial-gradient(circle at 50% 50%, transparent 320px, ${COLORS.gold}22 322px, transparent 324px)`,
          backgroundSize: '120px 120px, 120px 120px, 100% 100%',
        }}
      />

      {/* Top Volumetric Golden Light Flare */}
      <div
        style={{
          position: 'absolute',
          top: -220,
          width: 1200,
          height: 550,
          background: `radial-gradient(ellipse at center, ${COLORS.gold}33 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Floating Gold Dust Particles */}
      {particles.map((p, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: COLORS.gold,
            opacity: p.opacity,
            boxShadow: `0 0 8px ${COLORS.gold}`,
          }}
        />
      ))}

      {children}
    </AbsoluteFill>
  );
};

// TEMPLATE A: Cinema-Grade Word-by-Word Heavy Drop + Impact Micro-Shake + Gold Hairline
export const TitleCardTemplate: React.FC<{ words: string[]; subtitle: string }> = ({ words, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle camera impact shake every time a word lands
  let shakeY = 0;
  words.forEach((_, idx) => {
    const landFrame = 10 + idx * 11 + 5;
    if (frame >= landFrame && frame <= landFrame + 7) {
      shakeY += Math.sin((frame - landFrame) * 2.2) * (7 - (frame - landFrame)) * 1.4;
    }
  });

  const lineStart = 12 + words.length * 11;
  const lineWidth = interpolate(frame, [lineStart, lineStart + 26], [0, 740], {
    easing: EASINGS.expoOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subOpacity = interpolate(frame, [lineStart + 8, lineStart + 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <NavyStage>
      <div
        style={{
          opacity,
          transform: `translateY(${shakeY}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', maxWidth: 1560 }}>
          {words.map((word, idx) => {
            const delay = 10 + idx * 11;
            const slam = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 260, mass: 1.0 } });
            const y = interpolate(slam, [0, 1], [-220, 0]);
            const scale = interpolate(slam, [0, 1], [1.85, 1]);
            const wordOpacity = interpolate(frame, [delay, delay + 5], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const isHero = word === 'NEVER' || word === 'EXISTED' || word === 'BLANK';

            return (
              <span
                key={idx}
                style={{
                  fontFamily: FONTS.title,
                  fontSize: 152,
                  lineHeight: 0.98,
                  letterSpacing: '0.07em',
                  color: isHero ? COLORS.gold : COLORS.textWhite,
                  opacity: wordOpacity,
                  transform: `translateY(${y}px) scale(${scale})`,
                  // 3D Extruded Block Shadow
                  textShadow: '0 4px 0 #1A2B42, 0 8px 0 #0F1A29, 0 14px 0 #070D16, 0 26px 40px rgba(0,0,0,0.9)',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Glowing Gold & Crimson Hairline */}
        <div
          style={{
            height: 4,
            width: lineWidth,
            background: `linear-gradient(90deg, transparent, ${COLORS.stampRed}, ${COLORS.gold}, ${COLORS.stampRed}, transparent)`,
            marginTop: 28,
            boxShadow: `0 0 22px ${COLORS.gold}`,
          }}
        />

        {/* TV-Safe Subtitle Box */}
        <div
          style={{
            marginTop: 26,
            padding: '12px 30px',
            backgroundColor: COLORS.darkBacking,
            border: `1px solid ${COLORS.gold}44`,
            borderRadius: 4,
            opacity: subOpacity,
            fontFamily: FONTS.ui,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: '0.2em',
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
  const ringScale = interpolate((frame % 75) / 75, [0, 1], [0.2, 2.3]);
  const ringOpacity = interpolate((frame % 75) / 75, [0, 0.8, 1], [0.75, 0.25, 0]);

  return (
    <NavyStage>
      <div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          borderRadius: '50%',
          border: `3px solid ${COLORS.gold}`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      <div style={{ zIndex: 10, textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 40, color: COLORS.gold, letterSpacing: '0.22em' }}>
          MULTI-BEAM ECHO SOUNDER
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 170,
            fontWeight: 700,
            color: COLORS.textWhite,
            margin: '10px 0',
            textShadow: '0 6px 0 #1A2B42, 0 20px 35px rgba(0,0,0,0.85)',
          }}
        >
          {currentDepth.toLocaleString()} m
        </div>
        <div
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            backgroundColor: COLORS.darkBacking,
            border: `1px solid ${COLORS.gold}44`,
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
          padding: '52px 78px',
          backgroundColor: COLORS.darkBacking,
          borderLeft: `8px solid ${COLORS.gold}`,
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ fontFamily: FONTS.ui, fontWeight: 700, fontSize: 40, color: COLORS.gold, marginBottom: 16, letterSpacing: '0.12em' }}>
          {label}
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 98, fontWeight: 700, color: COLORS.textWhite }}>
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

  const slam = spring({ frame: frame - 15, fps, config: { damping: 11, stiffness: 300, mass: 1.1 } });
  const scale = interpolate(slam, [0, 1], [2.6, 1]);
  const opacity = interpolate(frame, [15, 20, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shakeX = frame >= 22 && frame <= 38 ? Math.sin(frame * 2.5) * (38 - frame) * 1.4 : 0;
  const shakeY = frame >= 22 && frame <= 38 ? Math.cos(frame * 3.1) * (38 - frame) * 1.2 : 0;

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
          border: `14px solid ${COLORS.stampRed}`,
          padding: '26px 68px',
          backgroundColor: 'rgba(10, 22, 40, 0.72)',
          fontFamily: FONTS.title,
          fontSize: 160,
          letterSpacing: '0.1em',
          color: COLORS.stampRed,
          boxShadow: '0 24px 55px rgba(0,0,0,0.85)',
        }}
      >
        {stampText}
      </div>
    </AbsoluteFill>
  );
};
