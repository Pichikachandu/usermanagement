import { useContext, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);

    const [fullName, setFullName] = useState(user?.fullName || "");
    const [email, setEmail] = useState(user?.email || "");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Update profile (name + email)
    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (!fullName || !email) {
            toast.error("Full name and email are required");
            return;
        }

        if (!isValidEmail(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            const res = await api.put("/users/profile", {
                fullName,
                email,
            });

            setUser(res.data.user);
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    // Change password
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword) {
            toast.error("Both current and new passwords are required");
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            toast.error("New password must be at least 8 characters long and contain both letters and numbers");
            return;
        }

        try {
            setLoading(true);
            await api.put("/users/change-password", {
                currentPassword,
                newPassword,
            });

            toast.success("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            toast.error(
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
        toast.info("Changes discarded");
    };

    // Reset password fields
    const handlePasswordCancel = () => {
        setCurrentPassword("");
        setNewPassword("");
        toast.info("Password fields cleared");
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>User Profile</h2>
                    <span className="badge badge-active">{user?.role}</span>
                </div>

                {/* Profile Information */}
                <form onSubmit={handleProfileUpdate} style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        Profile Information
                    </h4>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: 'white' }}></div> : "Save Changes"}
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

                {/* Change Password */}
                <form onSubmit={handlePasswordChange}>
                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        Security
                    </h4>

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
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: 'white' }}></div> : "Update Password"}
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
