import React, { useState } from "react";
import "../styles/Login.css";

const validUsers = [
  { username: "admin", password: "1234" },
  { username: "yo-Oss", password: "abcd" },
  { username: "Alvaro-Calleros", password: "contra" },
];

export default function Login({ onLogin }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const foundUser = validUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      setError("");
      onLogin(username);
    } else {
      setError("Usuario o contraseña incorrecta");
    }
  };

  return (
    <section className="login-section">
      <h1>Iniciar Sesion</h1>

      <form onSubmit={handleSubmit} className="login-form">
        <section className="form-section">
          <label htmlFor="username"> Usuario: </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </section>
        <section className="form-section">
          <label htmlFor="password"> Contraseña: </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </section>
        <button className="button-submit" type="submit">
          Enviar
        </button>
      </form>
      {error && <p className="form-error"> {error}</p>}
    </section>
  );
}
