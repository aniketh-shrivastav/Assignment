import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { request } from "../services/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Z\s'\-]+$/;
const passwordLetterAndDigit = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

const validateRegister = (form) => {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (form.name.trim().length > 50) {
    errors.name = "Name must be at most 50 characters";
  } else if (!nameRegex.test(form.name.trim())) {
    errors.name =
      "Name can only contain letters, spaces, hyphens and apostrophes";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (form.password.length > 128) {
    errors.password = "Password must be at most 128 characters";
  } else if (!passwordLetterAndDigit.test(form.password)) {
    errors.password =
      "Password must contain at least one letter and one number";
  }

  return errors;
};

const RegisterPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const errors = validateRegister(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await request({
        path: "/auth/register",
        method: "POST",
        body: form,
      });

      onLogin(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={form.name}
          onChange={handleChange("name")}
          className={fieldErrors.name ? "input-error" : ""}
        />
        {fieldErrors.name && (
          <span className="field-error">{fieldErrors.name}</span>
        )}

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          className={fieldErrors.email ? "input-error" : ""}
        />
        {fieldErrors.email && (
          <span className="field-error">{fieldErrors.email}</span>
        )}

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          className={fieldErrors.password ? "input-error" : ""}
        />
        {fieldErrors.password && (
          <span className="field-error">{fieldErrors.password}</span>
        )}
        <span className="field-hint">
          Min 6 characters, must include a letter and a number
        </span>

        <label>Role</label>
        <select value={form.role} onChange={handleChange("role")}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      {error && <p className="message error">{error}</p>}
      <p className="helper-text">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
