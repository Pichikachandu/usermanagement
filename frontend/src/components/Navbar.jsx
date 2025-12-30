import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // If not logged in, don't show navbar
    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="nav-brand">Purple Merit</div>

            <div className="nav-links">
                {user.role === "admin" && (
                    <Link to="/admin">Admin Dashboard</Link>
                )}
                <Link to="/profile">Profile</Link>

                <div className="nav-user">
                    <div className="user-info">
                        <span className="user-name">{user.fullName}</span>
                        <span className="user-role">{user.role}</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
