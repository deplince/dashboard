"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/app/libs/api/auth";
import { updateUser, changePassword } from "@/app/libs/api/users";
import { UserCardInterface } from "@/app/libs/data";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserCardInterface | null>(null);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [profileStatus, setProfileStatus] = useState({ message: "", type: "" });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({
    message: "",
    type: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await fetchProfile();
      setUser(userData);
      setProfileForm({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
      });
    } catch (error) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus({ message: "", type: "" });

    if (!user) return;

    try {
      await updateUser(user.id, profileForm);
      setProfileStatus({
        message: "Profile updated successfully!",
        type: "success",
      });
      loadProfile();
    } catch (err: any) {
      setProfileStatus({
        message: err?.response?.data?.message || "Failed to update profile",
        type: "error",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({ message: "", type: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({
        message: "New passwords do not match",
        type: "error",
      });
      return;
    }

    if (!user) return;

    try {
      await changePassword({
        userId: user.id,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordStatus({
        message: "Password changed successfully!",
        type: "success",
      });
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setPasswordStatus({
        message: err?.response?.data?.message || "Failed to change password",
        type: "error",
      });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Personal Information
          </h2>

          {profileStatus.message && (
            <div
              className={`mb-4 rounded p-3 text-sm ${profileStatus.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {profileStatus.message}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={profileForm.first_name}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      first_name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={profileForm.last_name}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      last_name: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Update Profile
            </button>
          </form>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Change Password
          </h2>

          {passwordStatus.message && (
            <div
              className={`mb-4 rounded p-3 text-sm ${passwordStatus.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {passwordStatus.message}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                required
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                required
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
