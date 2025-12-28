import React, { useState } from "react";
import "./SearchBar.css";

type SearchBarProps = {
  personId?: number; // optional
};

const SearchBar = ({ personId }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);

    try {
      const base = import.meta.env.VITE_BACKEND_API_URL;

      // If personId is given, search only that MP
      const url = personId
        ? `${base}/api/speeches/${personId}?q=${encodeURIComponent(query)}`
        : `${base}/api/speeches?q=${encodeURIComponent(query)}`;

      const response = await fetch(url);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="searchbar-wrapper">
      <form onSubmit={handleSearch} className="searchbar-form">
        <input
          type="text"
          placeholder="Hae puheita (esim. lapsilisä, sosiaaliturva, asumistuki...)"
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

    </div>
  );
};

export default SearchBar;
