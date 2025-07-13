

require("dotenv").config();


const app = require("./server.js");

//db connection module
const connectDB = require("./config/db");

//listening port
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
})();
