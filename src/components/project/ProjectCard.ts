export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectCardProps {
  id: string;
  title: string;
  date: string;
  stack: string[];
  links?: ProjectLink[];
  hasBody: boolean;
}
