import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // 1️⃣ Required field validation
        if (!fullName || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        // 2️⃣ Email format validation
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        // 3️⃣ Password strength validation
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        // 4️⃣ Password match validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            await API.post("/auth/signup", {
                fullName,
                email,
                password,
            });

            // Redirect to login after successful signup
            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.message || "Signup failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "60px auto" }}>
            <h2>Signup</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full name"
                        required
                    />
                </div>

                <div style={{ marginTop: "10px" }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                </div>

                <div style={{ marginTop: "10px" }}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </div>

                <div style={{ marginTop: "10px" }}>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ marginTop: "15px" }}
                >
                    {loading ? "Signing up..." : "Signup"}
                </button>
            </form>

            <p style={{ marginTop: "15px" }}>
                Already have an account? <Link to="/signin">Login</Link>
            </p>
        </div>
    );
};

export default Signup;
