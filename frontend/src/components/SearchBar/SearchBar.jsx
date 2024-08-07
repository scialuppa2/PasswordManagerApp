import React, { useEffect, useRef } from 'react';
import { TbListSearch } from "react-icons/tb";
import './SearchBar.css';

const SearchBar = ({ value, onSearch }) => {
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onSearch(newValue);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="search-bar">
      <TbListSearch className='icon'/>
      <input
        type="text"
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        placeholder="Search for a URL..."
      />
    </div>
  );
};

export default SearchBar;
