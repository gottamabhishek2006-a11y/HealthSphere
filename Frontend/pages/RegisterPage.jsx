// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import api from "../api/axiosClient";

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "PATIENT",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", form);
      alert("Registered, now login");
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register - HealthSphere</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name: </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email: </label>
          <input name="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label>Password: </label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
          />
        </div>
        <div>
          <label>Role: </label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
