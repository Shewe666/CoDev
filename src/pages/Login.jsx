import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("username", data.user.name);
      toast.success("Login successful!");
      navigate("/join");
    } catch (err) {
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img src="/logo.png" alt="CoDev logo" className="logo" />
        <h4 className="mainLabel">Login to CoDev</h4>
        <div className="inputGroup">
          <input
            type="email"
            className="inputBox"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="inputBox"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn joinBtn" onClick={handleLogin} disabled={loading}>
            {loading ? "..." : "Login"}
          </button>
          <span className="createInfo">
            Don&apos;t have an account?&nbsp;
            <Link to="/register" className="createNewBtn">Register</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
