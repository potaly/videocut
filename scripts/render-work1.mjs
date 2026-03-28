import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import healingProject from '../src/data/healingProject.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public', 'exports');
const referenceBoard = path.join(rootDir, 'public', 'reference-board.png');
const outputFile = path.join(outputDir, 'work1-healing-short.mp4');
const filterScriptFile = path.join(rootDir, 'scripts', '.work1-filter-complex.txt');

const candidateFonts = [
  '/System/Library/Fonts/Hiragino Sans GB.ttc',
  '/System/Library/Fonts/PingFang.ttc',
  '/System/Library/Fonts/STHeiti Light.ttc',
];

function escapeDrawtext(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\\\'")
    .replace(/,/g, '\\,')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/%/g, '\\%');
}

function buildSubtitleFilters(scene) {
  const baseY = scene.subtitle.length > 1 ? 1508 : 1578;

  return scene.subtitle
    .map((line, index) => {
      const escaped = escapeDrawtext(line);
      const y = baseY + index * 74;

      return `drawtext=fontfile='${fontPath}':text='${escaped}':fontcolor=white:fontsize=56:line_spacing=12:x=(w-text_w)/2:y=${y}:shadowcolor=black@0.42:shadowx=0:shadowy=4`;
    })
    .join(',');
}

const fontPath = candidateFonts.find((font) => existsSync(font));

if (!ffmpegPath) {
  console.error('未找到 ffmpeg-static，可先执行 npm install。');
  process.exit(1);
}

chmodSync(ffmpegPath, 0o755);

if (!fontPath) {
  console.error('未找到可用的中文字体，无法绘制字幕。');
  process.exit(1);
}

if (!existsSync(referenceBoard)) {
  console.error(`缺少参考素材图: ${referenceBoard}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const sceneInputArgs = healingProject.scenes.flatMap(() => [
  '-loop',
  '1',
  '-framerate',
  '30',
  '-t',
  '3',
  '-i',
  referenceBoard,
]);

const filterParts = healingProject.scenes.map((scene, index) => {
  const subtitleFilters = buildSubtitleFilters(scene);

  return [
    `[${index}:v]crop=${scene.region.width}:${scene.region.height}:${scene.region.x}:${scene.region.y},split=2[bg${index}][fg${index}]`,
    `[bg${index}]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:10,eq=brightness=-0.06:saturation=0.92[bgf${index}]`,
    `[fg${index}]scale=1080:-2:force_original_aspect_ratio=decrease,eq=brightness=0.03:saturation=1.06[fgf${index}]`,
    `[bgf${index}][fgf${index}]overlay=(W-w)/2:(H-h)/2-110,fade=t=in:st=0:d=0.35,fade=t=out:st=2.65:d=0.35,drawbox=x=0:y=ih-420:w=iw:h=420:color=black@0.22:t=fill,${subtitleFilters}[v${index}]`,
  ].join(';');
});

const concatInputs = healingProject.scenes.map((_, index) => `[v${index}]`).join('');
const filterComplex = `${filterParts.join(';')};${concatInputs}concat=n=${healingProject.scenes.length}:v=1:a=0[v]`;
writeFileSync(filterScriptFile, filterComplex, 'utf8');

const commandArgs = [
  ...sceneInputArgs,
  '-f',
  'lavfi',
  '-t',
  '30',
  '-i',
  'anullsrc=r=48000:cl=stereo',
  '-filter_complex_script',
  filterScriptFile,
  '-map',
  '[v]',
  '-map',
  `${healingProject.scenes.length}:a`,
  '-c:v',
  'libx264',
  '-pix_fmt',
  'yuv420p',
  '-r',
  '30',
  '-c:a',
  'aac',
  '-b:a',
  '192k',
  '-movflags',
  '+faststart',
  '-shortest',
  '-y',
  outputFile,
];

console.log('开始渲染作品 1 MP4...');

const result = spawnSync(ffmpegPath, commandArgs, {
  cwd: rootDir,
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error);
  console.error('MP4 导出失败。');
  process.exit(1);
}

if (result.status !== 0) {
  console.error('MP4 导出失败。');
  process.exit(result.status ?? 1);
}

console.log(`导出完成: ${outputFile}`);
