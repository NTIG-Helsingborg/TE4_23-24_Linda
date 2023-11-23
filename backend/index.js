const express = require("express");
const app = express();
const db = require("better-sqlite3")("database.db");
const port = 3000;

app.get("/randomize", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
