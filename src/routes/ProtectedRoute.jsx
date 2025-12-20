import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
    const location = useLocation();
    const reduxUser = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setUser(reduxUser || (storedUser ? JSON.parse(storedUser) : null));
        setLoading(false);
    }, [reduxUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/user" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
