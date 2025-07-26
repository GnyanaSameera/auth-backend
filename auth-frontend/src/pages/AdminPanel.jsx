import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { token, logout } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://YOUR_BACKEND_URL/api/auth/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch pending users");
        const data = await res.json();
        setPendingUsers(data.users || []);
      } catch (err) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [token, success]);

  const handleApprove = async (userId) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`https://YOUR_BACKEND_URL/api/auth/approve/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Approval failed");
      setSuccess("User approved!");
    } catch (err) {
      setError(err.message || "Approval failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <button onClick={handleLogout} className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <ul className="mt-4">
          {pendingUsers.length === 0 && !loading && <li>No pending users.</li>}
          {pendingUsers.map((user) => (
            <li key={user._id} className="mb-4 flex items-center justify-between">
              <span>{user.email}</span>
              <button onClick={() => handleApprove(user._id)} className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Approve</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel; 