import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function PrivateRoute({children}) {
	const currentUser = localStorage.getItem("reel-dump-access-token");

	return currentUser ? children : <Navigate to="/login" />;
}