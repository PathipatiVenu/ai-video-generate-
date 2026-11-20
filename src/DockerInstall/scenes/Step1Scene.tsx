import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../components/Beat';
import {C, FONT, IMG, SFX, SHADOW} from '../theme';
import {localLine, sceneDuration, TR} from '../timeline';
import {Camera, CL, Cursor, EASE_OUT, GridBackground, Icon, KenBurns, LightSweep, StepBadge, prog, typed} from '../components/ui';

const S = 'step1' as const;
const QUERY = 'Docker Desktop';
const BW = 940; // browser width
const BX = (1080 - BW) / 2;
const BY = 430; // browser top

/**
 * "First, open your browser and search for Docker Desktop. Visit the official
 *  Docker website and download Docker Desktop for Windows."
 */
export const Step1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = sceneDuration(S);
  const browser = localLine(S, 'browser');
  const download = localLine(S, 'download');

  const typeStart = browser.from + Math.round(browser.dur * 0.55); // "...search for Docker Desktop"
  const typeEnd = typeStart + Math.ceil(QUERY.length / 0.6);
  const resultsAt = typeEnd + 6;
  const clickResult = download.from - 4;
  const pageAt = download.from + 6; // docker.com loads
  const clickDownload = download.from + Math.round(download.dur * 0.62); // "...download Docker Desktop"
  const dlStart = clickDownload + 6;

  const win = spring({frame: frame - (TR + 4), fps, config: {damping: 16}});

  return (
    <AbsoluteFill>
      <GridBackground perspective tint={C.blue} tint2={C.cyan} />
      {/* real photo backdrop, softened so the UI reads clearly */}
      <KenBurns
        src={IMG.handLaptop}
        dur={total}
        zoom={[1.1, 1.25]}
        style={{opacity: 0.22, filter: 'blur(3px)'}}
      />
      <Camera dur={total} from={1} to={1.05} driftY={-20}>
        <StepBadge n={1} label="DOWNLOAD" />
        <div
          style={{
            position: 'absolute',
            left: BX,
            top: BY,
            width: BW,
            height: 1040,
            opacity: win,
            translate: `0px ${(1 - win) * 500}px`,
            rotate: `${(1 - win) * 6}deg`,
          }}
        >
          <BrowserChrome
            url={frame < pageAt ? 'search' : 'https://www.docker.com/products/docker-desktop/'}
            secure={frame >= pageAt}
            loading={interpolate(frame, [clickResult + 2, pageAt + 8], [0, 1], CL)}
          >
            {frame < pageAt ? (
              <SearchPage frame={frame} typeStart={typeStart} resultsAt={resultsAt} openAt={browser.from} />
            ) : (
              <DockerPage frame={frame - pageAt} clickAt={clickDownload - pageAt} dlStart={dlStart - pageAt} />
            )}
          </BrowserChrome>
        </div>

        {/* "official website" badge */}
        <OfficialBadge at={pageAt + 10} />

        <AbsoluteFill>
          <Cursor
            appearAt={resultsAt}
            path={[
              {f: resultsAt, x: 900, y: 1400},
              {f: clickResult - 2, x: BX + 330, y: BY + 540},
              {f: pageAt + 10, x: BX + 330, y: BY + 540},
              {f: clickDownload - 4, x: BX + 600, y: BY + 620},
              {f: clickDownload + 30, x: BX + 640, y: BY + 700},
            ]}
            clicks={[clickResult, clickDownload]}
          />
        </AbsoluteFill>
      </Camera>

      <Sfx src={SFX.whoosh} at={TR + 2} volume={0.4} name="Whoosh – browser" />
      <Sfx src={SFX.typing} at={typeStart} volume={0.5} name="Typing – search" />
      <Sfx src={SFX.enter} at={typeEnd + 2} volume={0.5} name="Enter – search" />
      <Sfx src={SFX.click} at={clickResult} volume={0.55} name="Click – result" />
      <Sfx src={SFX.whooshShort} at={pageAt} volume={0.5} name="Whoosh – page" />
      <Sfx src={SFX.click} at={clickDownload} volume={0.55} name="Click – download" />
      <Sfx src={SFX.notify} at={dlStart + 40} volume={0.4} name="Notify – downloaded" />
    </AbsoluteFill>
  );
};

