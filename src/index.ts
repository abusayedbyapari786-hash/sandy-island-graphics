import { registerRoot, Composition } from 'remotion';
import React from 'react';
import shots from './data/shots.json';
import { TitleCardTemplate, SonarTemplate, TypewriterCoordsTemplate, StampOverlayTemplate } from './templates/Templates';
import { InkWriteTemplate, MapEngineTemplate, DataPropagationTemplate, DateCardTemplate, IllustrationTemplate, LowerThirdTemplate } from './templates/MapAndExtraTemplates';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Template A: Title & Outro */}
    <Composition id="Shot05" component={TitleCardTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={shots.shot05} />
    <Composition id="Shot47" component={TitleCardTemplate} durationInFrames={300} fps={60} width={1920} height={1080} defaultProps={shots.shot47} />

    {/* Template B: Ink Write */}
    <Composition id="Shot11" component={InkWriteTemplate} durationInFrames={300} fps={60} width={1920} height={1080} />

    {/* Template C: Map Engine (9 Shots) */}
    <Composition id="Shot13" component={MapEngineTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ mode: 'copy' }} />
    <Composition id="Shot14" component={MapEngineTemplate} durationInFrames={270} fps={60} width={1920} height={1080} defaultProps={{ mode: 'timeline' }} />
    <Composition id="Shot18" component={MapEngineTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ mode: 'ed' }} />
    <Composition id="Shot19" component={MapEngineTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ mode: 'erase' }} />
    <Composition id="Shot24" component={MapEngineTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ mode: 'pixelate' }} />
    <Composition id="Shot36" component={MapEngineTemplate} durationInFrames={300} fps={60} width={1920} height={1080} defaultProps={{ mode: 'pins' }} />
    <Composition id="Shot39" component={MapEngineTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ mode: 'search' }} />
    <Composition id="Shot42" component={MapEngineTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ mode: 'loop' }} />
    <Composition id="Shot46" component={MapEngineTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ mode: 'zoomOut', title: 'A MAP IS A CLAIM.', subtitle: 'EVERY CLAIM NEEDS SOMEONE WILLING TO CHECK IT' }} />

    {/* Template D: Data & Sonar */}
    <Composition id="Shot23" component={MapEngineTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ mode: 'pixelate' }} />
    <Composition id="Shot29" component={SonarTemplate} durationInFrames={270} fps={60} width={1920} height={1080} defaultProps={shots.shot29} />
    <Composition id="Shot30" component={TypewriterCoordsTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={shots.shot30} />
    <Composition id="Shot45" component={DataPropagationTemplate} durationInFrames={240} fps={60} width={1920} height={1080} />

    {/* Template E: Date Cards */}
    <Composition id="Shot32" component={DateCardTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ dateText: 'NOVEMBER 26, 2012', headline: 'GOOGLE CORRECTS ITS MAP' }} />
    <Composition id="Shot33" component={DateCardTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ dateText: 'NOVEMBER 29, 2012', headline: 'NATIONAL GEOGRAPHIC REMOVES IT' }} />

    {/* Template F: Stamp Overlay */}
    <Composition id="Shot40" component={StampOverlayTemplate} durationInFrames={210} fps={60} width={1920} height={1080} defaultProps={shots.shot40} />

    {/* Template G: Illustrations */}
    <Composition id="Shot16" component={IllustrationTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ variant: 'size' }} />
    <Composition id="Shot44" component={IllustrationTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ variant: 'agloe' }} />

    {/* Template H: Transparent Lower Thirds & Recreation Badge */}
    <Composition id="BadgeRecreation" component={LowerThirdTemplate} durationInFrames={360} fps={60} width={1920} height={1080} defaultProps={{ text: 'RECREATION', isBadge: true }} />
    <Composition id="LT_Velocity" component={LowerThirdTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ text: '1876: Whaling ship Velocity' }} />
    <Composition id="LT_Surveyor" component={LowerThirdTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ text: 'RV Southern Surveyor, October to November 2012' }} />
    <Composition id="LT_BBC" component={LowerThirdTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ text: 'Source: BBC News, November 22, 2012' }} />
    <Composition id="LT_Seton" component={LowerThirdTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ text: 'Seton et al., Eos (AGU), April 9, 2013' }} />
    <Composition id="LT_Dougherty" component={LowerThirdTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ text: 'Dougherty Island, reported 1841' }} />
    <Composition id="LT_Agloe" component={LowerThirdTemplate} durationInFrames={240} fps={60} width={1920} height={1080} defaultProps={{ text: "Agloe, New York: a map's copyright trap" }} />
  </>
);

registerRoot(RemotionRoot);
