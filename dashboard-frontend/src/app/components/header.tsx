"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/libs/api/auth";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  if (["/auth/login", "/auth/register"].includes(pathname)) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <Link href="/records" className="text-xl font-bold text-blue-600">
              Dashboard
            </Link>
            <nav className="ml-10 flex space-x-8">
              <Link
                href="/records"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname === "/records"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Records
              </Link>
              <Link
                href="/users"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname === "/users"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Users
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className={`text-sm font-medium ${
                pathname === "/profile"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
