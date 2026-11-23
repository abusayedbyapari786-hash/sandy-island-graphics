import { registerRoot, Composition } from 'remotion';
import React from 'react';
import shots from './data/shots.json';
import { TitleCardTemplate, SonarTemplate, TypewriterCoordsTemplate, StampOverlayTemplate } from './templates/Templates';
import { InkWriteTemplate, MapEngineTemplate, DataPropagationTemplate, DateCardTemplate, IllustrationTemplate, LowerThirdTemplate } from './templates/MapAndExtraTemplates';
import { ImageClipTemplate } from './templates/ImageClipTemplate';

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

    // Template H: Transparent Lower Thirds & Recreation Badge
    React.createElement(Composition, { id: 'BadgeRecreation', component: LowerThirdTemplate, durationInFrames: 360, fps: 60, width: 1920, height: 1080, defaultProps: { text: 'RECREATION', isBadge: true } }),
    React.createElement(Composition, { id: 'LT-Velocity', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: '1876: Whaling ship Velocity' } }),
    React.createElement(Composition, { id: 'LT-Surveyor', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: 'RV Southern Surveyor, October to November 2012' } }),
    React.createElement(Composition, { id: 'LT-BBC', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: 'Source: BBC News, November 22, 2012' } }),
    React.createElement(Composition, { id: 'LT-Seton', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: 'Seton et al., Eos (AGU), April 9, 2013' } }),
    React.createElement(Composition, { id: 'LT-Dougherty', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: 'Dougherty Island, reported 1841' } }),
    React.createElement(Composition, { id: 'LT-Agloe', component: LowerThirdTemplate, durationInFrames: 240, fps: 60, width: 1920, height: 1080, defaultProps: { text: "Agloe, New York: a map's copyright trap" } }),

    // Cinematic 5-6s Image-to-Video Clips (Shots 12, 15, 22, 25, 27, 31, 35, 37, 38)
    React.createElement(Composition, { id: 'Shot12', component: ImageClipTemplate, durationInFrames: 330, fps: 60, width: 1920, height: 1080, defaultProps: { imageFile: 'shot 12  lucid-origin_Image_Victorian_mapmaker’s_desk_rolled_charts_brass_compass_lamplight_top-down-0.jpg', motionType: 'zoomIn' } }),
    React.createElement(Composition, { id: 'Shot15', component: ImageClipTemplate, durationInFrames: 330, fps: 60, width: 1920, height: 1080, defaultProps: { imageFile: 'shot 15      lucid-origin_1908_British_Admiralty_nautical_chart_coral_sea_faded_paper_red_ink_coordinates_-0.jpg', motionType: 'panRight' } }),
    React.createElement(Composition, { id: 'Shot22', component: ImageClipTemplate, durationInFrames: 300, fps: 60, width: 1920, height: 1080, defaultProps: { imageFile: 'shot 22      lucid-origin_Image_Empty_open_ocean_from_above_calm_deep_blue_no_land_cinematic_documentary_s-0.jpg', motionType: 'zoomIn' } }),
    React.createElement(Composition, { id: 'Shot25', component: ImageClipTemplate, durationInFrames: 300, fps: 60, width: 1920, height: 1080, defaultProps: { imageFile: 'shot 25     lucid-origin_Image_Open_atlas_book_with_world_map_close-up_shallow_depth_of_field_cinematic_d-0.jpg', motionType: 'panLeft' } }),
    React.createElement(Composition, { id: 'Shot27', component: ImageClipTemplate, durationInFrames: 330, fps: 60, width: 1920, height: 1080, defaultProps: { imageFile: 'shot 27     lucid-origin_Image_Modern_white_research_vessel_at_sea_aerial_bright_day_cinematic_documentar-0.jpg', motionType: 'zoomIn' } }),
    React.createElement(Composition, { id: 'Shot31', component: ImageClipTemplate, durationInFrames: 300, fps: 60, width: 1920, height: 1080, defaultProps: { imageFile: 'shot 31  lucid-origin_Image_Calm_empty_ocean_horizon_at_golden_hour_wide_shot_nothing_visible_cinemati-0.jpg', motionType: 'zoomOut' } }),
    React.createElement(Composition, { id: 'Shot35', component: ImageClipTemplate, durationInFrames: 330, fps: 60, width: 1920, height: 1080, defaultProps: { imageFile: 'shot 35    lucid-origin_Image_Dense_sea_fog_on_a_grey_ocean_a_faint_pale_line_near_horizon_cinematic_doc-0.jpg', motionType: 'zoomIn' } }),
    React.createElement(Composition, { id: 'Shot37', component: ImageClipTemplate, durationInFrames: 360, fps: 60, width: 1920, height: 1080, defaultProps: { imageFile: 'shot 37   lucid-origin_Image_19th_century_sailing_ship_in_cold_southern_ocean_icebergs_and_fog_silhouet-0.jpg', motionType: 'panRight', showRecreationBadge: true } }),
    React.createElement(Composition, { id: 'Shot38', component: ImageClipTemplate, durationInFrames: 330, fps: 60, width: 1920, height: 1080, defaultProps: { imageFile: 'shot 38  lucid-origin_Image_Antique_16th_century_North_Atlantic_map_ornate_island_drawn_in_ink_parchme-0.jpg', motionType: 'zoomIn' } })
  );
};

registerRoot(RemotionRoot);
