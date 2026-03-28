export type PortfolioCategoryId =
  | 'editing-video'
  | 'ae-packaging'
  | 'commercial-video'
  | 'dynamic-poster';

export interface ProfileStat {
  label: string;
  value: string;
}

export interface SkillItem {
  name: string;
  detail: string;
}

export interface CategoryItem {
  id: PortfolioCategoryId;
  name: string;
  description: string;
}

export interface WorkItem {
  id: string;
  slug: string;
  title: string;
  category: PortfolioCategoryId;
  projectType: string;
  purpose: string;
  summary: string;
  description: string;
  coverImage: string;
  skillTags: string[];
  videoUrl: string;
  year: string;
  detailHash?: string;
  renderCommand?: string;
  status: 'ready' | 'planned';
  isBonus?: boolean;
}

export interface ContactItem {
  label: string;
  value: string;
  href: string;
}

export interface HeroReel {
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  poster: string;
  highlights: string[];
}

export interface ResumeHighlight {
  title: string;
  description: string;
}

export interface ResumeSection {
  id: string;
  label: string;
  title: string;
  items: string[];
}

export interface ExperimentItem {
  id: string;
  title: string;
  summary: string;
  coverImage: string;
  tags: string[];
  videoUrl?: string;
  type: string;
}

export interface ReferenceItem {
  id: string;
  title: string;
  source: string;
  summary: string;
  embedUrl: string;
  href: string;
  note: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    role: string;
    intro: string;
    tagline: string;
    location: string;
    availability: string;
    stats: ProfileStat[];
  };
  heroReel: HeroReel;
  skills: SkillItem[];
  highlights: ResumeHighlight[];
  resumeSections: ResumeSection[];
  categories: CategoryItem[];
  works: WorkItem[];
  experiments: ExperimentItem[];
  references: ReferenceItem[];
  contacts: ContactItem[];
}

export interface SceneCrop {
  x: number;
  y: number;
  scale: number;
}

export interface StoryScene {
  id: string;
  title: string;
  duration: number;
  subtitle: string[];
  note: string;
  transition: string;
  crop: SceneCrop;
  region: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExportSpec {
  label: string;
  value: string;
}

export interface ToolchainItem {
  title: string;
  description: string;
}

export interface HealingVideoProject {
  slug: string;
  title: string;
  subtitle: string;
  mood: string[];
  ratio: string;
  duration: string;
  intro: string;
  concept: string;
  coverImage: string;
  referenceBoard: string;
  outputVideo: string;
  renderCommand: string;
  projectNature: string;
  responsibilities: string[];
  technicalPoints: string[];
  designThinking: string[];
  tools: string[];
  interviewTips: string[];
  exportSpecs: ExportSpec[];
  toolchain: ToolchainItem[];
  scenes: StoryScene[];
}

export interface CaseStudySection {
  title: string;
  description: string;
}

export interface CaseStudy {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  purpose: string;
  coverImage: string;
  intro: string;
  concept: string;
  projectNature: string;
  role: string;
  responsibilities: string[];
  technicalPoints: string[];
  designThinking: string[];
  tools: string[];
  deliverables: string[];
  highlights: CaseStudySection[];
  process: CaseStudySection[];
  interviewTips: string[];
}
