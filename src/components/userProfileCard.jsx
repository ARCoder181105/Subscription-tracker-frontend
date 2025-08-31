import React, { useEffect, useState } from "react";
import { Mail, Calendar, Shield } from "lucide-react";

const DEFAULT_AVATAR =
  "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning,`;
  if (hour < 17) return `Good afternoon,`;
  return `Good evening,`;
};

const UserProfileCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Correct way to access Vite environment variable
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/v1/user/profile`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("API Response:", data);

        // ✅ Ensure correct path to user
        setUser(data.data?.user || null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <p className="text-red-600">Failed to load user profile</p>
      </div>
    );
  }

  const name =
    user.username || user.name || user.email?.split("@")[0] || "User";
  const avatar = user.avatar;
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently joined";

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6 mb-8 shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
          />
          {/* Online badge */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            {getGreeting()} {name}
          </h2>
          <p className="text-gray-700 font-medium">{name}</p>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
            {user.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                <span>{user.email}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{joinDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-blue-200 flex justify-between items-center text-sm">
        <div className="text-gray-600">Manage your subscriptions easily</div>
        <div className="flex items-center text-blue-600">
          <Shield className="w-4 h-4 mr-1.5" />
          Active Session
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
