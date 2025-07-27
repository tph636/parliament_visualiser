import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./ValihuudotList.css";

type ValihuutoEntry = {
  date: string;
  valihuuto: string;
  ptk_num: string;
};

type ValihuudotListProps = {
  personId: string | number;
};

const ValihuudotList = ({ personId }: ValihuudotListProps) => {
  const [valihuudot, setValihuudot] = useState<ValihuutoEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const itemsPerPage = 10;

  // Reset currentPage when personId changes
  useEffect(() => {
    setCurrentPage(0);
  }, [personId]);

  useEffect(() => {
    const fetchValihuudot = async () => {
      setLoading(true);
      const baseURL = import.meta.env.VITE_BACKEND_API_URL;
      try {
        // Backend expects 1-based page
        const response = await fetch(`${baseURL}/api/valihuudot/${personId}/${currentPage + 1}`);
        const data = await response.json();
        setValihuudot(data.results || []);
        setPageCount(Math.ceil((data.total || 0) / itemsPerPage));
      } catch (err) {
        console.error("Failed to fetch valihuudot:", err);
        setValihuudot([]);
      }
      setLoading(false);
    };
    fetchValihuudot();
  }, [personId, currentPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  
  return (
    
    <div className="valihuudot-container">
      <table className="valihuudot-table">
        <thead>
          <tr>
            <th>Päiväys</th>
            <th>Välihuuto</th>
            <th>PTK</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              <tr className="centered-row">
                <td colSpan={3}>Loading...</td>
              </tr>
              {Array.from({ length: itemsPerPage - 1 }).map((_, idx) => (
                <tr key={`loading-empty-${idx}`}>
                  <td colSpan={3}>&nbsp;</td>
                </tr>
              ))}
            </>
          ) : (
            <>
              {valihuudot.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date.split("T")[0]}</td>
                  <td>{entry.valihuuto}</td>
                  <td>{entry.ptk_num}</td>
                </tr>
              ))}
              {Array.from({ length: itemsPerPage - valihuudot.length }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={3}>&nbsp;</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"⬅"}
          nextLabel={"➡"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageLinkClassName="pagination-link"
          previousLinkClassName="pagination-link"
          nextLinkClassName="pagination-link"
          breakLinkClassName="pagination-link"
        />
      )}
    </div>
  );
};

export default ValihuudotList;