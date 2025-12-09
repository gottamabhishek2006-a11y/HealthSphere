// src/pages/PatientDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Patient Dashboard</h2>
      <ul>
        <li>
          <Link to="/appointments">Manage Appointments</Link>
        </li>
        <li>
          <Link to="/telemedicine/room123">Join Telemedicine Room</Link>
        </li>
      </ul>
    </div>
  );
};

export default PatientDashboard;
