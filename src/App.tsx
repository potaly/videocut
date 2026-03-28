import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import healingProjectJson from './data/healingProject.json';
import { caseStudies } from './data/caseStudies';
import { portfolioData } from './data/portfolio';
import type { CaseStudy, HealingVideoProject, StoryScene, WorkItem } from './types';

const HOME_HASH = '#/';
const ABOUT_HASH = '#/about';
const BASE_URL = import.meta.env.BASE_URL;

type ModalSource = {
  title: string;
  type: 'video' | 'iframe';
  src: string;
  poster?: string;
};

const healingProject = healingProjectJson as HealingVideoProject;

function resolvePublicPath(value?: string) {
  if (!value) {
    return '';
  }

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('mailto:') ||
    value.startsWith('#')
  ) {
    return value;
  }

  return `${BASE_URL}${value.replace(/^\/+/, '')}`;
}

function SceneFrame({
  scene,
  image,
  alt,
}: {
  scene: StoryScene;
  image: string;
  alt: string;
}) {
  return (
    <div className="scene-frame">
      <img
        src={image}
        alt={alt}
        style={{
          objectPosition: `${scene.crop.x}% ${scene.crop.y}%`,
          transform: `scale(${scene.crop.scale})`,
        }}
      />
      <div className="scene-overlay" />
    </div>
  );
}

function RevealSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className={`reveal-section ${visible ? 'is-visible' : ''} ${className ?? ''}`}>
      {children}
    </section>
  );
}

