// Render preview stills of chosen frames (bundles once).
// Usage: COMP=HeatedGloves node tools/heated-gloves/stills.mjs 20 100 300 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: process.env.COMP ?? 'DockerInstall'});
for (const frame of frames) {
  const output = path.resolve(`out/stills/${process.env.COMP ?? 'DockerInstall'}-f${String(frame).padStart(4, '0')}.jpg`);
  await renderStill({serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 80, scale: 0.42});
  console.log('rendered', output);
}
