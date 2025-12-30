import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchUsers = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/users?page=${pageNumber}&limit=10`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
            setPage(pageNumber);
        } catch (err) {
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    const handleActivate = async (id) => {
        const confirm = window.confirm("Activate this user?");
        if (!confirm) return;

        try {
            await api.put(`/admin/activate/${id}`);
            fetchUsers(page);
        } catch {
            alert("Failed to activate user");
        }
    };

    const handleDeactivate = async (id) => {
        const confirm = window.confirm("Deactivate this user?");
        if (!confirm) return;

        try {
            await api.put(`/admin/deactivate/${id}`);
            fetchUsers(page);
        } catch {
            alert("Failed to deactivate user");
        }
    };

    if (loading) return <p>Loading users...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Admin Dashboard</h2>

            <table border="1" cellPadding="10" cellSpacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Full Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="5" align="center">
                                No users found
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.email}</td>
                                <td>{user.fullName}</td>
                                <td>{user.role}</td>
                                <td>{user.status}</td>
                                <td>
                                    {user.status === "active" ? (
                                        <button
                                            style={{ backgroundColor: "red", color: "white" }}
                                            onClick={() => handleDeactivate(user._id)}
                                        >
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            style={{ backgroundColor: "green", color: "white" }}
                                            onClick={() => handleActivate(user._id)}
                                        >
                                            Activate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                    disabled={page === 1}
                    onClick={() => fetchUsers(page - 1)}
                >
                    Prev
                </button>

                <span style={{ margin: "0 10px" }}>
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => fetchUsers(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
