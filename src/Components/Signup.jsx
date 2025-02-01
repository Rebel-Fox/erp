import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireBaseAuth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handleSignup = async (e) => {
    e.preventDefault();
    // setLoading(true);
    setError(null);

    try {
      // 🔹 Step 1: Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(fireBaseAuth, email, password);
      const user = userCredential.user;

      // 🔹 Step 2: Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role, // Store selected role
      });

      // 🔹 Step 3: Redirect to login page
      navigate("/login", { replace: true });
      window.location.reload()

    } catch (error) {
      setError(error.message);
      console.error("Signup Error:", error.message);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

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

          {/* Role Selection */}
          <div className="mb-4">
            <div className="flex justify-around mb-2">
              {["student", "faculty", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-4 py-2 rounded-md ${
                    role === r ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  } focus:outline-none`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">Selected Role: {role}</div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            "Sign Up"
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
