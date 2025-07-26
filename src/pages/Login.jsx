import React from "react";
import { useState } from "react";
import Authenticated from "../components/Authenticated";
import Welcome from "./Main";
import LoginComponent from "../components/Login";

function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUser(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <>
      <section>
        <Authenticated isAuthenticated={isAuthenticated}>
          <Welcome onLogout={handleLogout} username={user} />
          <LoginComponent onLogin={handleLogin} />
        </Authenticated>
      </section>
    </>
  );
}

export default Login;
