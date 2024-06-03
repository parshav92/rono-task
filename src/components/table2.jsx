import React, { useEffect, useState, useRef } from "react";
import Pagination from "./Pagination";
import SearchBar from "./common/Search";
import { useAuth } from "./auth/AuthContext";

const Table2 = () => {
  const [tickers, setTickers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const tickersPerPage = 10;
  const ws = useRef(null);

  const { logout } = useAuth();

  useEffect(() => {
    ws.current = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const filteredData = data.map((ticker) => ({
        symbol: `${ticker.s.slice(0, 3)}/${ticker.s.slice(3)}`,
        price: parseFloat(ticker.c).toFixed(2),
        volume: parseFloat(ticker.v).toFixed(2),
        priceChange: parseFloat(ticker.p).toFixed(2),
        priceChangePercent: parseFloat(ticker.P).toFixed(2),
      }));
      setTickers(filteredData);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [searchTerm]);

  const filteredTickers = tickers.filter((ticker) =>
    ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTicker = currentPage * tickersPerPage;
  const indexOfFirstTicker = indexOfLastTicker - tickersPerPage;
  const currentTickers = filteredTickers.slice(
    indexOfFirstTicker,
    indexOfLastTicker
  );

  const paginate = (pageNumber) => {
    if (
      pageNumber > 0 &&
      pageNumber <= Math.ceil(filteredTickers.length / tickersPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const totalPages = Math.ceil(filteredTickers.length / tickersPerPage);

  return (
    <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
      <div className="p-6 bg-gray-800 rounded-lg shadow-md w-full max-w-4xl overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">
          Binance Live Spot Tokens Data
        </h1>
        <button
          onClick={logout}
          className="absolute top-4 right-4 bg-transparent py-2 px-4 rounded-xl text-red font-semibold hover:bg-red-600"
        >
          Logout
        </button>
        <SearchBar setSearchTerm={setSearchTerm} />
        <table className="min-w-full bg-gray-700 text-gray-200 table-auto rounded-lg shadow-sm">
          <thead>
            <tr>
              <th className="w-1/5 py-2 px-3 border-b border-gray-600 text-left text-sm font-medium">
                Token Name
              </th>
              <th className="w-1/5 py-2 px-3 border-b border-gray-600 text-left text-sm font-medium">
                Price
              </th>
              <th className="w-1/5 py-2 px-3 border-b border-gray-600 text-left text-sm font-medium">
                Volume
              </th>
              <th className="w-1/5 py-2 px-3 border-b border-gray-600 text-left text-sm font-medium">
                Price Change
              </th>
              <th className="w-1/5 py-2 px-3 border-b border-gray-600 text-left text-sm font-medium">
                Price Change %
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTickers.map((ticker) => (
              <tr
                key={ticker.symbol}
                className="hover:bg-gray-600 transition-colors duration-200"
              >
                <td className="py-2 px-3 border-b border-gray-600">
                  {ticker.symbol}
                </td>
                <td className="py-2 px-3 border-b border-gray-600">
                  $ {ticker.price}
                </td>
                <td className="py-2 px-3 border-b border-gray-600">
                  {ticker.volume}
                </td>
                <td
                  className={`py-2 px-3 border-b border-gray-600 ${
                    ticker.priceChange < 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {ticker.priceChange}
                </td>
                <td
                  className={`py-2 px-3 border-b border-gray-600 ${
                    ticker.priceChangePercent < 0
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {ticker.priceChangePercent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default Table2;
