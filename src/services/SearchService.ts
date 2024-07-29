import { SearchData, SearchResult } from "../models/SearchInterface";

const searchAPIUrl = 'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json';
// const searchAPIUrl = 'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/';
const suggestionAPIUrl = 'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json';
// const suggestionAPIUrl = 'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/';

const SearchService = {
    async fetchSearchResults(): Promise<SearchResult[]> {
        const response = await fetch(searchAPIUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Http Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const { ResultItems } = data;
                const result: Array<SearchResult> = ResultItems.map(({ DocumentId, DocumentTitle, DocumentExcerpt, DocumentURI }: SearchData) => ({
                    DocumentId,
                    DocumentTitle: DocumentTitle.Text,
                    DocumentExcerpt: DocumentExcerpt.Text,
                    DocumentURI
                }))
                return result;
            })
            .catch(() => {
                throw new Error('Error fetching search results.')
            });
        return response;
    },

    async fetchSuggestions(): Promise<string[]> {
        const response = await fetch(suggestionAPIUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Http Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                return data.suggestions;
            })
            .catch(() => {
                throw new Error('Error fetching suggestions.')
            });
        return response;
    }
}

export default SearchService;