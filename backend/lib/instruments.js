const instruments = [
  {
    ticker_symbol: "NIFTY",
    company_name: "NIFTY 50",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Index",
    aliases: ["nifty 50", "nifty", "nifty fifty"],
    price: 22450.35,
    logo_url: "",
  },
  {
    ticker_symbol: "BANKNIFTY",
    company_name: "NIFTY BANK",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Index",
    aliases: ["bank nifty", "nifty bank", "banknifty"],
    price: 48210.1,
    logo_url: "",
  },
  {
    ticker_symbol: "NIFTYMIDSELECT",
    company_name: "Nifty Midcap Select",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Index",
    aliases: ["nifty midcap select", "midcap select", "niftymidselect"],
    price: 195.95,
    logo_url: "",
  },
  {
    ticker_symbol: "NIFTYSMALLCAP250",
    company_name: "NIFTY SMALLCAP 250",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Index",
    aliases: ["smallcap 250", "nifty smallcap 250", "niftysmallcap250"],
    price: 15240.7,
    logo_url: "",
  },
  {
    ticker_symbol: "NIFTYIT",
    company_name: "NIFTY IT",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Index",
    aliases: ["nifty it", "it index", "niftyit"],
    price: 36780.8,
    logo_url: "",
  },
  {
    ticker_symbol: "RELIANCE",
    company_name: "Reliance Industries",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Stock",
    aliases: ["ril", "reliance", "reliance industries"],
    price: 2945.2,
    logo_url: "",
  },
  {
    ticker_symbol: "TCS",
    company_name: "Tata Consultancy Services",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Stock",
    aliases: ["tcs", "tata consultancy services"],
    price: 4120.4,
    logo_url: "",
  },
  {
    ticker_symbol: "INFY",
    company_name: "Infosys",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Stock",
    aliases: ["infosys", "infy"],
    price: 1688.3,
    logo_url: "",
  },
  {
    ticker_symbol: "HDFCBANK",
    company_name: "HDFC Bank",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Stock",
    aliases: ["hdfc bank", "hdfcbank"],
    price: 1628.95,
    logo_url: "",
  },
  {
    ticker_symbol: "ICICIBANK",
    company_name: "ICICI Bank",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Stock",
    aliases: ["icici bank", "icicibank"],
    price: 1214.15,
    logo_url: "",
  },
  {
    ticker_symbol: "SBIN",
    company_name: "State Bank of India",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Stock",
    aliases: ["sbi", "state bank of india", "sbin"],
    price: 782.5,
    logo_url: "",
  },
  {
    ticker_symbol: "ITC",
    company_name: "ITC",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Stock",
    aliases: ["itc"],
    price: 428.6,
    logo_url: "",
  },
  {
    ticker_symbol: "TATAMOTORS",
    company_name: "Tata Motors",
    exchange: "NSE",
    country: "India",
    currency: "INR",
    type: "Stock",
    aliases: ["tata motors", "tatamotors"],
    price: 978.25,
    logo_url: "",
  },
  {
  ticker_symbol: "MRPL",
  company_name: "Mangalore Refinery & Petrochemicals",
  exchange: "NSE",
  country: "India",
  currency: "INR",
  type: "Stock",
  aliases: ["mrpl", "mangalore refinery", "mangalore refinery & petrochemicals"],
  price: 195.82,
  logo_url: "",
},
{
  ticker_symbol: "SILVERBEES",
  company_name: "Nippon India ETF Silver BeES",
  exchange: "NSE",
  country: "India",
  currency: "INR",
  type: "ETF",
  aliases: ["silverbees", "silver bees", "nippon silver bees"],
  price: 100,
  logo_url: "",
},
];

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function searchInstruments(query) {
  const q = normalizeText(query);

  if (!q) return [];

  return instruments
    .filter((instrument) => {
      const haystack = [
        instrument.company_name,
        instrument.ticker_symbol,
        instrument.exchange,
        instrument.type,
        ...(instrument.aliases || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    })
    .slice(0, 12);
}

function findInstrument(symbol, exchange = "") {
  const normalizedSymbol = String(symbol || "").trim().toUpperCase();
  const normalizedExchange = String(exchange || "").trim().toUpperCase();

  return (
    instruments.find((instrument) => {
      const symbolMatches = instrument.ticker_symbol === normalizedSymbol;
      const exchangeMatches =
        !normalizedExchange || instrument.exchange === normalizedExchange;

      return symbolMatches && exchangeMatches;
    }) || null
  );
}

module.exports = {
  instruments,
  searchInstruments,
  findInstrument,
};