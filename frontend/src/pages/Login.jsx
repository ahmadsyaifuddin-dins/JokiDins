import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy akun (bisa diganti dengan API backend nanti)
    const users = [
      { email: "admin@jokidins.com", password: "admin123", role: "admin" },
      { email: "user@jokidins.com", password: "user123", role: "user" },
    ];

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem("user", JSON.stringify(foundUser));
      alert("Login Berhasil!");
      
      // Redirect berdasarkan peran
      if (foundUser.role === "admin") {
        navigate("/adminPanel");
      } else {
        navigate("/dashboard");
      }
    } else {
      alert("Email atau Password salah!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded-md mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded-md mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
