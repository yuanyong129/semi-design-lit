export interface HighlightSearchWord {
  text: string;
  className?: string;
  style?: Record<string, string | number>;
}

export type HighlightSearchWords = Array<string | HighlightSearchWord>;
