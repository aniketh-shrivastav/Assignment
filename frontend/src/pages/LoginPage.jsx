import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { request } from "../services/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLogin = (form) => {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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

    const errors = validateLogin(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await request({
        path: "/auth/login",
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
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="message error">{error}</p>}
      <p className="helper-text">
        Need an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
