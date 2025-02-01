import React from "react";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import { fireBaseAuth, db } from './firebase-config';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import StudentDashboard from "./Components/StudentDashboard"; // Assuming you have this component
import FacultyDashboard from "./Components/FacultyDashboard"; // Assuming you have this component
import AdminDashboard from "./Components/AdminDashboard"; // Assuming you have this component
import NotFound from "./Components/NotFound"; // Assuming you have this component

export default function App() {
  const [user, setUser] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireBaseAuth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);  // Set the role (e.g., "student", "faculty", "admin")
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) return <h1>Loading...</h1>;

  // Protected routes that depend on the user's role
  const ProtectedRoute = ({ element, requiredRole }) => {
    if (!user) {
      return <Navigate to="/login" />; // Redirect if not logged in
    }
    if (role !== requiredRole) {
      return <Navigate to="/login" />; // Redirect if user does not have the required role
    }
    return element;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />} />
        <Route path="/faculty-dashboard" element={<ProtectedRoute element={<FacultyDashboard />} requiredRole="faculty" />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
        <Route path="*" element={<NotFound />} />
      </>
    )
  );
  

  return <RouterProvider router={router} />;
}
