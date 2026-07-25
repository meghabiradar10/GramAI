"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  userRole: "farmer" | "provider" | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUserRole: (role: "farmer" | "provider") => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  logout: async () => {},
  setUserRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"farmer" | "provider" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we would load the user's role from Firestore here
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, logout, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
