"use client";
import { Check, Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface Address {
  id: string;
  label: string | null;
  name: string;
  phoneNumber: string;
  address: string;
  district: string;
  thana: string;
  isPrimary: boolean;
}
export default function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    label: "Home",
    name: "",
    phoneNumber: "",
    address: "",
    district: "",
    thana: "",
    isPrimary: false,
  });
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [thanas, setThanas] = useState<{ id: string; name: string }[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAddresses();
    fetch("https://bdapi.vercel.app/api/v.1/district")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setDistricts(
            data.data.sort((a: any, b: any) => a.name.localeCompare(b.name)),
          );
        }
      })
      .catch((err) => console.error("Failed to fetch districts", err));
  }, []);
  useEffect(() => {
    if (!formData.district) {
      setThanas([]);
      return;
    }
    const selectedDistrict = districts.find(
      (d) => d.name === formData.district,
    );
    if (!selectedDistrict) return;
    setLoadingLocations(true);
    fetch(`https://bdapi.vercel.app/api/v.1/upazilla/${selectedDistrict.id}`)
      .then((res) => res.json())
      .then((data) => {
        let upazilas = [];
        if (data.data && Array.isArray(data.data.upazilla)) {
          upazilas = data.data.upazilla;
        } else if (Array.isArray(data.data)) {
          upazilas = data.data;
        }
        setThanas(
          upazilas.sort((a: any, b: any) => a.name.localeCompare(b.name)),
        );
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingLocations(false));
  }, [formData.district, districts]);
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Address deleted");
        setAddresses(addresses.filter((a) => a.id !== id));
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Address added successfully");
        setShowForm(false);
        fetchAddresses();
        setFormData({ ...formData, name: "", phoneNumber: "", address: "" });
      } else {
        toast.error(data.error || "Failed to add address");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };
  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-neutral-400" />
      </div>
    );
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">My Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>
      {showForm && (
        <div className="mb-8 bg-neutral-50 p-6 rounded-xl border border-neutral-200 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-neutral-900 mb-4">
            Add New Address
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Label
              </label>
              <select
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Contact Name
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                placeholder="Receiver Name"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Phone Number
              </label>
              <input
                required
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Detailed Address
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                placeholder="House 123, Road 4, Block B..."
                rows={2}
              />
            </div>
            {}
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                District
              </label>
              <select
                required
                value={formData.district}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    district: e.target.value,
                    thana: "",
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Thana
                {loadingLocations && (
                  <Loader2 size={10} className="inline ml-2 animate-spin" />
                )}
              </label>
              <select
                required
                value={formData.thana}
                onChange={(e) =>
                  setFormData({ ...formData, thana: e.target.value })
                }
                disabled={!formData.district}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none bg-white disabled:opacity-50"
              >
                <option value="">Select Thana</option>
                {thanas.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={formData.isPrimary}
                onChange={(e) =>
                  setFormData({ ...formData, isPrimary: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPrimary" className="text-sm text-neutral-700">
                Set as default shipping address
              </label>
            </div>
            <div className="col-span-1 md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-white border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-neutral-300">
          <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-neutral-900">
            No addresses found
          </h3>
          <p className="text-neutral-500 mb-4">
            Add a shipping address for faster checkout.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-xl border relative group transition-all ${addr.isPrimary ? "border-blue-500 bg-blue-50/10 shadow-sm" : "border-neutral-200 bg-white hover:border-blue-300"}`}
            >
              {addr.isPrimary && (
                <div className="absolute top-2 right-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <Check size={12} /> Default
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-bold uppercase rounded tracking-wider">
                  {addr.label || "Home"}
                </span>
                {!addr.isPrimary && (
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-neutral-400 hover:text-red-500 p-1 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <h4 className="font-bold text-neutral-900">{addr.name}</h4>
              <p className="text-sm text-neutral-600 mt-1">
                {addr.phoneNumber}
              </p>
              <p className="text-sm text-neutral-700 mt-2 line-clamp-2">
                {addr.address}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {addr.thana}, {addr.district}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
