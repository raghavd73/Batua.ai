const { buildStockDetails } = require("./marketData");

function buildNormalizedStockDetails(instrument) {
  return buildStockDetails(instrument);
}

module.exports = {
  buildNormalizedStockDetails,
};