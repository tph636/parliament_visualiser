import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./SearchBar.css";

type SearchBarProps = {
  personId?: number;
};

const SearchBar = ({ personId }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const itemsPerPage = 1;

  // Reset page when query changes
  useEffect(() => {
    setCurrentPage(0);
  }, [query]);

  const fetchResults = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const base = import.meta.env.VITE_BACKEND_API_URL;

      const url = personId
        ? `${base}/api/speeches/${personId}?q=${encodeURIComponent(
            query
          )}&page=${currentPage + 1}`
        : `${base}/api/speeches?q=${encodeURIComponent(
            query
          )}&page=${currentPage + 1}`;

      const response = await fetch(url);
      const data = await response.json();

      setResults(data.results || []);
      setPageCount(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }

    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Fetch when page changes
  useEffect(() => {
    if (query.trim()) {
      fetchResults();
    }
  }, [currentPage]);

  return (
    <div className="searchbar-wrapper">
      <form onSubmit={handleSearch} className="searchbar-form">
        <input
          type="text"
          placeholder="Hae puheenvuoroja (esim. nato, sosiaaliturva, asumistuki...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="searchbar-input"
        />
        <button type="submit" className="searchbar-button">
          Hae
        </button>
      </form>

      {loading && <p className="searchbar-loading">Haetaan...</p>}

      <div className="searchbar-results">
        {results.map((speech) => (
          <div key={speech.id} className="speech-card">
            <h3>
              {speech.firstname} {speech.lastname}
            </h3>
            <p className="speech-date">{speech.formatted_date}</p>
            <p>{speech.content}</p>
            <hr />
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"⬅"}
          nextLabel={"➡"}
          breakLabel={null}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={1}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageLinkClassName="pagination-link"
          previousLinkClassName="pagination-link"
          nextLinkClassName="pagination-link"
        />
      )}
    </div>
  );
};

export default SearchBar;
