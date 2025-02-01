import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireBaseAuth } from "../firebase-config"; // Your Firebase Auth configuration
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebase-config"; // Assuming you have a db export for Firestore

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(fireBaseAuth, email, password);
      
      // Redirect based on role
      const user = fireBaseAuth.currentUser;
      if (user) {
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          navigate(`/${role}-dashboard`); // Redirect to role-specific dashboard
        }
      }
    } catch (error) {
      setError("Invalid email or password.");
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-4 w-full rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-4 w-full rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Login Button */}
        <button 
          onClick={handleLogin} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600"
        >
          Login
        </button>

        {/* Redirect to Signup page */}
        <p className="mt-4 text-center">
          Don't have an account? 
          <span 
            className="text-blue-500 cursor-pointer ml-1" 
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
