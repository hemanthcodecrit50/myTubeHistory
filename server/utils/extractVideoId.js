


module.exports = function extractVideoId(url) {
  const match = url.match(/(?:v=|\/shorts\/|youtu.be\/)([^&?/]+)/);
  return match ? match[1] : null;
};
