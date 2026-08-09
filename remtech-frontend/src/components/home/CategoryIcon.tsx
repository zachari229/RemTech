import {
  Code, TrendingUp, Palette, BarChart2, Globe, Download,
  BookOpen, Briefcase, Camera, Music, Video, PenTool, Layers,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  code: Code,
  developpement: Code,
  marketing: TrendingUp,
  design: Palette,
  business: BarChart2,
  finance: BarChart2,
  langue: Globe,
  communication: Globe,
  ebook: Download,
  ressource: Download,
  formation: BookOpen,
  carriere: Briefcase,
  photo: Camera,
  musique: Music,
  video: Video,
  redaction: PenTool,
};

const COLOR_PALETTE = ['#3B82F6', '#F97316', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'];

export function getCategoryIcon(iconName: string | undefined, size = 24) {
  const key = (iconName || '').toLowerCase().trim();
  const Icon = ICON_MAP[key] || Layers; // fallback icône générique
  return <Icon size={size} />;
}

export function getCategoryColor(index: number) {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}