const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= VARIABLES ================= */

let queue = [];
let currentToken = 0;
let lastToken = 0;

/* ================= ADD PATIENT ================= */

app.post("/add", (req, res) => {
  const { name, age, address, gender, contact, issue } = req.body;

  // 🔒 Validation
  if (!name || !age || !address || !gender || !contact || !issue) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (String(age).length > 2) {
    return res.status(400).json({ message: "Age must be max 2 digits" });
  }

  if (!/^[0-9]{10}$/.test(contact)) {
    return res.status(400).json({ message: "Contact must be 10 digits" });
  }

  const validGenders = ["Male", "Female", "Others"];
  if (!validGenders.includes(gender)) {
    return res.status(400).json({ message: "Invalid gender" });
  }

  // 🎟️ Token
  lastToken++;
  const token = lastToken;

  // 📥 Store in memory
  queue.push({
    token,
    name,
    age,
    address,
    gender,
    contact,
    issue
  });

  res.json({ token });
});

/* ================= GET QUEUE ================= */

app.get("/queue", (req, res) => {
  res.json({
    queue,
    currentToken,
    waitingCount: queue.filter(p => p.token > currentToken).length
  });
});

/* ================= NEXT PATIENT ================= */

app.post("/next", (req, res) => {
  if (currentToken < lastToken) {
    currentToken++;
  }

  res.json({ currentToken });
});

/* ================= RESET ================= */

app.post("/reset", (req, res) => {
  queue = [];
  currentToken = 0;
  lastToken = 0;

  res.json({ message: "System reset successful" });
});

/* ================= DOCTOR LOGIN ================= */

app.post("/doctor-login", (req, res) => {
  const { username, password } = req.body;

  if (username === "doctor" && password === "1234") {
    res.json({ success: true });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }
});

/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});