"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUser,
  getOneUser,
  changeRole,
} from "@/app/libs/api/users";
import { fetchProfile } from "@/app/libs/api/auth";
import { UserCardInterface, UserRole } from "@/app/libs/data";

export default function UsersPage() {
  const [users, setUsers] = useState<UserCardInterface[]>([]);
  const [currentUser, setCurrentUser] = useState<UserCardInterface | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserCardInterface | null>(
    null,
  );
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [viewingUser, setViewingUser] = useState<UserCardInterface | null>(
    null,
  );

  const loadData = async () => {
    try {
      const [usersRes, profileRes] = await Promise.all([
        getAllUsers({ page: 1, limit: 100 }),
        fetchProfile(),
      ]);
      setUsers(usersRes.data);
      setCurrentUser(profileRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const canEdit = (targetUser: UserCardInterface) => {
    if (!currentUser) return false;
    return (
      currentUser.role === UserRole.ADMIN || currentUser.id === targetUser.id
    );
  };

  const handleEditClick = (user: UserCardInterface) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, formData);
      setEditingUser(null);
      loadData();
    } catch (error) {
      alert("Failed to update user");
    }
  };

  const handleViewClick = async (id: string) => {
    try {
      const user = await getOneUser(id);
      setViewingUser(user);
    } catch (error) {
      alert("Failed to fetch user details");
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    if (!confirm(`Change role to ${newRole}?`)) return;
    try {
      await changeRole({ userId, role: newRole });
      alert("Role updated successfully");
      loadData();
    } catch (error) {
      alert("Failed to change role");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* ... Edit Modal (Keep existing) ... */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-black">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">
                  First Name
                </label>
                <input
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="w-full border p-2 rounded text-black"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Last Name</label>
                <input
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="w-full border p-2 rounded text-black"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Email</label>
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border p-2 rounded text-black"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-black">
              User Details (getOneUser)
            </h2>
            <div className="space-y-2 text-gray-800">
              <p>
                <strong>ID:</strong> {viewingUser.id}
              </p>
              <p>
                <strong>Name:</strong> {viewingUser.first_name}{" "}
                {viewingUser.last_name}
              </p>
              <p>
                <strong>Email:</strong> {viewingUser.email}
              </p>
              <p>
                <strong>Role:</strong> {viewingUser.role}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(viewingUser.created_at).toLocaleString()}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-black">Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {currentUser?.role === UserRole.ADMIN &&
                    user.id !== currentUser.id ? (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleChangeRole(user.id, e.target.value as UserRole)
                        }
                        className="rounded border bg-white p-1 text-sm text-black"
                      >
                        <option value={UserRole.USER}>User</option>
                        <option value={UserRole.ADMIN}>Admin</option>
                      </select>
                    ) : (
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewClick(user.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      View
                    </button>
                    {canEdit(user) && (
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
