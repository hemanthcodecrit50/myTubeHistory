const WatchTimeStats = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded shadow text-center mb-4">
      <h2 className="text-xl font-semibold mb-2">📊 Avg YouTube Watch Time</h2>
      <p className="text-lg">🗓️ Past 7 Days: <span className="font-bold">{data.week} hrs/day</span></p>
      <p className="text-lg">📆 Past 30 Days: <span className="font-bold">{data.month} hrs/day</span></p>
    </div>
  );
};

export default WatchTimeStats;
