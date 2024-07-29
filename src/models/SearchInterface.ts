export interface SearchData {
    DocumentId: string,
    DocumentTitle: TextInterface;
    DocumentExcerpt: TextInterface;
    DocumentURI: string;
}

interface TextInterface {
    Text: string,
    Highlights: Highlight[];
} 

interface Highlight {
    BeginOffset: number;
    EndOffset: number;
}

export interface SearchResult {
    DocumentId: string,
    DocumentTitle: string;
    DocumentExcerpt: string;
    DocumentURI: string;
}