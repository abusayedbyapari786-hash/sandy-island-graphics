import React, { useState } from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS, SAFE_AREA, EASINGS } from '../designSystem';

// Real Image + Fallback Rich Nautical Texture Stage with 3D Camera Motion
const CinematicStage: React.FC<{ bgImage?: string; children: React.ReactNode }> = ({ bgImage = 'bg/map_dark.jpg', children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const [imgError, setImgError] = useState(false);

  // Smooth Hollywood Camera Push-in & Subtle Tilt
  const scale = interpolate(frame, [0, durationInFrames], [1.02, 1.14]);
  const panX = interpolate(frame, [0, durationInFrames], [0, -18]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#030711',
        ...SAFE_AREA,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Real High-Res Map Background Image with Ken Burns Camera Motion */}
      {!imgError ? (
        <Img
          src={staticFile(bgImage)}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            inset: -40,
            width: 'calc(100% + 80px)',
            height: 'calc(100% + 80px)',
            objectFit: 'cover',
            transform: `scale(${scale}) translateX(${panX}px)`,
            filter: 'brightness(0.48) contrast(1.18) saturate(1.1)',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: -40,
            transform: `scale(${scale})`,
            background: `radial-gradient(circle at 50% 45%, #163E57 0%, #071222 70%, #02050A 100%)`,
          }}
        />
      )}

      {/* Atmospheric Depth Lighting & Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(10,22,40,0.15) 0%, rgba(2,6,14,0.85) 100%)',
          pointerEvents: 'none',
        }}
      />

      {children}
    </AbsoluteFill>
  );
};

// TEMPLATE A: Cinema Title Card (Heavy 3D Word-by-Word Slam on Real Map)
export const TitleCardTemplate: React.FC<{ words: string[]; subtitle: string }> = ({ words, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Impact camera shake when each word slams down
  let shakeY = 0;
  words.forEach((_, idx) => {
    const landFrame = 12 + idx * 12 + 5;
    if (frame >= landFrame && frame <= landFrame + 8) {
      shakeY += Math.sin((frame - landFrame) * 2.4) * (8 - (frame - landFrame)) * 1.6;
    }
  });

  const lineStart = 14 + words.length * 12;
  const lineWidth = interpolate(frame, [lineStart, lineStart + 26], [0, 780], {
    easing: EASINGS.expoOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subOpacity = interpolate(frame, [lineStart + 8, lineStart + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <CinematicStage bgImage="bg/map_dark.jpg">
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
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '34px', maxWidth: 1600 }}>
          {words.map((word, idx) => {
            const delay = 12 + idx * 12;
            const slam = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 280, mass: 1.0 } });
            const y = interpolate(slam, [0, 1], [-260, 0]);
            const scale = interpolate(slam, [0, 1], [2.1, 1]);
            const wordOpacity = interpolate(frame, [delay, delay + 4], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const isHero = word === 'NEVER' || word === 'EXISTED' || word === 'BLANK';

            return (
              <span
                key={idx}
                style={{
                  fontFamily: FONTS.title,
                  fontSize: 162,
                  lineHeight: 0.96,
                  letterSpacing: '0.07em',
                  color: isHero ? '#F3C65F' : '#FFFFFF',
                  opacity: wordOpacity,
                  transform: `translateY(${y}px) scale(${scale})`,
                  textShadow: '0 4px 0 #26384F, 0 9px 0 #131E2D, 0 16px 0 #070C14, 0 28px 45px rgba(0,0,0,0.95)',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        <div
          style={{
            height: 4,
            width: lineWidth,
            background: `linear-gradient(90deg, transparent, ${COLORS.stampRed}, #F3C65F, ${COLORS.stampRed}, transparent)`,
            marginTop: 28,
            boxShadow: '0 0 24px rgba(243, 198, 95, 0.85)',
          }}
        />

        <div
          style={{
            marginTop: 26,
            padding: '12px 32px',
            backgroundColor: 'rgba(6, 14, 26, 0.82)',
            border: '1px solid rgba(243, 198, 95, 0.35)',
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
    </CinematicStage>
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
  const ringOpacity = interpolate((frame % 75) / 75, [0, 0.8, 1], [0.8, 0.25, 0]);

  return (
    <CinematicStage bgImage="bg/sonar.jpg">
      <div
        style={{
          position: 'absolute',
          width: 540,
          height: 540,
          borderRadius: '50%',
          border: `3px solid #38BDF8`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      <div style={{ zIndex: 10, textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 40, color: '#38BDF8', letterSpacing: '0.22em' }}>
          MULTI-BEAM ECHO SOUNDER
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 175,
            fontWeight: 700,
            color: '#FFFFFF',
            margin: '10px 0',
            textShadow: '0 6px 0 #1A2B42, 0 24px 40px rgba(0,0,0,0.9)',
          }}
        >
          {currentDepth.toLocaleString()} m
        </div>
        <div
          style={{
            display: 'inline-block',
            padding: '12px 30px',
            backgroundColor: 'rgba(6, 14, 26, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            fontFamily: FONTS.mono,
            fontSize: 40,
            color: COLORS.parchment,
          }}
        >
          {coordinates} • NO LANDMASS DETECTED
        </div>
      </div>
    </CinematicStage>
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
    <CinematicStage bgImage="bg/sonar.jpg">
      <div
        style={{
          zIndex: 10,
          padding: '54px 80px',
          backgroundColor: 'rgba(6, 14, 26, 0.86)',
          borderLeft: `8px solid #F3C65F`,
          boxShadow: '0 28px 65px rgba(0,0,0,0.9)',
        }}
      >
        <div style={{ fontFamily: FONTS.ui, fontWeight: 700, fontSize: 40, color: '#F3C65F', marginBottom: 16, letterSpacing: '0.12em' }}>
          {label}
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 100, fontWeight: 700, color: '#FFFFFF' }}>
          {coordinates.slice(0, charCount)}
          <span style={{ opacity: cursorVisible ? 1 : 0, color: '#F3C65F' }}>_</span>
        </div>
      </div>
    </CinematicStage>
  );
};

// TEMPLATE F: Shot 40 Transparent Overlay Stamp Slam with Heavy Impact Shake
export const StampOverlayTemplate: React.FC<{ stampText: string }> = ({ stampText }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slam = spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 320, mass: 1.1 } });
  const scale = interpolate(slam, [0, 1], [2.8, 1]);
  const opacity = interpolate(frame, [15, 20, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shakeX = frame >= 22 && frame <= 38 ? Math.sin(frame * 2.5) * (38 - frame) * 1.6 : 0;
  const shakeY = frame >= 22 && frame <= 38 ? Math.cos(frame * 3.1) * (38 - frame) * 1.4 : 0;

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
          backgroundColor: 'rgba(10, 22, 40, 0.78)',
          fontFamily: FONTS.title,
          fontSize: 165,
          letterSpacing: '0.1em',
          color: COLORS.stampRed,
          boxShadow: '0 26px 60px rgba(0,0,0,0.9)',
        }}
      >
        {stampText}
      </div>
    </AbsoluteFill>
  );
};
