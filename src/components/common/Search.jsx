import React, { useState } from "react";

const SearchBar = ({ setSearchTerm }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchTerm(value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        className="bg-gray-900 text-white placeholder-gray-500 rounded-md py-2 px-3 w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search by token name"
        value={searchValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
