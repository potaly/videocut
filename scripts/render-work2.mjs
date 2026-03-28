import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public', 'exports');
const outputFile = path.join(outputDir, 'work2-ae-packaging.mp4');
const filterScriptFile = path.join(rootDir, 'scripts', '.work2-filter-complex.txt');

const candidateFonts = [
  '/System/Library/Fonts/Hiragino Sans GB.ttc',
  '/System/Library/Fonts/PingFang.ttc',
  '/System/Library/Fonts/STHeiti Light.ttc',
  '/System/Library/Fonts/Avenir Next.ttc',
];

const fontPath = candidateFonts.find((font) => existsSync(font));

if (!ffmpegPath) {
  console.error('未找到 ffmpeg-static，可先执行 npm install。');
  process.exit(1);
}

chmodSync(ffmpegPath, 0o755);

if (!fontPath) {
  console.error('未找到可用字体，无法导出作品 2。');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const filterComplex = `
[0:v]format=yuv420p,
drawbox=x=0:y=0:w=iw:h=ih:color=#18151e:t=fill,
drawbox=x='-320+min(t*420,420)':y=84:w=420:h=18:color=#f4c5cf@0.95:t=fill,
drawbox=x='iw-420-min(t*260,260)':y=84:w=220:h=18:color=#bfe5d4@0.85:t=fill,
drawbox=x=144:y=184:w='if(lt(t,1.2),0, if(lt(t,2.2),(t-1.2)*980,980))':h=3:color=white@0.72:t=fill,
drawtext=fontfile='${fontPath}':text='BELLE 百丽':fontcolor=white:fontsize=118:x='if(lt(t,0.6),-text_w,(w-text_w)/2)':y=238:enable='between(t,0.2,5.2)',
drawtext=fontfile='${fontPath}':text='秋季通勤企划':fontcolor=#f4c5cf:fontsize=42:x='if(lt(t,0.9),w,(w-text_w)/2)':y=382:enable='between(t,0.6,5.8)',
drawtext=fontfile='${fontPath}':text='栏目包装 / 字体动效 / 视觉延展':fontcolor=white@0.78:fontsize=32:x='if(lt(t,1.1),-text_w,(w-text_w)/2)':y=450:enable='between(t,0.9,6.0)',
drawbox=x='if(lt(t,4.8),-900,120)':y=612:w=780:h=230:color=white@0.08:t=fill:enable='between(t,4.6,11.2)',
drawbox=x='if(lt(t,5.1),1920,1380)':y=612:w=420:h=230:color=#bfe5d4@0.18:t=fill:enable='between(t,4.8,11.2)',
drawtext=fontfile='${fontPath}':text='01 字体层级':fontcolor=#f7d6dd:fontsize=44:x=176:y=660:enable='between(t,5.0,11.2)',
drawtext=fontfile='${fontPath}':text='清晰标题与轻通勤视觉语气':fontcolor=white:fontsize=58:x=176:y=720:enable='between(t,5.2,11.2)',
drawtext=fontfile='${fontPath}':text='02 图形节奏':fontcolor=#cde7dc:fontsize=44:x=176:y=804:enable='between(t,5.5,11.2)',
drawtext=fontfile='${fontPath}':text='线条 色块 转场一起建立品牌感':fontcolor=white@0.82:fontsize=36:x=176:y=860:enable='between(t,5.7,11.2)',
drawbox=x='if(lt(t,10.2),-260,220)':y=920:w=1480:h=4:color=white@0.18:t=fill:enable='between(t,10.0,15.0)',
drawtext=fontfile='${fontPath}':text='BELLE 百丽':fontcolor=white:fontsize=88:x='if(lt(t,10.4),-text_w,220)':y=756:enable='between(t,10.2,15.0)',
drawtext=fontfile='${fontPath}':text='都市通勤系列包装模拟项目':fontcolor=#f4c5cf:fontsize=34:x='if(lt(t,10.7),w,220)':y=856:enable='between(t,10.5,15.0)',
drawtext=fontfile='${fontPath}':text='片头 / 字幕条 / 门店屏 / 社媒延展':fontcolor=white@0.76:fontsize=30:x=220:y=922:enable='between(t,10.8,15.0)',
drawbox=x='w-340':y=180:w=160:h=160:color=#f4c5cf@0.82:t=fill:enable='between(t,10.2,15.0)',
drawbox=x='w-250':y=270:w=190:h=190:color=#bfe5d4@0.76:t=fill:enable='between(t,10.4,15.0)',
fade=t=in:st=0:d=0.35,
fade=t=out:st=14.2:d=0.8
[v]
`.trim();

writeFileSync(filterScriptFile, filterComplex, 'utf8');

const args = [
  '-f',
  'lavfi',
  '-i',
  'color=c=#18151e:s=1920x1080:r=30:d=15',
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

console.log('开始渲染作品 2 MP4...');

const result = spawnSync(ffmpegPath, args, {
  cwd: rootDir,
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error);
  console.error('作品 2 MP4 导出失败。');
  process.exit(1);
}

if (result.status !== 0) {
  console.error('作品 2 MP4 导出失败。');
  process.exit(result.status ?? 1);
}

console.log(`导出完成: ${outputFile}`);
