import { registerRoot, Composition } from 'remotion';
import React from 'react';
import shots from './data/shots.json';
import { TitleCardTemplate, SonarTemplate, TypewriterCoordsTemplate, StampOverlayTemplate } from './templates/Templates';
import { InkWriteTemplate, MapEngineTemplate, DataPropagationTemplate, DateCardTemplate, IllustrationTemplate, LowerThirdTemplate } from './templates/MapAndExtraTemplates';

export const RemotionRoot: React.FC = () => {
  return React.createElement(
    React.Fragment,
    null,
    // Template A: Title & Outro
    React.createElement(Composition, { id: 'Shot05', component: TitleCardTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: shots.shot05 }),
    React.createElement(Composition, { id: 'Shot47', component: TitleCardTemplate, durationInFrames: 300, fps: 60, width: 1920, height: 1080, defaultProps: shots.shot47 }),

    // Template B: Ink Write
    React.createElement(Composition, { id: 'Shot11', component: InkWriteTemplate, durationInFrames: 300, fps: 60, width: 1920, height: 1080 }),

    // Template C: Map Engine (9 Shots)
    React.createElement(Composition, { id: 'Shot13', component: MapEngineTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { mode: 'copy' } }),
    React.createElement(Composition, { id: 'Shot14', component: MapEngineTemplate, durationInFrames: 270, fps: 60, width: 1920, height: 1080, defaultProps: { mode: 'timeline' } }),
    React.createElement(Composition, { id: 'Shot18', component: MapEngineTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { mode: 'ed' } }),
    React.createElement(Composition, { id: 'Shot19', component: MapEngineTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { mode: 'erase' } }),
    React.createElement(Composition, { id: 'Shot24', component: MapEngineTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { mode: 'pixelate' } }),
    React.createElement(Composition, { id: 'Shot36', component: MapEngineTemplate, durationInFrames: 300, fps: 60, width: 1920, height: 1080, defaultProps: { mode: 'pins' } }),
    React.createElement(Composition, { id: 'Shot39', component: MapEngineTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { mode: 'search' } }),
    React.createElement(Composition, { id: 'Shot42', component: MapEngineTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { mode: 'loop' } }),
    React.createElement(Composition, { id: 'Shot46', component: MapEngineTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { mode: 'zoomOut', title: 'A MAP IS A CLAIM.', subtitle: 'EVERY CLAIM NEEDS SOMEONE WILLING TO CHECK IT' } }),

    // Template D: Data & Sonar
    React.createElement(Composition, { id: 'Shot23', component: MapEngineTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { mode: 'pixelate' } }),
    React.createElement(Composition, { id: 'Shot29', component: SonarTemplate, durationInFrames: 270, fps: 60, width: 1920, height: 1080, defaultProps: shots.shot29 }),
    React.createElement(Composition, { id: 'Shot30', component: TypewriterCoordsTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: shots.shot30 }),
    React.createElement(Composition, { id: 'Shot45', component: DataPropagationTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080 }),

    // Template E: Date Cards
    React.createElement(Composition, { id: 'Shot32', component: DateCardTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { dateText: 'NOVEMBER 26, 2012', headline: 'GOOGLE CORRECTS ITS MAP' } }),
    React.createElement(Composition, { id: 'Shot33', component: DateCardTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { dateText: 'NOVEMBER 29, 2012', headline: 'NATIONAL GEOGRAPHIC REMOVES IT' } }),

    // Template F: Stamp Overlay
    React.createElement(Composition, { id: 'Shot40', component: StampOverlayTemplate, durationInFrames: 210, fps: 60, width: 1920, height: 1080, defaultProps: shots.shot40 }),

    // Template G: Illustrations
    React.createElement(Composition, { id: 'Shot16', component: IllustrationTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { variant: 'size' } }),
    React.createElement(Composition, { id: 'Shot44', component: IllustrationTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { variant: 'agloe' } }),

    // Template H: Transparent Lower Thirds & Recreation Badge (Using hyphens instead of underscores)
    React.createElement(Composition, { id: 'BadgeRecreation', component: LowerThirdTemplate, durationInFrames: 360, fps: 60, width: 1920, height: 1080, defaultProps: { text: 'RECREATION', isBadge: true } }),
    React.createElement(Composition, { id: 'LT-Velocity', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: '1876: Whaling ship Velocity' } }),
    React.createElement(Composition, { id: 'LT-Surveyor', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: 'RV Southern Surveyor, October to November 2012' } }),
    React.createElement(Composition, { id: 'LT-BBC', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: 'Source: BBC News, November 22, 2012' } }),
    React.createElement(Composition, { id: 'LT-Seton', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: 'Seton et al., Eos (AGU), April 9, 2013' } }),
    React.createElement(Composition, { id: 'LT-Dougherty', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: 'Dougherty Island, reported 1841' } }),
    React.createElement(Composition, { id: 'LT-Agloe', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: "Agloe, New York: a map's copyright trap" } })
  );
};

registerRoot(RemotionRoot);
