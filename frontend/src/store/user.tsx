import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "student" | "employee" | "other";

export type User = {
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  linkedin?: string;
  // student
  studentId?: string;
  major?: string;
  gradYear?: string;
  // employee
  jobTitle?: string;
  yearsExperience?: string;
  // optional
  university?: string;
  phone?: string;
  ticketId?: string;
};

type Ctx = {
  user: User | null;
  token: string | null;
  signIn: (u: User, token?: string) => void;
  signOut: () => void;
};

export const UserContext = createContext<Ctx | null>(null);

const load = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => load("rawafed_user"));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("rawafed_token"));

  useEffect(() => {
    if (user) localStorage.setItem("rawafed_user", JSON.stringify(user));
    else localStorage.removeItem("rawafed_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("rawafed_token", token);
    else localStorage.removeItem("rawafed_token");
  }, [token]);

  const signIn = (u: User, newToken?: string) => {
    setUser(u);
    if (newToken !== undefined) setToken(newToken);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
