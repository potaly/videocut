# 王露迪应聘作品集

当前项目已经调整为两层结构：

- 首页：应聘作品集首页
- 详情页：作品 1 / 作品 2 / 作品 3 / 动态海报加分页

其中，作品 1、作品 2、作品 3 都支持本地直接导出为 `MP4`。

## 本地启动

```bash
npm install
npm run dev
```

默认地址：

```bash
http://localhost:5173
```

## 项目结构

首页按求职逻辑组织：

- 作品 1：剪辑视频，证明你会剪
- 作品 2：AE 包装视频，证明你会动效
- 作品 3：商业视频，证明你能赚钱
- 加分项：动态海报，提升竞争力

当前已完成的是：

- 作品 1 的案例页
- 作品 1 的 MP4 渲染脚本
- 作品 2 的 AE 包装案例页
- 作品 2 的 MP4 渲染脚本
- 作品 3 的商业视频案例页
- 作品 3 的 MP4 渲染脚本
- 动态海报加分页

## 关键文件

- 首页与案例页：`src/App.tsx`
- 首页数据：`src/data/portfolio.ts`
- 作品 1 数据：`src/data/healingProject.json`
- 作品 2 / 作品 3 数据：`src/data/caseStudies.ts`
- 样式：`src/styles.css`
- MP4 导出脚本：`scripts/render-work1.mjs` / `scripts/render-work2.mjs` / `scripts/render-work3.mjs`

## 导出作品 1 MP4

执行：

```bash
npm run render:work1
```

输出文件会生成到：

```bash
public/exports/work1-healing-short.mp4
```

## 导出作品 2 MP4

执行：

```bash
npm run render:work2
```

输出文件会生成到：

```bash
public/exports/work2-ae-packaging.mp4
```

## 导出作品 3 MP4

执行：

```bash
npm run render:work3
```

输出文件会生成到：

```bash
public/exports/work3-commercial-video.mp4
```

导出逻辑使用：

- `ffmpeg-static`
- 参考素材图 `public/reference-board.png`
- 人物封面图 `public/hero-photo.jpg`

## 构建

```bash
npm run build
```

## 后续补作品建议

为了更适合应聘，建议接下来继续补：

1. 把作品 2 替换成你表妹真实做过的 AE 包装项目
2. 把作品 3 替换成更贴近真实品牌 brief 的商业内容
3. 动态海报补成 2 张同系列作品，会更完整
