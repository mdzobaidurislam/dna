"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeciesForm } from "@/components/forms/SpeciesForm";

interface Species {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function SpeciesPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSpecies();
  }, []);

  async function fetchSpecies() {
    try {
      const res = await fetch("/api/species");
      const data = await res.json();
      if (data.success) {
        setSpecies(data.data);
      }
    } catch (error) {
      console.error("Error fetching species:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData: any) {
    try {
      const url = editingId ? `/api/species/${editingId}` : "/api/species";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchSpecies();
        setShowForm(false);
        setEditingId(null);
        setEditingData(null);
      } else {
        throw new Error(data.error || "Failed to save species");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this species?")) return;

    try {
      const res = await fetch(`/api/species/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchSpecies();
      }
    } catch (error) {
      console.error("Error deleting species:", error);
    }
  }

  const filteredSpecies = species.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Species Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage DNA species for your lab
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setEditingData(null);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus size={20} />
          Add Species
        </Button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingId ? "Edit Species" : "New Species"}
          </h2>
          <SpeciesForm
            initialData={editingData}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingId(null);
              setEditingData(null);
            }}
          />
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search species..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredSpecies.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? "No species found" : "No species created yet"}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecies.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <td className="px-6 py-3 text-gray-900 dark:text-white font-medium">
                    {item.name}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {item.description || "-"}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingId(item._id);
                          setEditingData(item);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-600 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
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
    </div>
  );
}
