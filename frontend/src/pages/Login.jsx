import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Required field validation
        if (!email || !password) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/auth/signin", {
                email,
                password,
            });

            const { token, user } = res.data;

            // Save token to localStorage
            localStorage.setItem("token", token);

            // Update user in AuthContext
            setUser(user);

            toast.success("Login successful!");

            // Redirect based on role
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/profile");
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                        {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: 'white' }}></div> : "Login"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don&apos;t have an account? <Link to="/signup">Signup</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
