import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }
      toast.success("Registered! Please login.");
      navigate("/login");
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
        <h4 className="mainLabel">Create your account</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <button className="btn joinBtn" onClick={handleRegister} disabled={loading}>
            {loading ? "..." : "Register"}
          </button>
          <span className="createInfo">
            Already have an account?&nbsp;
            <Link to="/login" className="createNewBtn">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
