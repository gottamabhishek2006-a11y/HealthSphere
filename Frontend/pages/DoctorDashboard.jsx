// src/pages/DoctorDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Doctor Dashboard</h2>
      <ul>
        <li>
          <Link to="/appointments">View Appointments</Link>
        </li>
        <li>
          <Link to="/telemedicine/room123">Start Telemedicine Session</Link>
        </li>
      </ul>
    </div>
  );
};

export default DoctorDashboard;
