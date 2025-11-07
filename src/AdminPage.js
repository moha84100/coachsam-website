import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import apiUrl from './apiConfig';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, authorization denied');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/api/users`, {
          headers: { 'x-auth-token': token },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data.filter(u => !u.isAdmin));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleManageProgram = (userId) => {
    navigate(`/admin/user/${userId}/program`);
  };

  const handleManageBody = (userId) => {
    navigate(`/admin/user/${userId}/body-measurements`);
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard - User Management</h1>
      <p>Select a user to manage their training program.</p>
      <div className="user-list-container">
        {users.length > 0 ? (
          <ul className="user-list">
            {users.map(user => (
              <li key={user._id} className="user-item">
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                <button
                  className="manage-program-btn"
                  onClick={() => handleManageProgram(user._id)}
                >
                  Gérer le programme
                </button>
                <button
                  className="manage-body-btn"
                  onClick={() => handleManageBody(user._id)}
                >
                  Mon corps
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No non-admin users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
