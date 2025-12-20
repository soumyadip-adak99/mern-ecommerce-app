import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute({ children }) {
    const reduxUser = useSelector((state) => state.auth.user);
    const localUser = localStorage.getItem("user");

    if (reduxUser || localUser) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicRoute;