const BrowserChrome: React.FC<{url: string; secure: boolean; loading: number; children: React.ReactNode}> = ({url, secure, loading, children}) => (
  <div style={{width: '100%', height: '100%', borderRadius: 30, overflow: 'hidden', background: C.white, boxShadow: SHADOW.card, display: 'flex', flexDirection: 'column'}}>
    <div style={{height: 62, background: '#E8EEF8', display: 'flex', alignItems: 'flex-end', padding: '0 20px'}}>
      <div style={{height: 50, width: 360, background: C.white, borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', fontFamily: FONT.body, fontSize: 22, color: C.navy, fontWeight: 600}}>
        {secure ? <Img src={IMG.dockerIcon} style={{width: 30}} /> : <Icon.Search size={24} color={C.slate} />}
        {secure ? 'Docker Desktop | Docker' : 'New Tab'}
      </div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', gap: 30, fontSize: 22, color: C.slate, paddingBottom: 14}}>
        <span>─</span>
        <span>☐</span>
        <span>✕</span>
      </div>
    </div>
    <div style={{height: 80, display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', borderBottom: '2px solid #EEF2F8', position: 'relative'}}>
      <span style={{fontSize: 30, color: C.slate}}>←</span>
      <span style={{fontSize: 30, color: C.slate}}>→</span>
      <div style={{flex: 1, height: 54, borderRadius: 999, background: '#F1F4FA', display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', fontFamily: FONT.body, fontSize: 22, color: C.navy}}>
        {secure ? <span style={{color: C.green, fontSize: 22}}>🔒</span> : <Icon.Search size={22} color={C.slate} />}
        <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{url === 'search' ? 'Search or type a URL' : url}</span>
      </div>
      {loading > 0 && loading < 1 ? (
        <div style={{position: 'absolute', left: 0, bottom: -2, height: 5, width: `${loading * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`}} />
      ) : null}
    </div>
    <div style={{flex: 1, position: 'relative'}}>{children}</div>
  </div>
);

const SearchPage: React.FC<{frame: number; typeStart: number; resultsAt: number; openAt: number}> = ({frame, typeStart, resultsAt, openAt}) => {
  const q = typed(QUERY, frame, typeStart, 0.6);
  const caret = Math.floor(frame / 8) % 2 === 0;
  const lift = prog(frame, resultsAt - 4, 14);
  const focus = prog(frame, openAt + 6, 12);
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: interpolate(lift, [0, 1], [250, 60])}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40, opacity: 1 - lift * 0.0}}>
        <Icon.Globe size={64} color={C.blue} />
        <span style={{fontFamily: FONT.display, fontSize: 58, fontWeight: 700, color: C.navy}}>Search</span>
      </div>
      <div
        style={{
          width: 800,
          height: 96,
          borderRadius: 999,
          background: C.white,
          border: `3px solid ${focus > 0.5 ? C.blue : '#DCE3EF'}`,
          boxShadow: focus > 0.5 ? SHADOW.glow : SHADOW.soft,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '0 34px',
          fontFamily: FONT.body,
          fontSize: 40,
          color: C.navy,
        }}
      >
        <Icon.Search size={40} color={C.slate} />
        <span>
          {q}
          <span style={{opacity: caret && focus > 0.5 ? 1 : 0, color: C.blue}}>|</span>
        </span>
      </div>
      {/* results */}
      <div style={{width: 820, marginTop: 50, display: 'flex', flexDirection: 'column', gap: 26}}>
        {[0, 1, 2].map((i) => {
          const r = prog(frame, resultsAt + i * 5, 14);
          const main = i === 0;
          return (
            <div
              key={i}
              style={{
                opacity: r,
                translate: `0px ${(1 - r) * 40}px`,
                padding: '26px 30px',
                borderRadius: 24,
                background: main ? '#F3F7FF' : C.white,
                border: main ? `3px solid ${C.blueSoft}` : '2px solid #EEF2F8',
              }}
            >
              {main ? (
                <>
                  <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.body, fontSize: 24, color: C.slate}}>
                    <Img src={IMG.dockerIcon} style={{width: 36}} /> docker.com › products › docker-desktop
                  </div>
                  <div style={{fontFamily: FONT.body, fontSize: 38, fontWeight: 700, color: C.blue, marginTop: 10}}>Docker Desktop</div>
                  <div style={{height: 14, width: '80%', background: '#E3E9F4', borderRadius: 8, marginTop: 16}} />
                </>
              ) : (
                <>
                  <div style={{height: 16, width: '45%', background: '#E3E9F4', borderRadius: 8}} />
                  <div style={{height: 22, width: '70%', background: '#D3DCEC', borderRadius: 8, marginTop: 14}} />
                  <div style={{height: 14, width: '85%', background: '#EBEFF6', borderRadius: 8, marginTop: 14}} />
                </>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const WinSquares: React.FC<{size: number; color: string}> = ({size, color}) => (
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: size * 0.08, width: size, height: size}}>
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{background: color, borderRadius: 2}} />
    ))}
  </div>
);

const DockerPage: React.FC<{frame: number; clickAt: number; dlStart: number}> = ({frame, clickAt, dlStart}) => {
  const {fps} = useVideoConfig();
  const hero = spring({frame, fps, config: {damping: 16}});
  const btn = spring({frame: frame - 10, fps, config: {damping: 12}});
  const pressed = frame >= clickAt && frame < clickAt + 6;
  const dl = interpolate(frame, [dlStart, dlStart + 40], [0, 1], {...CL, easing: EASE_OUT});
  const dlIn = spring({frame: frame - dlStart, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #EEF4FF 100%)'}}>
      <div style={{height: 92, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 30, borderBottom: '2px solid #EEF2F8'}}>
        <Img src={IMG.dockerLogo} style={{height: 40}} />
        <div style={{flex: 1}} />
        {[90, 70, 110].map((w, i) => (
          <div key={i} style={{height: 14, width: w, background: '#DCE3EF', borderRadius: 8}} />
        ))}
      </div>
      <div style={{padding: '70px 60px 0', opacity: hero, translate: `0px ${(1 - hero) * 40}px`}}>
        <div style={{fontFamily: FONT.display, fontSize: 82, fontWeight: 700, color: C.navy, lineHeight: 1.05}}>Docker Desktop</div>
        <div style={{height: 18, width: '78%', background: '#DCE3EF', borderRadius: 9, marginTop: 34}} />
        <div style={{height: 18, width: '62%', background: '#E6EBF4', borderRadius: 9, marginTop: 18}} />
      </div>
      <div
        style={{
          margin: '70px 60px 0',
          height: 120,
          borderRadius: 26,
          background: `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          color: C.white,
          fontFamily: FONT.body,
          fontWeight: 700,
          fontSize: 42,
          boxShadow: SHADOW.glow,
          scale: String((0.7 + 0.3 * btn) * (pressed ? 0.95 : 1)),
          opacity: btn,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <WinSquares size={46} color={C.white} />
        Download for Windows
        <LightSweep at={24} dur={22} opacity={0.5} />
      </div>
      {/* download bubble */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          bottom: 60,
          padding: '28px 32px',
          borderRadius: 28,
          background: C.white,
          boxShadow: SHADOW.card,
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          opacity: dlIn,
          translate: `0px ${(1 - dlIn) * 120}px`,
        }}
      >
        <div style={{width: 92, height: 92, borderRadius: 22, background: dl >= 1 ? C.greenSoft : C.blueSoft, display: 'grid', placeItems: 'center'}}>
          {dl >= 1 ? <Icon.Check size={56} color={C.green} stroke={2.6} /> : <Icon.Download size={52} color={C.blue} stroke={2.4} />}
        </div>
        <div style={{flex: 1}}>
          <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 32, color: C.navy}}>Docker Desktop Installer.exe</div>
          <div style={{height: 14, borderRadius: 8, background: '#E6EBF4', marginTop: 16, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${dl * 100}%`, background: dl >= 1 ? C.green : `linear-gradient(90deg, ${C.blue}, ${C.cyan})`}} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OfficialBadge: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 12}});
  if (frame < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: BY - 40,
        right: BX - 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 26px',
        borderRadius: 999,
        background: C.green,
        color: C.white,
        fontFamily: FONT.body,
        fontWeight: 700,
        fontSize: 30,
        boxShadow: SHADOW.soft,
        scale: String(s),
        rotate: `${(1 - s) * 20}deg`,
      }}
    >
      <Icon.Shield size={36} color={C.white} stroke={2.4} /> Official site
    </div>
  );
};
