"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface OrderFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

interface Species {
  _id: string;
  name: string;
}

interface Customer {
  _id: string;
  name: string;
  phone: string;
  farm_name: string;
}

export function OrderForm({
  initialData,
  onSubmit,
  onCancel,
}: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    species_id: "",
    customer_id: "",
    entry_date: new Date().toISOString().split("T")[0],
    delivery_date: "",
    status: "pending",
    sex: "unknown",
    notes: "",
  });

  const [species, setSpecies] = useState<Species[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [speciesSearch, setSpeciesSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showSpeciesList, setShowSpeciesList] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);

  useEffect(() => {
    fetchData();
    if (initialData) {
      setFormData({
        ...initialData,
        entry_date: new Date(initialData.entry_date)
          .toISOString()
          .split("T")[0],
        delivery_date: initialData.delivery_date
          ? new Date(initialData.delivery_date).toISOString().split("T")[0]
          : "",
        species_id: initialData.species_id?._id || initialData.species_id,
        customer_id: initialData.customer_id?._id || initialData.customer_id,
      });
    }
  }, [initialData]);

  async function fetchData() {
    try {
      const [speciesRes, customersRes] = await Promise.all([
        fetch("/api/species"),
        fetch("/api/customers"),
      ]);
      const speciesData = await speciesRes.json();
      const customersData = await customersRes.json();
      setSpecies(speciesData.data || []);
      setCustomers(customersData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const filteredSpecies = species.filter((s) =>
    s.name.toLowerCase().includes(speciesSearch.toLowerCase())
  );

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const selectedSpecies = species.find((s) => s._id === formData.species_id);
  const selectedCustomer = customers.find(
    (c) => c._id === formData.customer_id
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ring ID *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., DNA-001"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Species *
        </label>
        <div className="relative">
          <div
            onClick={() => setShowSpeciesList(!showSpeciesList)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between"
          >
            <span>
              {selectedSpecies?.name || "Select species..."}
            </span>
            <span>▼</span>
          </div>
          {showSpeciesList && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 z-10">
              <input
                type="text"
                placeholder="Search species..."
                value={speciesSearch}
                onChange={(e) => setSpeciesSearch(e.target.value)}
                className="w-full px-3 py-2 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none"
              />
              <div className="max-h-48 overflow-y-auto">
                {filteredSpecies.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => {
                      setFormData({ ...formData, species_id: s._id });
                      setShowSpeciesList(false);
                      setSpeciesSearch("");
                    }}
                    className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white"
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Customer *
        </label>
        <div className="relative">
          <div
            onClick={() => setShowCustomerList(!showCustomerList)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between"
          >
            <span>
              {selectedCustomer?.name || "Select customer..."}
            </span>
            <span>▼</span>
          </div>
          {showCustomerList && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 z-10">
              <input
                type="text"
                placeholder="Search customer..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full px-3 py-2 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none"
              />
              <div className="max-h-48 overflow-y-auto">
                {filteredCustomers.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => {
                      setFormData({ ...formData, customer_id: c._id });
                      setShowCustomerList(false);
                      setCustomerSearch("");
                    }}
                    className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer text-gray-900 dark:text-white"
                  >
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {c.farm_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Entry Date *
        </label>
        <input
          type="date"
          required
          value={formData.entry_date}
          onChange={(e) =>
            setFormData({ ...formData, entry_date: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* delivery_date  */}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Delivery Date *
        </label>
        <input
          type="date"
          value={formData.delivery_date}
          onChange={(e) =>
            setFormData({ ...formData, delivery_date: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sex
          </label>
          <select
            value={formData.sex}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          placeholder="Additional notes..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Saving..." : "Save Order"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
