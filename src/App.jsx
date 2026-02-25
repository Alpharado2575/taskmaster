import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("login");

  if (token) {
    return <Dashboard setToken={setToken} />;
  }

  return page === "login" ? (
    <Login setToken={setToken} setPage={setPage} />
  ) : (
    <Register setPage={setPage} />
  );
}
