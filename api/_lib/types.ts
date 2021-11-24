export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';
export type ogType = "blog" | "docs";
export interface ParsedRequest {
    fileType: FileType;
    text: string;
    theme: Theme;
    md: boolean;
    ogType?: ogType;
    subheading: string;
    fontSize: string;
    subheadingFontSize: string;
    images: string[];
    widths: string[];
    heights: string[];
}
