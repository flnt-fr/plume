export interface ProjectPreviewCardProps {
  title: string;
  date: string;
  stack: string[];
  links?: { label: string; url: string }[];
  body?: string;
}
