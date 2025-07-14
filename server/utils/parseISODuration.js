// Parses an ISO 8601 duration string (e.g., 'PT4M4S') to total seconds
function parseISODuration(isoDuration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || 0, 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const seconds = parseInt(matches[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
}

module.exports = parseISODuration;
