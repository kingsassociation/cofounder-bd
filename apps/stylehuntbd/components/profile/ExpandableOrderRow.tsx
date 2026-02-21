"use client";

import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { useState } from "react";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedSize?: string;
  selectedColor?: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export default function ExpandableOrderRow({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-600 bg-amber-50";
      case "PROCESSING": return "text-blue-600 bg-blue-50";
      case "SHIPPED": return "text-purple-600 bg-purple-50";
      case "DELIVERED": return "text-green-600 bg-green-50";
      case "CANCELLED": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <>
      <tr 
        className="hover:bg-gray-50 transition-colors cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-900">#{order.id.slice(-6).toUpperCase()}</span>
            {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {new Date(order.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {order.items?.length || 0} Items
        </td>
        <td className="px-6 py-4 font-bold text-gray-900">
          ৳{order.total.toLocaleString()}
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="bg-gray-50/50">
          <td colSpan={5} className="px-6 py-4">
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Items</h4>
              <div className="grid gap-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="text-gray-300" size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <div className="flex gap-2 mt-0.5">
                         {item.selectedSize && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">Size: {item.selectedSize}</span>}
                         {item.selectedColor && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">Color: {item.selectedColor}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">৳{item.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
