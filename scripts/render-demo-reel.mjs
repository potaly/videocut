import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public', 'exports');
const outputFile = path.join(outputDir, 'demo-reel-2026.mp4');
const filterScriptFile = path.join(rootDir, 'scripts', '.demo-reel-filter-complex.txt');

const work1File = path.join(outputDir, 'work1-healing-short.mp4');
const work2File = path.join(outputDir, 'work2-ae-packaging.mp4');
const work3File = path.join(outputDir, 'work3-commercial-video.mp4');

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

const fontPath = candidateFonts.find((font) => existsSync(font));

if (!ffmpegPath) {
  console.error('未找到 ffmpeg-static，可先执行 npm install。');
  process.exit(1);
}

chmodSync(ffmpegPath, 0o755);

if (!fontPath) {
  console.error('未找到可用中文字体，无法导出 Demo Reel。');
  process.exit(1);
}

for (const file of [work1File, work2File, work3File]) {
  if (!existsSync(file)) {
    console.error(`缺少成片素材: ${file}`);
    console.error('请先执行 npm run render:work1 / render:work2 / render:work3。');
    process.exit(1);
  }
}

mkdirSync(outputDir, { recursive: true });

const titleMain = escapeDrawtext('王露迪 Demo Reel 2026');
const titleSub = escapeDrawtext('视频剪辑 / AE 包装 / 商业短视频');
const label1 = escapeDrawtext('作品 1  情绪剪辑');
const text1 = escapeDrawtext('下班后的三十分钟');
const label2 = escapeDrawtext('作品 2  AE 包装');
const text2 = escapeDrawtext('BELLE 百丽秋季通勤企划');
const label3 = escapeDrawtext('作品 3  商业视频');
const text3 = escapeDrawtext('花西子新品定妆蜜粉');

const filterComplex = `
[0:v]trim=start=3.5:end=8.5,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,eq=saturation=1.04:brightness=0.02,drawbox=x=60:y=1360:w=960:h=320:color=black@0.22:t=fill,drawtext=fontfile='${fontPath}':text='${titleMain}':fontcolor=white:fontsize=44:x=72:y=1388:enable='between(t,0,2.2)',drawtext=fontfile='${fontPath}':text='${titleSub}':fontcolor=white@0.76:fontsize=26:x=72:y=1448:enable='between(t,0,2.2)',drawtext=fontfile='${fontPath}':text='${label1}':fontcolor=#f2d2b4:fontsize=32:x=72:y=1538,drawtext=fontfile='${fontPath}':text='${text1}':fontcolor=white:fontsize=58:x=72:y=1588,fade=t=in:st=0:d=0.35,fade=t=out:st=4.2:d=0.6[seg0];
[1:v]trim=start=4:end=9,setpts=PTS-STARTPTS,split=2[w2bg][w2fg];
[w2bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=32:12,eq=brightness=-0.08:saturation=0.82[w2bgf];
[w2fg]scale=1080:-2:force_original_aspect_ratio=decrease,eq=saturation=1.02[w2fgf];
[w2bgf][w2fgf]overlay=(W-w)/2:(H-h)/2,setsar=1,drawbox=x=60:y=1440:w=960:h=220:color=black@0.24:t=fill,drawtext=fontfile='${fontPath}':text='${label2}':fontcolor=#f2d2b4:fontsize=32:x=72:y=1490,drawtext=fontfile='${fontPath}':text='${text2}':fontcolor=white:fontsize=54:x=72:y=1540,drawtext=fontfile='${fontPath}':text='字体动效 / 信息卡 / 栏目包装':fontcolor=white@0.78:fontsize=28:x=72:y=1612,fade=t=in:st=0:d=0.25,fade=t=out:st=4.25:d=0.55[seg1];
[2:v]trim=start=8:end=13,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,eq=saturation=1.02:brightness=0.02,drawbox=x=60:y=1440:w=960:h=220:color=black@0.22:t=fill,drawtext=fontfile='${fontPath}':text='${label3}':fontcolor=#f2d2b4:fontsize=32:x=72:y=1490,drawtext=fontfile='${fontPath}':text='${text3}':fontcolor=white:fontsize=56:x=72:y=1540,drawtext=fontfile='${fontPath}':text='卖点节奏 / 品牌语境 / 平台适配':fontcolor=white@0.78:fontsize=28:x=72:y=1612,fade=t=in:st=0:d=0.25,fade=t=out:st=4.15:d=0.75[seg2];
[seg0][seg1][seg2]concat=n=3:v=1:a=0[v]
`.trim();

writeFileSync(filterScriptFile, filterComplex, 'utf8');

const args = [
  '-i',
  work1File,
  '-i',
  work2File,
  '-i',
  work3File,
  '-filter_complex_script',
  filterScriptFile,
  '-map',
  '[v]',
  '-an',
  '-c:v',
  'libx264',
  '-pix_fmt',
  'yuv420p',
  '-r',
  '30',
  '-movflags',
  '+faststart',
  '-y',
  outputFile,
];

console.log('开始渲染 Demo Reel...');

const result = spawnSync(ffmpegPath, args, {
  cwd: rootDir,
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error);
  console.error('Demo Reel 导出失败。');
  process.exit(1);
}

if (result.status !== 0) {
  console.error('Demo Reel 导出失败。');
  process.exit(result.status ?? 1);
}

console.log(`导出完成: ${outputFile}`);
