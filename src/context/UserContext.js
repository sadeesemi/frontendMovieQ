// context/UserContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

// Read a specific cookie
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const role = getCookie("role");
    const email = getCookie("email");
    const token = getCookie("token");

    if (role && email && token) {
      setUser({ role, email, token });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
