import { useState, useEffect } from "react";
import axios from "axios";
import CategoryChart from "./components/CategoryChart"; // chart component
import DurationChart from "./components/DurationChart";
import RewatchChart from "./components/RewatchChart";
import WordFrequencyChart from "./components/WordFrequencyChart"
import DailyWatchChart from "./components/DailyWatchChart";


function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [categoryStats, setCategoryStats] = useState([]);
  const [videos, setVideos] = useState([]); // required for fetchVideos
  const [ showGraph, setShowGraph] = useState(false);
  const [durationStats, setDurationStats] = useState([]);
  const [rewatchStats, setRewatchStats] = useState([]);
  const [wordStats, setWordStats] = useState([]);
  const [watchTime, setWatchTime] = useState(null);
  const [dailyWatchData, setDailyWatchData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`✅ Upload complete: ${res.data.count} videos saved.`);
      fetchVideos(); // refresh after upload
    } catch (err) {
      setMessage("❌ Upload failed. Check console.");
      console.error(err);
    } finally {
      setUploading(false);
    }

    setShowGraph(true)
  };

  const fetchCategoryStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/videos/stats/categories");
      setCategoryStats(res.data);
    } catch (err) {
      console.error("Error fetching category stats:", err);
    }
  };

  const fetchDurationStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/videos/stats/duration");
      setDurationStats(res.data);
    } catch (err) {
      console.error("Failed to fetch duration stats", err);
    }
};

  const fetchRewatchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/videos/stats/rewatch");
      setRewatchStats(res.data);
    } catch (err) {
      console.error("Failed to fetch rewatch stats", err);
    }
  };

  const fetchWordStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/videos/stats/words");
      setWordStats(res.data);
    } catch (err) {
      console.error("Failed to fetch word frequency stats", err);
    }
};


const fetchWatchTimeStats = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/videos/stats/watchtime");
    setWatchTime({
      week: res.data.avgHoursPerDayWeek,
      month: res.data.avgHoursPerDayMonth,
    });
  } catch (err) {
    console.error("Failed to fetch watch time stats", err);
  }
};



const fetchDailyWatchData = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/videos/stats/watchtime/daily");
    setDailyWatchData(res.data);
  } catch (err) {
    console.error("Failed to fetch daily watch data", err);
  }
};

const fetchVideos = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/videos");
    setVideos(res.data);
    fetchCategoryStats();
    fetchDurationStats();
    fetchRewatchStats();
    fetchWordStats();
    fetchWatchTimeStats();
    fetchDailyWatchData();

  } catch (err) {
    console.error("Error fetching videos:", err);
  }
};


  const handleClear = () => {
  setVideos([]);
  setCategoryStats([]);
  setMessage("Cleared data from view.");
  setShowGraph(false)
};

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">YouTube History Uploader</h1>

      <div className="flex flex-col items-center space-y-2 mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button onClick={handleUpload}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
        >
          {uploading ? "Uploading..." : "Upload CSV"}
        </button>

        <button onClick={handleClear}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Output
        </button>

        <p className="text-sm text-gray-700">{message}</p>
      </div>


      {/* Main charts in a horizontal flex row */}
      <div className="flex flex-wrap gap-6 justify-center mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">📊 Category Chart</h2>
          <div className="bg-white p-4 rounded shadow">
            {showGraph ? (
              <CategoryChart data={categoryStats} />
            ) : (
              <p>No category data yet.</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">⏱️ Duration Chart</h2>
          <div className="bg-white p-4 rounded shadow">
            {durationStats.length > 0 ? (
              <DurationChart data={durationStats} />
            ) : (
              <p>No duration data available.</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">🔁 Rewatch Frequency</h2>
          <div className="bg-white p-4 rounded shadow">
            {rewatchStats.length > 0 ? (
              <RewatchChart data={rewatchStats} />
            ) : (
              <p>No rewatch data available.</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">🧠 Common Title Words</h2>
          <div className="bg-white p-4 rounded shadow">
            {wordStats.length > 0 ? (
              <WordFrequencyChart data={wordStats} />
            ) : (
              <p>No title word data available.</p>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">🕒 Average Watch Time</h2>
      <div className="bg-white p-4 rounded shadow mb-4 w-full">
        {watchTime ? (
          <div className="text-center">
            <p className="text-lg">
              🗓️ Past 7 Days:{" "}
              <span className="font-bold text-blue-600">
                {watchTime.week} hrs/day
              </span>
            </p>
            <p className="text-lg mt-2">
              📆 Past 30 Days:{" "}
              <span className="font-bold text-green-600">
                {watchTime.month} hrs/day
              </span>
            </p>
          </div>
        ) : (
          <p>Loading watch time stats...</p>
        )}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">📅 Daily Watch Pattern</h2>
      <div className="bg-white p-4 rounded shadow mb-4 w-full">
        {dailyWatchData.length > 0 ? (
          <DailyWatchChart data={dailyWatchData} />
        ) : (
          <p>Loading daily chart...</p>
        )}
      </div>

    </div>
  );
}

export default App;