function VideoModal({
  source,
  onClose,
}: {
  source: ModalSource | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!source) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, source]);

  if (!source) {
    return null;
  }

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={source.title} onClick={onClose}>
      <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox-head">
          <div>
            <p className="detail-label">Video Preview</p>
            <h2>{source.title}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="关闭弹窗">
            关闭
          </button>
        </div>

        <div className="lightbox-body">
          {source.type === 'video' ? (
            <video src={source.src} poster={source.poster} controls autoPlay playsInline className="modal-video" />
          ) : (
            <div className="modal-embed">
              <iframe
                title={source.title}
                src={source.src}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function useHashRoute() {
  const readHash = () => window.location.hash || HOME_HASH;
  const [hash, setHash] = useState(readHash);

  useEffect(() => {
    const onHashChange = () => setHash(readHash());

    window.addEventListener('hashchange', onHashChange);

    if (!window.location.hash) {
      window.location.hash = HOME_HASH;
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return hash;
}

function getProjectBadge(work: WorkItem) {
  if (work.isBonus) {
    return '加分项';
  }

  if (work.slug === healingProject.slug) {
    return '个人项目';
  }

  return '模拟项目';
}

function App() {
  const currentHash = useHashRoute();
  const [modalSource, setModalSource] = useState<ModalSource | null>(null);

  const workMap = useMemo(
    () => new Map(portfolioData.works.map((work) => [work.slug, work])),
    [],
  );
  const caseStudyMap = useMemo(
    () => new Map(caseStudies.map((study) => [study.slug, study])),
    [],
  );

  const activeSlug = currentHash.startsWith('#/works/')
    ? currentHash.replace('#/works/', '')
    : null;
  const activeWork = activeSlug ? workMap.get(activeSlug) : undefined;
  const activeCaseStudy = activeSlug ? caseStudyMap.get(activeSlug) : undefined;
  const primaryWorks = portfolioData.works.filter((work) => !work.isBonus);
  const bonusWork = portfolioData.works.find((work) => work.isBonus);

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const jumpToHomeSection = (sectionId: string) => {
    if (window.location.hash === HOME_HASH) {
      scrollToSection(sectionId);
      return;
    }

    window.location.hash = HOME_HASH;
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const openVideoModal = (title: string, src: string, poster?: string) => {
    setModalSource({ title, type: 'video', src, poster });
  };

  const openReferenceModal = (title: string, src: string) => {
    setModalSource({ title, type: 'iframe', src });
  };

  const renderHome = () => (
    <>
      <RevealSection id="home" className="hero-layout">
        <div className="hero-copy">
          <p className="section-kicker">Video Portfolio</p>
          <h1>{portfolioData.profile.name}</h1>
          <p className="hero-role">{portfolioData.profile.role}</p>
          <p className="hero-copy-text hero-copy-short">{portfolioData.profile.tagline}</p>

          <div className="chip-row">
            {portfolioData.heroReel.highlights.slice(0, 3).map((item) => (
              <span key={item} className="meta-chip">
                {item}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() =>
                openVideoModal(
                  portfolioData.heroReel.title,
                  resolvePublicPath(portfolioData.heroReel.videoUrl),
                  resolvePublicPath(portfolioData.heroReel.poster),
                )
              }
            >
              播放首页 Reel
            </button>
            <button type="button" className="button button-secondary" onClick={() => scrollToSection('works')}>
              查看作品
            </button>
          </div>

          <p className="hero-inline-note">模拟项目均已明确标注，不把参考视频混入本人案例。</p>

          <div className="hero-fact-row">
            <article className="fact-card">
              <span>求职方向</span>
              <strong>视频剪辑 / AE 动效 / 内容设计</strong>
            </article>
            <article className="fact-card">
              <span>核心软件</span>
              <strong>PR / AE / PS / AI</strong>
            </article>
            <article className="fact-card">
              <span>能力重点</span>
              <strong>情绪剪辑、包装动效、品牌模拟项目</strong>
            </article>
          </div>
        </div>

        <div className="hero-reel">
          <div className="video-frame reel-frame">
              <video
                className="preview-video"
                src={resolvePublicPath(portfolioData.heroReel.videoUrl)}
                poster={resolvePublicPath(portfolioData.heroReel.poster)}
                muted
                loop
                autoPlay
              playsInline
            />
            <div className="video-gradient" />
            <div className="reel-overlay">
              <div>
                <p className="detail-label">精选展示</p>
                <h2>{portfolioData.heroReel.title}</h2>
                <p>{portfolioData.heroReel.subtitle}</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() =>
                  openVideoModal(
                    portfolioData.heroReel.title,
                    resolvePublicPath(portfolioData.heroReel.videoUrl),
                    resolvePublicPath(portfolioData.heroReel.poster),
                  )
                }
              >
                弹窗播放
              </button>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="works" className="section-block">
        <div className="section-head">
          <div>
            <p className="section-kicker">Selected Works</p>
            <h2>主作品</h2>
          </div>
          <p className="section-description">
            首页只保留最关键的三支主作品，先让面试官快速判断你会剪、会动效，也理解商业内容。
          </p>
        </div>

        <div className="works-grid">
          {primaryWorks.map((work) => (
            <article key={work.id} className="work-card">
              <div className="card-media">
                <img src={resolvePublicPath(work.coverImage)} alt={`${work.title} 封面`} />
                <div className="card-overlay" />
                <div className="card-badges">
                  <span className="badge">{getProjectBadge(work)}</span>
                  <span className="badge badge-muted">{work.projectType}</span>
                </div>
              </div>

              <div className="card-copy">
                <p className="detail-label">{work.purpose}</p>
                <h3>{work.title}</h3>
                <p className="card-summary">{work.summary}</p>

                <div className="tag-row">
                  {work.skillTags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="card-actions">
                  <button type="button" className="text-link" onClick={() => navigateTo(work.detailHash ?? HOME_HASH)}>
                    查看详情
                  </button>
                  {work.videoUrl ? (
                    <button
                      type="button"
                      className="text-link"
                      onClick={() =>
                        openVideoModal(
                          work.title,
                          resolvePublicPath(work.videoUrl),
                          resolvePublicPath(work.coverImage),
                        )
                      }
                    >
                      弹窗播放
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        {bonusWork ? (
          <article className="bonus-spotlight">
            <div className="bonus-media">
              <img src={resolvePublicPath(bonusWork.coverImage)} alt={`${bonusWork.title} 封面`} />
            </div>

            <div className="bonus-copy">
              <p className="section-kicker">Bonus / Dynamic Poster</p>
              <h3>{bonusWork.title}</h3>
              <p>{bonusWork.description}</p>
              <div className="tag-row">
                {bonusWork.skillTags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="card-actions">
                <button type="button" className="text-link" onClick={() => navigateTo(bonusWork.detailHash ?? HOME_HASH)}>
                  查看加分项
                </button>
                <span className="inline-note">用一条全宽模块收尾，比单独掉到下一行更稳。</span>
              </div>
            </div>
          </article>
        ) : null}
      </RevealSection>

      <RevealSection id="experiments" className="section-block">
        <div className="section-head">
          <div>
            <p className="section-kicker">Motion Experiments</p>
            <h2>动效练习</h2>
          </div>
          <p className="section-description">
            这个模块不和主项目抢权重，专门用来补充 Logo 动画、字幕节奏和标题动效等短小练习。
          </p>
        </div>

        <div className="experiments-grid">
          {portfolioData.experiments.map((experiment) => (
            <article key={experiment.id} className="experiment-card">
              <div className="experiment-visual">
                <img src={resolvePublicPath(experiment.coverImage)} alt={`${experiment.title} 预览`} />
              </div>
              <div className="experiment-copy">
                <div className="card-topline">
                  <span>{experiment.type}</span>
                  <strong>Practice</strong>
                </div>
                <h3>{experiment.title}</h3>
                <p>{experiment.summary}</p>
                <div className="tag-row">
                  {experiment.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection id="references" className="section-block">
        <div className="section-head">
          <div>
            <p className="section-kicker">References</p>
            <h2>参考视频</h2>
          </div>
          <p className="section-description">
            别人的视频可以放，但只能作为灵感来源或节奏参考，必须清楚标注为非本人项目。
          </p>
        </div>

        {portfolioData.references.map((reference) => (
          <article key={reference.id} className="reference-card">
            <div className="reference-embed">
              <iframe
                title={reference.title}
                src={reference.embedUrl}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            <div className="reference-copy">
              <div className="reference-mark">Reference Only</div>
              <h3>{reference.title}</h3>
              <p className="card-summary">{reference.summary}</p>
              <p className="reference-note">{reference.note}</p>
              <div className="card-actions">
                <button
                  type="button"
                  className="text-link"
                  onClick={() => openReferenceModal(reference.title, reference.embedUrl)}
                >
                  弹窗查看
                </button>
                <a className="text-link" href={reference.href} target="_blank" rel="noreferrer">
                  打开来源
                </a>
              </div>
              <div className="tag-row">
                <span className="tag">{reference.source}</span>
                <span className="tag">灵感来源</span>
                <span className="tag">不计入本人作品</span>
              </div>
            </div>
          </article>
        ))}
      </RevealSection>

      <RevealSection id="about-preview" className="section-block">
        <div className="about-preview">
          <div className="about-copy">
            <p className="section-kicker">About</p>
            <h2>关于我</h2>
            <p>{portfolioData.profile.tagline}</p>
            <div className="tag-row">
              {['PR', 'AE', 'PS', 'AI 工具', '视频剪辑', '动效设计'].map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="card-actions">
              <button type="button" className="text-link" onClick={() => navigateTo(ABOUT_HASH)}>
                打开 About 页面
              </button>
            </div>
          </div>

          <div className="contact-list">
            {portfolioData.contacts.map((contact) => (
              <a key={contact.label} className="contact-card" href={contact.href} target="_blank" rel="noreferrer">
                <span>{contact.label}</span>
                <strong>{contact.value}</strong>
              </a>
            ))}
          </div>
        </div>
      </RevealSection>
    </>
  );

  const renderAbout = () => (
    <>
      <RevealSection className="about-page">
        <div className="about-page-copy">
          <p className="section-kicker">About Me</p>
          <h1>{portfolioData.profile.name}</h1>
          <p className="hero-role">{portfolioData.profile.role}</p>
          <p className="hero-copy-text">
            我是动漫设计专业背景的应届毕业生，希望应聘视频剪辑和 AE 动效设计相关岗位。
            我会更关注画面氛围、人物情绪和整体节奏，也希望把这种视觉感受继续延伸到品牌内容和短视频里。
            作品集里的案例分成会剪、会动效、懂商业和视觉加分项四层，是为了让面试官更快理解我的能力结构。
          </p>
        </div>

        <div className="about-page-side">
          <img src={resolvePublicPath(healingProject.coverImage)} alt="王露迪头像素材" className="about-portrait" />
        </div>
      </RevealSection>

      <RevealSection className="about-grid">
        <div className="detail-card">
          <p className="detail-label">Skills</p>
          <h2>技能标签</h2>
          <div className="tag-row">
            {['Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator', 'AI 工具辅助', '短视频剪辑'].map(
              (tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="detail-card">
          <p className="detail-label">Career Direction</p>
          <h2>我想做的岗位</h2>
          <ul className="detail-list">
            <li>视频剪辑 / 内容剪辑</li>
            <li>AE 动效设计 / 包装设计</li>
            <li>品牌内容设计 / 新媒体视觉</li>
          </ul>
        </div>

        <div className="detail-card">
          <p className="detail-label">Contacts</p>
          <h2>联系方式</h2>
          <div className="contact-list compact">
            {portfolioData.contacts.map((contact) => (
              <a key={contact.label} className="contact-card" href={contact.href} target="_blank" rel="noreferrer">
                <span>{contact.label}</span>
                <strong>{contact.value}</strong>
              </a>
            ))}
          </div>
        </div>
      </RevealSection>
    </>
  );

  const renderWorkOne = () => (
    <>
      <RevealSection className="project-hero">
        <div className="project-copy">
          <button type="button" className="back-link" onClick={() => navigateTo(HOME_HASH)}>
            返回首页
          </button>
          <p className="section-kicker">Work 01 / 剪辑视频 / 个人项目</p>
          <h1>{healingProject.title}</h1>
          <p className="hero-role">{healingProject.subtitle}</p>
          <p className="hero-copy-text">{healingProject.intro}</p>

          <div className="chip-row">
            {healingProject.mood.map((item) => (
              <span key={item} className="meta-chip">
                {item}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() =>
                openVideoModal(
                  healingProject.title,
                  resolvePublicPath(healingProject.outputVideo),
                  resolvePublicPath(healingProject.coverImage),
                )
              }
            >
              弹窗播放
            </button>
            <button type="button" className="button button-secondary" onClick={() => scrollToSection('storyboard')}>
              查看分镜
            </button>
          </div>
        </div>

        <div className="project-preview">
          <div className="video-frame phone-frame">
            <video
              className="preview-video"
              src={resolvePublicPath(healingProject.outputVideo)}
              poster={resolvePublicPath(healingProject.coverImage)}
              muted
              loop
              autoPlay
              playsInline
              controls
            />
          </div>
          <div className="side-panel">
            <p className="detail-label">项目定位</p>
            <strong>{healingProject.projectNature}</strong>
            <span>它放在作品 1，是为了先证明节奏、镜头顺序和情绪控制能力。</span>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="project-grid">
        <article className="detail-card">
          <p className="detail-label">项目简介</p>
          <h2>Project Intro</h2>
          <p>{healingProject.concept}</p>
        </article>
        <article className="detail-card">
          <p className="detail-label">我的职责</p>
          <h2>Responsibilities</h2>
          <ul className="detail-list">
            {healingProject.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="detail-card">
          <p className="detail-label">项目类型</p>
          <h2>Project Type</h2>
          <p>{healingProject.projectNature}</p>
        </article>
        <article className="detail-card">
          <p className="detail-label">工具</p>
          <h2>Tools</h2>
          <div className="tag-row">
            {healingProject.tools.map((tool) => (
              <span key={tool} className="tag">
                {tool}
              </span>
            ))}
          </div>
        </article>
      </RevealSection>

      <RevealSection className="project-columns">
        <article className="detail-card">
          <p className="detail-label">技术点</p>
          <h2>Technical Points</h2>
          <ul className="detail-list">
            {healingProject.technicalPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="detail-card">
          <p className="detail-label">设计思路</p>
          <h2>Design Thinking</h2>
          <ul className="detail-list">
            {healingProject.designThinking.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </RevealSection>

      <RevealSection id="storyboard" className="section-block">
        <div className="section-head">
          <div>
            <p className="section-kicker">Storyboard</p>
            <h2>自动拆分分镜字幕</h2>
          </div>
          <p className="section-description">10 个镜头，每镜 3 秒，适合直接对应导出为 30 秒竖版 MP4。</p>
        </div>

        <div className="story-grid">
          {healingProject.scenes.map((scene, index) => (
            <article key={scene.id} className="story-card">
              <div className="story-media">
                <SceneFrame
                  scene={scene}
                  image={resolvePublicPath(healingProject.referenceBoard)}
                  alt={`${scene.title} 缩略图`}
                />
              </div>
              <div className="story-copy">
                <div className="card-topline">
                  <span>{`镜头 ${index + 1}`}</span>
                  <strong>{`${scene.duration}s`}</strong>
                </div>
                <h3>{scene.title}</h3>
                <p className="card-summary">{scene.subtitle.join(' ')}</p>
                <p>{scene.note}</p>
              </div>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="project-columns">
        <article className="detail-card">
          <p className="detail-label">导出规格</p>
          <h2>Export Specs</h2>
          <div className="spec-grid">
            {healingProject.exportSpecs.map((item) => (
              <article key={item.label} className="spec-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </article>

        <article className="detail-card">
          <p className="detail-label">面试讲法</p>
          <h2>Interview Notes</h2>
          <ul className="detail-list">
            {healingProject.interviewTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <div className="command-box">
            <span>导出命令</span>
            <code>{healingProject.renderCommand}</code>
          </div>
        </article>
      </RevealSection>
    </>
  );

  const renderCaseStudy = (work: WorkItem, caseStudy: CaseStudy) => (
    <>
      <RevealSection className="project-hero">
        <div className="project-copy">
          <button type="button" className="back-link" onClick={() => navigateTo(HOME_HASH)}>
            返回首页
          </button>
          <p className="section-kicker">{caseStudy.eyebrow}</p>
          <h1>{caseStudy.title}</h1>
          <p className="hero-role">{caseStudy.subtitle}</p>
          <p className="hero-copy-text">{caseStudy.intro}</p>

          <div className="chip-row">
            {[caseStudy.projectNature, caseStudy.role, caseStudy.purpose].map((item) => (
              <span key={item} className="meta-chip">
                {item}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            {work.videoUrl ? (
              <button
                type="button"
                className="button button-primary"
                onClick={() =>
                  openVideoModal(
                    caseStudy.title,
                    resolvePublicPath(work.videoUrl),
                    resolvePublicPath(caseStudy.coverImage),
                  )
                }
              >
                弹窗播放
              </button>
            ) : null}
            <button type="button" className="button button-secondary" onClick={() => scrollToSection('case-structure')}>
              查看项目结构
            </button>
          </div>

          <p className="inline-disclaimer">这是一支明确标注的模拟项目，用来展示对应岗位能力，不伪装成真实商单。</p>
        </div>

        <div className="project-preview">
          {work.videoUrl ? (
            <div className="video-frame wide-frame">
              <video
                className="preview-video"
                src={resolvePublicPath(work.videoUrl)}
                poster={resolvePublicPath(caseStudy.coverImage)}
                muted
                loop
                autoPlay
                playsInline
                controls
              />
            </div>
          ) : (
            <div className="video-frame wide-frame poster-frame">
              <img src={resolvePublicPath(caseStudy.coverImage)} alt={`${caseStudy.title} 封面`} />
            </div>
          )}
          <div className="side-panel">
            <p className="detail-label">项目定位</p>
            <strong>{caseStudy.projectNature}</strong>
            <span>{caseStudy.concept}</span>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="case-structure" className="project-grid">
        <article className="detail-card">
          <p className="detail-label">项目简介</p>
          <h2>Project Intro</h2>
          <p>{caseStudy.concept}</p>
        </article>
        <article className="detail-card">
          <p className="detail-label">我的职责</p>
          <h2>Responsibilities</h2>
          <ul className="detail-list">
            {caseStudy.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="detail-card">
          <p className="detail-label">项目类型</p>
          <h2>Project Type</h2>
          <p>{caseStudy.projectNature}</p>
        </article>
        <article className="detail-card">
          <p className="detail-label">工具</p>
          <h2>Tools</h2>
          <div className="tag-row">
            {caseStudy.tools.map((tool) => (
              <span key={tool} className="tag">
                {tool}
              </span>
            ))}
          </div>
        </article>
      </RevealSection>

      <RevealSection className="project-columns">
        <article className="detail-card">
          <p className="detail-label">技术点</p>
          <h2>Technical Points</h2>
          <ul className="detail-list">
            {caseStudy.technicalPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="detail-card">
          <p className="detail-label">设计思路</p>
          <h2>Design Thinking</h2>
          <ul className="detail-list">
            {caseStudy.designThinking.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </RevealSection>

      <RevealSection className="project-columns">
        <article className="detail-card">
          <p className="detail-label">交付内容</p>
          <h2>Deliverables</h2>
          <ul className="detail-list">
            {caseStudy.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="detail-card">
          <p className="detail-label">制作流程</p>
          <h2>Process</h2>
          <div className="process-list">
            {caseStudy.process.map((item) => (
              <article key={item.title} className="process-item">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </article>
      </RevealSection>

      <RevealSection className="detail-card">
        <p className="detail-label">面试讲法</p>
        <h2>Interview Notes</h2>
        <ul className="detail-list">
          {caseStudy.interviewTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        {work.renderCommand ? (
          <div className="command-box">
            <span>导出命令</span>
            <code>{work.renderCommand}</code>
          </div>
        ) : null}
      </RevealSection>
    </>
  );

  const isAboutPage = currentHash === ABOUT_HASH;
  const isWorkPage = Boolean(activeWork);

  return (
    <div className="page-shell">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />
      <div className="grid-noise" />

      <header className="topbar">
        <button type="button" className="brand" onClick={() => navigateTo(HOME_HASH)}>
          <span className="brand-mark">WL</span>
          <div>
            <p>{portfolioData.profile.name}</p>
            <span>{portfolioData.profile.role}</span>
          </div>
        </button>

        <nav className="nav">
          {isWorkPage ? (
            <>
              <button type="button" className="nav-button" onClick={() => navigateTo(HOME_HASH)}>
                首页
              </button>
              {activeWork?.slug === healingProject.slug ? (
                <button type="button" className="nav-button" onClick={() => scrollToSection('storyboard')}>
                  分镜
                </button>
              ) : (
                <button type="button" className="nav-button" onClick={() => scrollToSection('case-structure')}>
                  项目结构
                </button>
              )}
              <button type="button" className="nav-button" onClick={() => navigateTo(ABOUT_HASH)}>
                About
              </button>
            </>
          ) : isAboutPage ? (
            <>
              <button type="button" className="nav-button" onClick={() => navigateTo(HOME_HASH)}>
                首页
              </button>
              <button type="button" className="nav-button" onClick={() => jumpToHomeSection('works')}>
                作品
              </button>
              <button type="button" className="nav-button" onClick={() => jumpToHomeSection('references')}>
                参考
              </button>
            </>
          ) : (
            <>
              <button type="button" className="nav-button" onClick={() => scrollToSection('works')}>
                作品
              </button>
              <button type="button" className="nav-button" onClick={() => scrollToSection('experiments')}>
                实验
              </button>
              <button type="button" className="nav-button" onClick={() => scrollToSection('references')}>
                参考
              </button>
              <button type="button" className="nav-button" onClick={() => navigateTo(ABOUT_HASH)}>
                About
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="content-shell">
        {activeWork?.slug === healingProject.slug
          ? renderWorkOne()
          : activeWork && activeCaseStudy
            ? renderCaseStudy(activeWork, activeCaseStudy)
            : isAboutPage
              ? renderAbout()
              : renderHome()}
      </main>

      <VideoModal source={modalSource} onClose={() => setModalSource(null)} />
    </div>
  );
}

export default App;
