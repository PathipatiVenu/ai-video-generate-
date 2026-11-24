import {Composition, Folder} from 'remotion';
import {MyComposition} from './Composition';
import {DockerInstall} from './DockerInstall/DockerInstall';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './DockerInstall/timeline';
import {HeatedGloves} from './HeatedGloves/HeatedGloves';
import * as GlovesTimeline from './HeatedGloves/timeline';
import {Panchayat} from './Panchayat/Panchayat';
import * as PanchayatTimeline from './Panchayat/timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Folder name="Shorts">
        <Composition
          id="DockerInstall"
          component={DockerInstall}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="HeatedGloves"
          component={HeatedGloves}
          durationInFrames={GlovesTimeline.TOTAL_FRAMES}
          fps={GlovesTimeline.FPS}
          width={GlovesTimeline.WIDTH}
          height={GlovesTimeline.HEIGHT}
        />
        <Composition
          id="Panchayat"
          component={Panchayat}
          durationInFrames={PanchayatTimeline.TOTAL_FRAMES}
          fps={PanchayatTimeline.FPS}
          width={PanchayatTimeline.WIDTH}
          height={PanchayatTimeline.HEIGHT}
        />
      </Folder>
    </>
  );
};
