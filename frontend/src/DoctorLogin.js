import React, { useState } from "react";
import axios from "axios";

function DoctorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("https://quickcare-backend-eb2n.onrender.com/doctor-login", {
        username,
        password
      });

      if (res.data.success) {
        window.location.href = "/doctor";
      }
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Doctor Login 🔐</h1>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default DoctorLogin;