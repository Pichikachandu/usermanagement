import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Modal from "../components/Modal";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: "", message: "", onConfirm: null });

    const fetchUsers = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/users?page=${pageNumber}&limit=10`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
            setPage(pageNumber);
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    const handleActivate = (id) => {
        setModalConfig({
            title: "Activate User",
            message: "Are you sure you want to activate this user account?",
            onConfirm: async () => {
                try {
                    await api.put(`/admin/activate/${id}`);
                    toast.success("User activated successfully");
                    fetchUsers(page);
                } catch {
                    toast.error("Failed to activate user");
                } finally {
                    setIsModalOpen(false);
                }
            }
        });
        setIsModalOpen(true);
    };

    const handleDeactivate = (id) => {
        setModalConfig({
            title: "Deactivate User",
            message: "Are you sure you want to deactivate this user account?",
            onConfirm: async () => {
                try {
                    await api.put(`/admin/deactivate/${id}`);
                    toast.success("User deactivated successfully");
                    fetchUsers(page);
                } catch {
                    toast.error("Failed to deactivate user");
                } finally {
                    setIsModalOpen(false);
                }
            }
        });
        setIsModalOpen(true);
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Managing {users.length} users on this page
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <table>
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
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u._id}>
                                        <td style={{ fontWeight: 500 }}>{u.email}</td>
                                        <td>{u.fullName}</td>
                                        <td>
                                            <span style={{
                                                textTransform: 'capitalize',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                color: u.role === 'admin' ? 'var(--primary-color)' : 'var(--text-muted)'
                                            }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge badge-${u.status}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td>
                                            {u.status === "active" ? (
                                                <button
                                                    className="btn btn-destructive"
                                                    style={{
                                                        padding: '0.4rem 0.8rem',
                                                        fontSize: '0.75rem',
                                                        width: 'auto',
                                                    }}
                                                    onClick={() => handleDeactivate(u._id)}
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', width: 'auto' }}
                                                    onClick={() => handleActivate(u._id)}
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
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => fetchUsers(page - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page <strong>{page}</strong> of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => fetchUsers(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                title={modalConfig.title}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setIsModalOpen(false)}
            >
                <p>{modalConfig.message}</p>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
