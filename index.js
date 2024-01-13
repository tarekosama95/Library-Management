const express = require("express");
const bodyParser = require("body-parser");
const api = require("./routes/api");
const limiter = require("./middlewares/limiters/rateLimiter");

const app = express();
const PORT = process.env.NODE_LOCAL_PORT || 8080;

app.use(bodyParser.json());
app.use(limiter);
// Use routes
app.use("/api", api);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
