import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireBaseAuth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role is 'student'
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Sign up the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        fireBaseAuth,
        email,
        password
      );
      const user = userCredential.user; // Get user data (uid, email)

      // Step 2: Store the user data in Firestore, including their role
      const userRef = doc(db, "users", user.uid); // Document ID is the user UID
      await setDoc(userRef, {
        email: user.email,
        role: role, // Store the selected role (student, faculty, admin)
      });

      // Step 3: Redirect user to the login page after successful sign-up
      console.log("Redirecting ...")
      navigate("/login"); // Navigate to the login page
      window.location.reload();
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          {/* Role Tabs */}
          <div className="mb-4">
            <div className="flex justify-around mb-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`px-4 py-2 rounded-md ${role === "student" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} focus:outline-none`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("faculty")}
                className={`px-4 py-2 rounded-md ${role === "faculty" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} focus:outline-none`}
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`px-4 py-2 rounded-md ${role === "admin" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} focus:outline-none`}
              >
                Admin
              </button>
            </div>
            <div className="text-center text-sm text-gray-600">Selected Role: {role}</div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
