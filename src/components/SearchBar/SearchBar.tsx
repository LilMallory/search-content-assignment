import './SearchBar.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import SearchIconSvg from '../../assets/ic-Search.svg';
import { ReactSVG } from 'react-svg';
import SearchService from '../../services/SearchService';
import { BoldedText } from '../utils/BoldText';
import { getSimilarity } from '../utils/SimilarityScore';

const KEY_CODES = {
    "DOWN": 40,
    "UP": 38,
    "ESCAPE": 27,
    "ENTER": 13,
}

// Search Bar properties
export type SearchBarProps = {
    onSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({ onSearch } : SearchBarProps) => {
    const [ inputValue, setInputValue ] = useState(""); // stores input value
    const [ suggestions, setSuggestions ] = useState<string[]>([]); // stores suggestion in a string list
    const [ selectedIndex, setSelectedIndex ] = useState(-1); // stores current index for key press selection of suggestion options
    const [ hasError, setHasError ] = useState(false);
    const listRef = useRef<HTMLUListElement>(null); // suggestion list reference
    const possibleSuggestionRef = useRef(new Array()); // stores all possible suggestions

    // filters suggestion based on number of occurence of input string in suggestion string
    const getFilteredSuggestions = useCallback(async () => {
        const trimmedInputValue = inputValue.trim();
        if (trimmedInputValue.length > 2) {
            await SearchService.fetchSuggestions()
                .then((result) => {
                    possibleSuggestionRef.current = result;
                    const filteredSuggestions = possibleSuggestionRef.current.filter(suggestion => suggestion.toLowerCase().includes(trimmedInputValue.toLowerCase()));
                    filteredSuggestions.sort((a, b) => {
                        return getSimilarity(b, trimmedInputValue) - getSimilarity(a, trimmedInputValue);
                    }).slice(0, 6); // sorts by number of occurrence and get top 6 results only
                    setSuggestions(filteredSuggestions);
                    setHasError(false);
                }).catch(() => {
                    setHasError(true);
                    setSuggestions([]);
                });
        } else {
            clearSuggestions();
        }
    }, [inputValue]);

    useEffect(() => {
        getFilteredSuggestions();
    }, [inputValue, getFilteredSuggestions])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = (e.target as HTMLInputElement).value;
        setInputValue(value);
    };

    // set input as search
    function setSearchValue(value: string) {
        let searchValue = value;
        if (!value || value === inputValue) {
            searchValue = inputValue.trim();
            setInputValue(searchValue);
        }
        onSearch(searchValue);
        clearSuggestions();
    }

    const handleSuggestionClick = (value: string) => {
        setInputValue(value);
        setSearchValue(value);
    }

    function clearSuggestions() {
        // delay added to ensure suggestion option can be registered as an input when selected, before being cleared
        setTimeout(() => {
            setSuggestions([]);
            setSelectedIndex(-1);
        }, 200);
    }

    /* Key Press Functions - Start */
    // get height of an option if suggestion list, if scrolling of options is required
    const optionHeight = listRef?.current?.children[0]?.clientHeight;

    // on enter
    function selectOption(index: number) {
        if (index > -1) {
            setInputValue(suggestions[index]);
        }
        setSearchValue(suggestions[index]);
    }

    // on arrowUp
    function scrollUp() {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1)
        }
        const listElement = listRef.current;
        if (listElement) {
            listElement.scrollTop -= optionHeight!;
        }
    }

    // on arrowDown
    function scrollDown() {
        if (selectedIndex < suggestions.length - 1) {
            setSelectedIndex(selectedIndex + 1)
        }
        const listElement = listRef.current;
        if (listElement) {
            listElement.scrollTop = selectedIndex * optionHeight!;
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (inputValue.trim().length === 0) return;
        const keyOperation = {
            [KEY_CODES.DOWN]: scrollDown,
            [KEY_CODES.UP]: scrollUp,
            [KEY_CODES.ENTER]: () => selectOption(selectedIndex),
            [KEY_CODES.ESCAPE]: clearSuggestions,
        }
        if (keyOperation[e.keyCode]) {
            keyOperation[e.keyCode]()
        } else {
            setSelectedIndex(-1)
        }
    }
    /* Key Press Functions - End */

    return(
        <div className="input-wrapper">
            {/* Input Box */}
            <input id="search-bar" type="search" className="input-box" placeholder="Enter search"
                onChange={handleInputChange}
                value={inputValue}
                onKeyDown={(e) => handleKeyDown(e)}
                onBlur={() => clearSuggestions()}
                role="searchbox"
                aria-autocomplete="list"
                aria-controls="autocomplete-list"
            />
            {/* Search Button */}
            <button id="search-button" className="search-button" onClick={() => setSearchValue(inputValue)} disabled={inputValue.trim().length === 0}>
                <ReactSVG src={SearchIconSvg}></ReactSVG>
                Search
            </button>
            {/* Suggestion list */}
            {suggestions && suggestions.length > 0 && inputValue.trim().length > 2 && !hasError && (
                <ul ref={listRef} className="suggestions-list" id="autocomplete-list" role="listbox">
                    {suggestions!.map((suggestion, index) => (
                        <li key={index} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)} aria-selected={index === selectedIndex ? "true" : "false"} role="option">{BoldedText(suggestion, inputValue.trim(), false)}</li>
                    ))}
                </ul>
            )}
            {/* Error Message when unable to retrieve suggestions */}
            {inputValue.trim().length > 2 && hasError && (
                <ul ref={listRef} className="suggestions-list unselectable" id="autocomplete-list" role="listbox">
                    <b>Error retrieving suggestions.</b>
                </ul>
            )}
        </div>
    );
};

export default SearchBar;