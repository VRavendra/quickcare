import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorLogin from "./DoctorLogin";
import Doctor from "./Doctor";

function App() {

  // ✅ STATES
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [issue, setIssue] = useState("");

  const [token, setToken] = useState(null);
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(0);

  const averageTime = 5;

  // 🔔 SOUND
  const playSound = () => {
    const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
    audio.play();
  };

  // ➕ ADD PATIENT
  const addPatient = async () => {
    if (!name || !age || !address || !gender || !contact || !issue) {
      alert("Please fill all fields");
      return;
    }

    if (contact.length !== 10) {
      alert("Contact must be 10 digits");
      return;
    }

    const res = await axios.post("http://localhost:5000/add", {
      name,
      age,
      address,
      gender,
      contact,
      issue
    });

    setToken(res.data.token);
    fetchQueue();
  };

  // 📥 FETCH QUEUE
  const fetchQueue = async () => {
    const res = await axios.get("http://localhost:5000/queue");
    setQueue(res.data.queue);
    setCurrent(res.data.currentToken);
  };

  // ▶️ NEXT PATIENT
  const nextPatient = async () => {
    await axios.post("http://localhost:5000/next");
    playSound();
    fetchQueue();
  };

  // 🔄 AUTO REFRESH
  useEffect(() => {
    fetchQueue();

    const interval = setInterval(() => {
      fetchQueue();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ⏱️ WAITING TIME
  const waitingPatients = queue.filter(p => p.token > current).length;
  const waitingTime = waitingPatients * averageTime;

  // ✅ ROUTING
  if (window.location.pathname === "/login") {
    return <DoctorLogin />;
  }

  if (window.location.pathname === "/doctor") {
    return <Doctor />;
  }

  // ✅ UI
  return (
    <div style={{
      textAlign: "center",
      marginTop: "30px",
      fontFamily: "Arial"
    }}>

      <h1 style={{ color: "#2c3e50" }}>QuickCare 🏥</h1>

      {/* FORM */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ margin: "5px", padding: "10px", width: "250px" }}
        />

        <input
          type="number"
          placeholder="Age (max 2 digits)"
          value={age}
          onChange={(e) => {
            if (e.target.value.length <= 2) setAge(e.target.value);
          }}
          style={{ margin: "5px", padding: "10px", width: "250px" }}
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ margin: "5px", padding: "10px", width: "250px" }}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{ margin: "5px", padding: "10px", width: "270px" }}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>

        <input
          placeholder="Contact (10 digits)"
          value={contact}
          onChange={(e) => {
            if (e.target.value.length <= 10) setContact(e.target.value);
          }}
          style={{ margin: "5px", padding: "10px", width: "250px" }}
        />

        <input
          placeholder="Health Issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          style={{ margin: "5px", padding: "10px", width: "250px" }}
        />

        <button onClick={addPatient} style={{
          padding: "10px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          marginTop: "10px",
          width: "150px",
          borderRadius: "5px"
        }}>
          Get Token
        </button>

        <button onClick={() => window.location.href = "/login"} style={{
          padding: "10px",
          marginTop: "10px",
          borderRadius: "5px"
        }}>
          Doctor Login
        </button>

      </div>

      {/* STATUS */}
      {token && <h2>Your Token: {token}</h2>}

      <h3 style={{ color: "green" }}>Now Serving: {current}</h3>
      <h3>Waiting Time: {waitingTime} mins</h3>

      <button onClick={nextPatient} style={{
        padding: "10px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "5px"
      }}>
        Next Patient
      </button>

      {/* QUEUE */}
      <h3>Queue:</h3>

      {queue.length === 0 ? (
        <p>No patients in queue</p>
      ) : (
        queue.map((p) => (
          <p key={p.token}>
            #{p.token} - {p.name} | {p.age} yrs | {p.gender} | {p.contact} | {p.issue}
          </p>
        ))
      )}

    </div>
  );
}

export default App;