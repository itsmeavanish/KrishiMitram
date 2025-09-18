"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import jwt_decode from "jwt-decode"
type User = {
  id: string;
  role: string;
  exp: number;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void; // ✅ include setUser
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {}, // default empty function
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // ✅ send cookies
        });

        if (res.ok) {
          const data = await res.json();
          const decoded: User = jwt_decode(data.token);
          setUser(decoded);
          console.log("Decoded user:", decoded);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
