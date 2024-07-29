import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import { useState } from 'react';
import AppHeader from './components/AppHeader/AppHeader';
import SearchResultList from './components/SearchResultList.tsx/SearchResultList';

function App() {

  const [ searchQuery, setSearchQuery ] = useState<string>("");

  return (
    <div className="App">
      <AppHeader />
      <SearchBar onSearch={setSearchQuery} />
      {searchQuery.length > 0 && <SearchResultList query={searchQuery} />}
    </div>
  );
}

export default App;