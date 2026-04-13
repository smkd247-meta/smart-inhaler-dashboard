import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole = "patient" | "doctor";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<string, User> = {
  "patient@demo.com": { id: "p1", name: "Rahul Sharma", email: "patient@demo.com", role: "patient" },
  "doctor@demo.com": { id: "d1", name: "Dr. Meera Joshi", email: "doctor@demo.com", role: "doctor" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole): boolean => {
    const key = role === "patient" ? "patient@demo.com" : "doctor@demo.com";
    const mockUser = mockUsers[key];
    if (mockUser) {
      setUser({ ...mockUser, email: email || mockUser.email });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
