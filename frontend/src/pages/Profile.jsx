import { useContext, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);

    const [fullName, setFullName] = useState(user?.fullName || "");
    const [email, setEmail] = useState(user?.email || "");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Update profile (name + email)
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!fullName || !email) {
            setError("Full name and email are required");
            return;
        }

        try {
            setLoading(true);
            const res = await api.put("/users/profile", {
                fullName,
                email,
            });

            setUser(res.data.user);
            setMessage("Profile updated successfully");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    // Change password
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!currentPassword || !newPassword) {
            setError("Both current and new passwords are required");
            return;
        }

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long");
            return;
        }

        try {
            setLoading(true);
            await api.put("/users/change-password", {
                currentPassword,
                newPassword,
            });

            setMessage("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    // Reset changes
    const handleCancel = () => {
        setFullName(user?.fullName || "");
        setEmail(user?.email || "");
        setMessage("");
        setError("");
    };

    // Reset password fields
    const handlePasswordCancel = () => {
        setCurrentPassword("");
        setNewPassword("");
        setMessage("");
        setError("");
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <h2>User Profile</h2>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                {/* Profile Update */}
                <form onSubmit={handleProfileUpdate} style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Profile Information</h4>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter full name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                <hr style={{ margin: "2rem 0", border: 'none', borderTop: '1px solid var(--border-color)' }} />

                {/* Password Change */}
                <form onSubmit={handlePasswordChange}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Change Password</h4>

                    <div className="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            Change Password
                        </button>
                        <button
                            type="button"
                            onClick={handlePasswordCancel}
                            disabled={loading}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
