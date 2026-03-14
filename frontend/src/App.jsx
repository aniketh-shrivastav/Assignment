import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const STORAGE_KEY = "internship_auth";

const getInitialAuth = () => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) {
      return { token: "", user: null };
    }

    const parsed = JSON.parse(value);
    return {
      token: parsed.token || "",
      user: parsed.user || null,
    };
  } catch (_error) {
    return { token: "", user: null };
  }
};

function App() {
  const initialAuth = useMemo(() => getInitialAuth(), []);
  const [token, setToken] = useState(initialAuth.token);
  const [user, setUser] = useState(initialAuth.user);

  const handleLogin = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser }),
    );
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Scalable API Demo UI</h1>
        <p>React frontend to test authentication and product CRUD APIs</p>
      </header>

      <main>
        <Routes>
          <Route
            path="/register"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegisterPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute token={token}>
                <DashboardPage
                  token={token}
                  user={user}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
