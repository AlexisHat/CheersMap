const NodeCache = require("node-cache");
const locationApiCache = new NodeCache({ stdTTL: 3600 });

module.exports = locationApiCache;
