"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderForm } from "@/components/forms/OrderForm";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
interface Order {
  _id: string;
  dna_id: number;
  name: string;
  species_id: { _id: string; name: string };
  customer_id: { _id: string; name: string; phone: string };
  entry_date: string;
  delivery_date: string;
  status: string;
  sex: string;
  notes: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ringId, setRingId] = useState("");
  const [dna_id, setDnaId] = useState("");

  const [customers, setCustomers] = useState<any[]>([]);
  const [species, setSpecies] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formVisible, setFormVisible] = useState(false); // controls animation state

  function openForm() {
    setShowForm(true);
    // next tick, trigger the enter transition
    requestAnimationFrame(() => setFormVisible(true));
  }

  function closeForm() {
    setFormVisible(false);
    setTimeout(() => {
      setShowForm(false);
      setEditingId(null);
      setEditingData(null);
    }, 200); // match transition duration
  }


  useEffect(() => {
    fetchDropdownData();
  }, [filterStatus, filterCustomer, filterSpecies, startDate, endDate, ringId, dna_id]);

  useEffect(() => {
    setPage(1);
  }, [filterStatus, filterCustomer, filterSpecies, startDate, endDate, ringId, dna_id]);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, filterCustomer, filterSpecies, startDate, endDate, ringId, dna_id, page]);


  async function fetchOrders() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterCustomer) params.append("customer_id", filterCustomer);
      if (filterSpecies) params.append("species_id", filterSpecies);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (ringId) params.append("ringId", ringId);
      if (dna_id) params.append("dna_id", dna_id);
      params.append("page", String(page));
      params.append("limit", String(limit));

      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalOrders(data.pagination?.total || 0);
        setSelectedOrders([]); // clear stale selections across pages
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDropdownData() {
    try {
      const [customersRes, speciesRes] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/species"),
      ]);
      const customersData = await customersRes.json();
      const speciesData = await speciesRes.json();
      setCustomers(customersData.data || []);
      setSpecies(speciesData.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  }

  async function handleSubmit(formData: any) {
    try {
      const url = editingId ? `/api/orders/${editingId}` : "/api/orders";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchOrders();
        setShowForm(false);
        setEditingId(null);
        setEditingData(null);
        toast.success(editingId ? "Order updated successfully" : "Order created successfully")
      } else {
        throw new Error(data.error || "Failed to save order");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchOrders();
        toast.success("Order deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting order");
      console.error("Error deleting order:", error);
    }
  }

  async function exportToPDF() {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order");
      return;
    }

    setExporting(true);
    try {
      const res = await fetch("/api/orders/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrders }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders-${Date.now()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  }

  async function exportToExcel() {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order");
      return;
    }

    setExporting(true);
    try {
      const res = await fetch("/api/orders/export-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrders }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders-${Date.now()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Failed to export Excel");
    } finally {
      setExporting(false);
    }
  }

  async function generateInvoice(orderId: string) {
    try {
      const res = await fetch("/api/orders/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${Date.now()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to generate invoice");
    }
  }

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Orders Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage DNA orders and generate reports
          </p>
        </div>
        <Button
          onClick={() => {
            openForm();
            setEditingId(null);
            setEditingData(null);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus size={20} />
          New Order
        </Button>
      </div>

{/* modals and forms */}
<AnimatePresence>
  {showForm && (
    <>
      {/* backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={() => {
          setShowForm(false);
          setEditingId(null);
          setEditingData(null);
        }}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* centered panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 overflow-auto w-4/5 md:w-1/2 lg:w-1/3 xl:w-1/4 max-h-[90vh]"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {editingId ? "Edit Order" : "New Order"}
        </h2>
        <OrderForm
          initialData={editingData}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
            setEditingData(null);
          }}
        />
      </motion.div>
    </>
  )}
</AnimatePresence>
 

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer
            </label>
            <select
              value={filterCustomer}
              onChange={(e) => setFilterCustomer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="">All Customers</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Species
            </label>
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="">All Species</option>
              {species.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ring ID
              </label>
              <input
                type="text"
                value={ringId}
                onChange={(e) => setRingId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                DNA ID
              </label>
              <input
                type="text"
                value={dna_id}
                onChange={(e) => setDnaId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Export buttons */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedOrders.length} order(s) selected
          </div>
          <div className="flex gap-2">
            <Button
              onClick={exportToPDF}
              disabled={selectedOrders.length === 0 || exporting}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 disabled:opacity-50"
            >
              <FileText size={18} />
              Export PDF
            </Button>
            <Button
              onClick={exportToExcel}
              disabled={selectedOrders.length === 0 || exporting}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 disabled:opacity-50"
            >
              <Download size={18} />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedOrders.length === orders.length &&
                      orders.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  DNA ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Ring ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Species
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Delivery Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Sex
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleSelectOrder(order._id)}
                    />
                  </td>
                  <td className="px-6 py-3 text-gray-900 dark:text-white font-bold">
                    {order.dna_id}
                  </td>
                  <td className="px-6 py-3 text-gray-900 dark:text-white">
                    {order.name}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {order.species_id?.name}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {order.customer_id?.name}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {new Date(order.entry_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {order.sex}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/api/orders/generate-invoice/${order._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-600 rounded"
                      >
                        <Eye size={18} />
                      </a>
                      <button
                        onClick={() => generateInvoice(order._id)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-slate-600 rounded"
                        title="Generate Invoice"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(order._id);
                          setEditingData(order);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-600 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-600 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!loading && orders.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 rounded-lg shadow mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing page {page} of {totalPages} ({totalOrders} total orders)
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 dark:bg-slate-700 dark:text-white cursor-pointer"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300 px-2">
              {page} / {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 dark:bg-slate-700 dark:text-white cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
