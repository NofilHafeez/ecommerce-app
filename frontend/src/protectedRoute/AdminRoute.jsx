import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const AdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext); // ✅ Get user from context 
    console.log(user)

    if (user === null) {
        return <p>Loading...</p>; // Prevents flicker
      }

  if (!user || !user.isAdmin) {
    return <Navigate to="/unauthorized" />; // Redirect if not admin
     
} 

  return children;
  
};

export default AdminRoute;
