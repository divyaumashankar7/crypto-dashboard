import { useEffect, useState } from "react";
import CryptoChart from "./CryptoChart";

function CryptoList() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [chartData, setChartData] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [sortType, setSortType] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1",
    )
      .then((response) => response.json())
      .then((data) => {
        setCoins(data);
      });
  }, []);
  const fetchChart = (id, name) => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`,
    )
      .then((res) => res.json())
      .then((data) => {
        setChartData(data.prices);
        setSelectedCoin(name);
      });
  };
  const sortCoins = (type) => {
    if (sortType === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortType(type);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      <h2>Top 10 Cryptocurrencies</h2>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => sortCoins("price")}>Sort by Price</button>

        <button
          onClick={() => sortCoins("change")}
          style={{ marginLeft: "10px" }}
        >
          Sort by 24h Change
        </button>
      </div>
      <input
        type="text"
        placeholder="Search cryptocurrency..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          display: "block",
          margin: "20px auto",
          padding: "10px",
          width: "50%",
          fontSize: "16px",
        }}
      />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Symbol</th>
            <th>Price (USD)</th>
            <th>24h Change</th>
          </tr>
        </thead>

        <tbody>
          {coins
            .filter((coin) =>
              coin.name.toLowerCase().includes(search.toLowerCase()),
            )
            .sort((a, b) => {
              if (!sortType) return 0;

              let valueA =
                sortType === "price"
                  ? a.current_price
                  : a.price_change_percentage_24h;

              let valueB =
                sortType === "price"
                  ? b.current_price
                  : b.price_change_percentage_24h;

              return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
            })
            .map((coin, index) => (
              <tr
                key={coin.id}
                onClick={() => fetchChart(coin.id, coin.name)}
                style={{ cursor: "pointer" }}
              >
                <td>{index + 1}</td>
                <td
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    src={coin.image}
                    alt={coin.name}
                    width="24"
                    height="24"
                  />
                  {coin.name}
                </td>
                <td>{coin.symbol.toUpperCase()}</td>
                <td>${coin.current_price}</td>
                <td
                  style={{
                    color:
                      coin.price_change_percentage_24h > 0 ? "lime" : "red",
                  }}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <CryptoChart chartData={chartData} coinName={selectedCoin} />;
    </div>
  );
}

export default CryptoList;
