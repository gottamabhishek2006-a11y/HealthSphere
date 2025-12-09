// src/pages/AppointmentsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const res = await api.get("/api/appointments");
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Appointments</h2>
      <button onClick={fetchAppointments}>Refresh</button>
      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            #{a.id} | Status: {a.status} | Start: {a.startTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsPage;
