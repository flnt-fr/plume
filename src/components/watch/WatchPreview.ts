export interface WatchPreviewEntry {
  title: string;
  url: string;
  date: Date;
  sourceName: string;
  sourceUrl: string;
}

export interface WatchPreviewProps {
  entries: WatchPreviewEntry[];
}
