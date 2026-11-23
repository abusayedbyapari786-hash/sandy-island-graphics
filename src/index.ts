import { registerRoot, Composition } from 'remotion';
import React from 'react';
import shots from './data/shots.json';
import { TitleCardTemplate, SonarTemplate, TypewriterCoordsTemplate, StampOverlayTemplate } from './templates/Templates';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Shot05" component={TitleCardTemplate} durationInFrames={shots.shot05.durationInFrames} fps={60} width={1920} height={1080} defaultProps={shots.shot05} />
    <Composition id="Shot29" component={SonarTemplate} durationInFrames={shots.shot29.durationInFrames} fps={60} width={1920} height={1080} defaultProps={shots.shot29} />
    <Composition id="Shot30" component={TypewriterCoordsTemplate} durationInFrames={shots.shot30.durationInFrames} fps={60} width={1920} height={1080} defaultProps={shots.shot30} />
    <Composition id="Shot40" component={StampOverlayTemplate} durationInFrames={shots.shot40.durationInFrames} fps={60} width={1920} height={1080} defaultProps={shots.shot40} />
    <Composition id="Shot47" component={TitleCardTemplate} durationInFrames={shots.shot47.durationInFrames} fps={60} width={1920} height={1080} defaultProps={shots.shot47} />
  </>
);

registerRoot(RemotionRoot);
