# 王璐迪新媒体运营作品集

当前项目是一个面向校招和初级岗位投递的个人作品集网站，内容同时包含：

- 首页：作品展示 + 简历信息摘要
- About：求职意向、教育背景、校园运营经历、内容创作经历
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

- 主作品：内容剪辑、视觉包装、品牌内容案例
- 简历亮点：专业排名、奖学金、校园运营、比赛奖项
- 经历摘要：求职意向、教育背景、内容创作、工具与证书
- 加分项：动态海报与动效练习

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

为了进一步提升投递效果，建议接下来继续补：

1. 补 1-2 个真实校园活动或社媒账号运营案例
2. 为现有作品补上发布时间、目标用户和结果复盘
3. 如果有条件，增加一页独立的简历下载入口
