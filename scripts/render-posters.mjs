import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const exportsDir = path.join(rootDir, 'public', 'exports');
const coversDir = path.join(rootDir, 'public', 'covers');

const jobs = [
  {
    input: path.join(exportsDir, 'demo-reel-2026.mp4'),
    output: path.join(coversDir, 'demo-reel-cover.jpg'),
    time: '00:00:10.200',
    scale: '1080:1920',
  },
  {
    input: path.join(exportsDir, 'work2-ae-packaging.mp4'),
    output: path.join(coversDir, 'work2-belle-cover.jpg'),
    time: '00:00:11.200',
    scale: '1600:900',
  },
  {
    input: path.join(exportsDir, 'work3-commercial-video.mp4'),
    output: path.join(coversDir, 'work3-huaxizi-cover.jpg'),
    time: '00:00:12.400',
    scale: '1080:1920',
  },
];

if (!ffmpegPath) {
  console.error('未找到 ffmpeg-static，可先执行 npm install。');
  process.exit(1);
}

chmodSync(ffmpegPath, 0o755);
mkdirSync(coversDir, { recursive: true });

for (const job of jobs) {
  if (!existsSync(job.input)) {
    console.error(`缺少视频文件: ${job.input}`);
    process.exit(1);
  }

  console.log(`生成封面: ${path.basename(job.output)}`);

  const result = spawnSync(
    ffmpegPath,
    [
      '-ss',
      job.time,
      '-i',
      job.input,
      '-vf',
      `scale=${job.scale}:force_original_aspect_ratio=increase,crop=${job.scale}`,
      '-frames:v',
      '1',
      '-q:v',
      '2',
      '-y',
      job.output,
    ],
    {
      cwd: rootDir,
      stdio: 'inherit',
    },
  );

  if (result.error || result.status !== 0) {
    console.error(`封面生成失败: ${job.output}`);
    process.exit(result.status ?? 1);
  }
}

console.log('所有封面已生成完成。');
