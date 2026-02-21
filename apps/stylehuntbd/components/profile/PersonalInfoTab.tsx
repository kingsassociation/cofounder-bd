"use client";
import { Loader2, Phone, Save, Upload, User as UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface UserProfile {
  name: string;
  phoneNumber: string;
  imageUrl: string | null;
}
export default function PersonalInfoTab() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: "",
    phoneNumber: "",
    imageUrl: null,
  });
  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setUser({
          name: data.name || "",
          phoneNumber: data.phoneNumber || "",
          imageUrl: data.imageUrl || null,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (max 5MB)");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUser((prev) => ({ ...prev, imageUrl: data.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update");
      }
      const updatedUser = await res.json();
      await update();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        Personal Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-3">
            Profile Picture
          </label>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <UserIcon size={40} />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="avatar-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 cursor-pointer hover:bg-neutral-50 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <Upload size={16} />
                  {uploading ? "Uploading..." : "Upload New Photo"}
                </label>
                <p className="text-xs text-neutral-500">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                placeholder="Your Name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                value={user.phoneNumber}
                onChange={(e) =>
                  setUser({ ...user, phoneNumber: e.target.value })
                }
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                placeholder="01XXXXXXXXX"
              />
            </div>
          </div>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-8 py-3 bg-neutral-900 text-white font-bold rounded-xl shadow-lg shadow-neutral-900/10 hover:bg-neutral-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
