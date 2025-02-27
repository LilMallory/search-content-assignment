import './SearchResultList.css';
import { useState, useLayoutEffect, useRef, useCallback } from 'react';
import SearchService from '../../services/SearchService';
import { SearchResult } from '../../models/SearchInterface';
import { BoldedText } from '../utils/BoldText';
import { getSimilarity } from '../utils/SimilarityScore';

type SearchResultListProps = {
    query: string;
}

const SearchResultList = ({ query }: SearchResultListProps) => {
    const [ resultList, setResultList ] = useState<SearchResult[]>([]); // stores result list
    const possibleResultRef = useRef(new Array<SearchResult>()); // stores all possible results
    const [ hasError, setHasError ] = useState(false); 
    const [ isLoading, setIsLoading ] = useState(false); // loading state for fetching results

    // filters results based on number of occurence of search string in both document title, and excerpt
    const getFilteredResults = useCallback(() => {
        const filteredResults = possibleResultRef.current.filter(({DocumentTitle, DocumentExcerpt}) => {
            return DocumentTitle.toLowerCase().includes(query.toLowerCase()) || DocumentExcerpt.toLowerCase().includes(query.toLowerCase())
        });
        // sort occurrences of search words in title and excerpt in descending
        filteredResults.sort((a, b) => {
            const documentTitleA = a.DocumentTitle;
            const documentExcerptA = a.DocumentExcerpt;
            const similarScoreA = getSimilarity(documentTitleA, query) + getSimilarity(documentExcerptA, query);
            const documentTitleB = b.DocumentTitle;
            const documentExcerptB = b.DocumentExcerpt;
            const similarScoreB = getSimilarity(documentTitleB, query) + getSimilarity(documentExcerptB, query);
            return (similarScoreB - similarScoreA);
        });
        return filteredResults;
    }, [query] );

    useLayoutEffect(() => {
        (async () => {
            setIsLoading(true);
             await SearchService.fetchSearchResults()
                .then((result) => {
                    possibleResultRef.current = result;
                    setResultList(getFilteredResults);
                    setIsLoading(false);
                    setHasError(false);
                }).catch(() => {
                    setIsLoading(false);
                    setHasError(true);
                    setResultList([]);
                });
        })();
    }, [query, getFilteredResults]);

    return(
        <div className="result-wrapper">
            {resultList && resultList.length > 0 && (
                <>
                    {/* Result summary */}
                    <div className="result-summary"> Showing 1-{resultList.length <= 10 ? resultList.length : 10} of {resultList.length} results </div>
                    {/* Document list */}
                    {resultList!.map(({ DocumentId, DocumentTitle, DocumentExcerpt, DocumentURI }, index: number) => {
                        if (index < 10) {
                            return (<div key={DocumentId} className="document-wrapper">
                                <h1 className="document-title"><a href={DocumentURI}>{DocumentTitle}</a></h1>
                                <p className="document-excerpt">{BoldedText(DocumentExcerpt, query, true)}</p>
                                <a className="document-uri" href={DocumentURI}>{DocumentURI}</a>
                            </div>);
                        };
                        return null
                    })}
                </>
            )}
            {/* Messages for when unable to retrieve results or no results */}
            {(!resultList || resultList.length === 0) && !isLoading && (
                <div className="result-summary"> { hasError ? `Sorry, we encountered an error while fetching the search results. Please try again later or check your internet connection.` : `No results for "${query}" found.` } </div>
            )}
        </div>
    );
}

export default SearchResultList;