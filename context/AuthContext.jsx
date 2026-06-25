"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import authClient from "../services/betterAuth.js";
import api from "../services/api.js";

const AuthContext = createContext();

const buildError = (error, fallback) => {
  if (error.response?.data?.message)
    return new Error(error.response.data.message);
  if (error.code === "ECONNABORTED")
    return new Error("Request timed out. Please try again.");
  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    return new Error(
      "Cannot reach the server. Please make sure the API is running.",
    );
  }
  return new Error(error.message || fallback);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          try {
            const response = await api.get("/auth/me");
            setUser(response.data);
          } catch {
            await authClient.signOut();
            setUser(null);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Logout

  const logout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Better Auth sign-out error:", error.message);
    }
    setUser(null);
    setLoading(false);
  };

  // Login
  const login = async (email, password) => {
    try {
      await authClient.signIn.email({ email, password });

      // Fetch full Mongoose user profile
      const response = await api.get("/auth/me");
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw buildError(error, "Login failed");
    }
  };

  // Registration

  const register = async (name, email, password, role, phone, location) => {
    try {
      await authClient.signUp.email({
        name,
        email,
        password,
        role,
        phone,
        location,
      });

      const response = await api.get("/auth/me");
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw buildError(error, "Registration failed");
    }
  };

  // Google Sign-In

  const loginWithGoogle = async (location = "Dhaka, Bangladesh") => {
    setLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (result?.error) {
        setLoading(false);
        throw new Error(result.error.message || "Google login failed");
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to refresh user session:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isSeller: user?.role === "seller",
        isBuyer: user?.role === "buyer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
