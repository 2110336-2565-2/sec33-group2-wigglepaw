/**
 * @see https://www.omise.co/supported-banks#thailand
 */
export const banks = [
  // Add test bank account to the list for/when in development environment
  ...(process.env.NODE_ENV === "development"
    ? [{ code: "test", name: "Test" }]
    : []),
  { code: "baac", name: "Bank for Agriculture and Agricultural Cooperatives" },
  { code: "bay", name: "Bank of Ayudhya (Krungsri)" },
  { code: "bbl", name: "Bangkok Bank" },
  { code: "bnp", name: "BNP Paribas" },
  { code: "boa", name: "Bank of America" },
  { code: "cacib", name: "Crédit Agricole" },
  { code: "cimb", name: "CIMB Thai Bank" },
  { code: "citi", name: "Citibank" },
  { code: "db", name: "Deutsche Bank" },
  { code: "ghb", name: "Government Housing Bank" },
  { code: "gsb", name: "Government Savings Bank" },
  { code: "hsbc", name: "Hongkong and Shanghai Banking Corporation" },
  { code: "ibank", name: "Islamic Bank of Thailand" },
  { code: "icbc", name: "Industrial and Commercial Bank of China (Thai)" },
  { code: "jpm", name: "J.P. Morgan" },
  { code: "kbank", name: "Kasikornbank" },
  { code: "kk", name: "Kiatnakin Bank" },
  { code: "ktb", name: "Krungthai Bank" },
  { code: "lhb", name: "Land and Houses Bank" },
  { code: "mb", name: "Mizuho Bank" },
  { code: "mega", name: "Mega International Commercial Bank" },
  { code: "mufg", name: "Bank of Tokyo-Mitsubishi UFJ" },
  { code: "rbs", name: "Royal Bank of Scotland" },
  { code: "sc", name: "Standard Chartered (Thai)" },
  { code: "scb", name: "Siam Commercial Bank" },
  { code: "smbc", name: "Sumitomo Mitsui Banking Corporation" },
  { code: "tcrb", name: "Thai Credit Retail Bank" },
  { code: "tisco", name: "Tisco Bank" },
  { code: "ttb", name: "TMBThanachart Bank" },
  { code: "uob", name: "United Overseas Bank (Thai)" },
];
