export interface ProjectsPreviewEntry {
  title: string;
  date: Date;
  stack: string[];
  links?: { label: string; url: string }[];
  body?: string;
}

export interface ProjectsPreviewProps {
  entries: ProjectsPreviewEntry[];
}
