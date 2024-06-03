import React, { useEffect, useState, useRef } from "react";
import Pagination from "./Pagination";
import SearchBar from "./common/Search";
import { useAuth } from "./auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

const Table = () => {
  const [tickers, setTickers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const tickersPerPage = 10;
  const ws = useRef(null);

  const tokenList = [
    "BTC/USDT",
    "ETH/USDT",
    "BNB/USDT",
    "ADA/USDT",
    "SOL/USDT",
    "XRP/USDT",
    "DOT/USDT",
    "DOGE/USDT",
    "SHIB/USDT",
    "LINK/USDT",
    "UNI/USDT",
    "LTC/USDT",
    "BCH/USDT",
    "XLM/USDT",
    "AVAX/USDT",
    "MATIC/USDT",
    "WBTC/USDT",
    "ALGO/USDT",
    "VET/USDT",
    "FIL/USDT",
    "TRX/USDT",
    "ATOM/USDT",
    "THETA/USDT",
    "ETC/USDT",
  ];

  const { logout } = useAuth();

  useEffect(() => {
    ws.current = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const filteredData = data
        .filter((ticker) =>
          tokenList.includes(`${ticker.s.slice(0, 3)}/${ticker.s.slice(3)}`)
        )
        .map((ticker) => ({
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

  const paginate = (pageNumber) => {
    if (
      pageNumber > 0 &&
      pageNumber <= Math.ceil(filteredTickers.length / tickersPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const totalPages = Math.ceil(filteredTickers.length / tickersPerPage);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTickers = React.useMemo(() => {
    let sortableTickers = [...filteredTickers];
    if (sortConfig.key !== null) {
      sortableTickers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTickers;
  }, [filteredTickers, sortConfig]);

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col justify-center items-center relative">
      <button
        onClick={logout}
        className="absolute top-4 right-4 bg-transparent py-2 px-4 rounded-xl text-red font-semibold hover:bg-red-600"
      >
        Logout
      </button>
      <div className="p-6 bg-gray-800 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">
          Binance Live Spot Tokens Data
        </h1>
        <SearchBar setSearchTerm={setSearchTerm} />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 text-gray-200 table-auto rounded-lg shadow-sm">
            <thead className="sticky top-0 bg-gray-800">
              <tr>
                <th
                  className="w-1/5 py-2 px-3 border-b border-gray-600 text-left text-sm font-medium cursor-pointer"
                  onClick={() => requestSort("symbol")}
                >
                  Token Name
                  {sortConfig.key === "symbol" && (
                    <FontAwesomeIcon
                      icon={
                        sortConfig.direction === "asc" ? faSortUp : faSortDown
                      }
                      className="ml-2 inline-block"
                    />
                  )}
                </th>
                <th
                  className="w-1/5 py-2 px-3 border-b border-gray-600 text-left text-sm font-medium cursor-pointer"
                  onClick={() => requestSort("price")}
                >
                  Price
                  {sortConfig.key === "price" && (
                    <FontAwesomeIcon
                      icon={
                        sortConfig.direction === "asc" ? faSortUp : faSortDown
                      }
                      className="ml-2 inline-block"
                    />
                  )}
                </th>
                <th
                  className="w-1/5 py-2 px-3 border-b border-gray-600 text-left text-sm font-medium cursor-pointer"
                  onClick={() => requestSort("volume")}
                >
                  Volume
                  {sortConfig.key === "volume" && (
                    <FontAwesomeIcon
                      icon={
                        sortConfig.direction === "asc" ? faSortUp : faSortDown
                      }
                      className="ml-2 inline-block"
                    />
                  )}
                </th>
                <th
                  className="w-1/5 py-2 px-3 border-b border-gray-600 text-left text-sm font-medium cursor-pointer"
                  onClick={() => requestSort("priceChange")}
                >
                  Price Change
                  {sortConfig.key === "priceChange" && (
                    <FontAwesomeIcon
                      icon={
                        sortConfig.direction === "asc" ? faSortUp : faSortDown
                      }
                      className="ml-2 inline-block"
                    />
                  )}
                </th>
                <th
                  className="w-1/5 py-2 px-3 border-b border-gray-600 text-left text-sm font-medium cursor-pointer"
                  onClick={() => requestSort("priceChangePercent")}
                >
                  Price Change %
                  {sortConfig.key === "priceChangePercent" && (
                    <FontAwesomeIcon
                      icon={
                        sortConfig.direction === "asc" ? faSortUp : faSortDown
                      }
                      className="ml-2 inline-block"
                    />
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTickers
                .slice(indexOfFirstTicker, indexOfLastTicker)
                .map((ticker) => (
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
                        ticker.priceChange < 0
                          ? "text-red-400"
                          : "text-green-400"
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
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default Table;
