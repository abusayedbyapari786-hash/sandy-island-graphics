import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS, SAFE_AREA } from '../designSystem';

export const ImageClipTemplate: React.FC<{
  imageFile: string;
  motionType?: 'zoomIn' | 'zoomOut' | 'panRight' | 'panLeft';
  showRecreationBadge?: boolean;
}> = ({ imageFile, motionType = 'zoomIn', showRecreationBadge = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Smooth 0.3s fade in/out
  const opacity = interpolate(frame, [0, 18, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cinematic 3D Ken Burns Camera Motion
  let scale = 1.05;
  let translateX = 0;
  let translateY = 0;

  if (motionType === 'zoomIn') {
    scale = interpolate(frame, [0, durationInFrames], [1.0, 1.14]);
    translateY = interpolate(frame, [0, durationInFrames], [0, -14]);
  } else if (motionType === 'zoomOut') {
    scale = interpolate(frame, [0, durationInFrames], [1.15, 1.01]);
  } else if (motionType === 'panRight') {
    scale = 1.1;
    translateX = interpolate(frame, [0, durationInFrames], [-35, 35]);
  } else if (motionType === 'panLeft') {
    scale = 1.1;
    translateX = interpolate(frame, [0, durationInFrames], [35, -35]);
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#030711', overflow: 'hidden' }}>
      <Img
        src={staticFile(imageFile)}
        style={{
          position: 'absolute',
          inset: -50,
          width: 'calc(100% + 100px)',
          height: 'calc(100% + 100px)',
          objectFit: 'cover',
          opacity,
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          filter: 'contrast(1.06) saturate(1.05)',
        }}
      />

      {/* Optional Recreation Badge for historical reconstruction shots */}
      {showRecreationBadge && (
        <AbsoluteFill style={{ ...SAFE_AREA, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
          <div
            style={{
              opacity,
              padding: '8px 20px',
              backgroundColor: 'rgba(10, 22, 40, 0.78)',
              border: `1.5px solid ${COLORS.gold}`,
              fontFamily: FONTS.mono,
              fontSize: 32,
              color: COLORS.gold,
              letterSpacing: '0.12em',
            }}
          >
            RECREATION
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
