import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import searchstyle from '../Search/Searchbar.module.css'

function Searchbar() {
  const[searchWord, setSearchWord] = useState({word : ''})

  const handleWordChange = (event) => {
    setSearchWord({
      word: event.target.value,
    });
  };

  const onsubmitword = (e) => {
    e.preventDefault()
  };

  return (
    <>
      <form action="" onSubmit={onsubmitword}>
        <input
          type="search"
          name=""
          id=""
          placeholder="Search..."
          value={searchWord.word}
          onChange={handleWordChange}
        />
        <Link to={`/searched/${searchWord.word}`}>
          <button type="submit">Search</button>
        </Link>
      </form>
    </>
  );
}

export default Searchbar
