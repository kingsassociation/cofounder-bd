"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ExpandableOrderRow from "./ExpandableOrderRow";
export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/user/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm font-medium text-gray-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <ExpandableOrderRow key={order.id} order={order} />
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
