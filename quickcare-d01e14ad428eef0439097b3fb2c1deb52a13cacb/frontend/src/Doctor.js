import React from "react";
import axios from "axios";

function Doctor() {

  const nextPatient = async () => {
    await axios.post("http://localhost:5000/next");
    alert("Next patient called");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Doctor Dashboard 👨‍⚕️</h1>

      <button onClick={nextPatient} style={{
        padding: "20px",
        backgroundColor: "red",
        color: "white",
        fontSize: "20px"
      }}>
        Call Next Patient
      </button>
    </div>
  );
}

export default Doctor;