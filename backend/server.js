const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   DB CONNECTION (FIXED SSL)
========================= */
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: false
  }
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* =========================
   DB TEST ROUTE
========================= */
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "DB Working ✅",
      time: result.rows[0]
    });
  } catch (err) {
    res.json({
      status: "DB Failed ❌",
      error: err.message
    });
  }
});

/* =========================
   CREATE LEAD
========================= */
app.post("/leads", async (req, res) => {
  try {
    const { name, phone, source } = req.body;

    const result = await pool.query(
      "INSERT INTO leads (name, phone, source) VALUES ($1, $2, $3) RETURNING *",
      [name, phone, source]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET ALL LEADS
========================= */
app.get("/leads", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM leads ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE LEAD
========================= */
app.put("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query(
      "UPDATE leads SET status=$1 WHERE id=$2",
      [status, id]
    );

    res.json({ message: "Lead Updated ✅" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE LEAD
========================= */
app.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM leads WHERE id=$1",
      [id]
    );

    res.json({ message: "Lead Deleted ✅" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});