"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
}

export function SettingsForm({
  initialData,
  onSubmit,
}: SettingsFormProps) {
  const [formData, setFormData] = useState({
    office_name: "",
    office_address: "",
    office_phone: "",
    office_email: "",
    logo_url: "/placeholder-logo.png",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg">
          Settings saved successfully!
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Office Name *
        </label>
        <input
          type="text"
          required
          value={formData.office_name}
          onChange={(e) =>
            setFormData({ ...formData, office_name: e.target.value })
          }
          placeholder="e.g., DNA Lab"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Office Address
        </label>
        <textarea
          value={formData.office_address}
          onChange={(e) =>
            setFormData({ ...formData, office_address: e.target.value })
          }
          placeholder="Full office address"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Office Phone
        </label>
        <input
          type="tel"
          value={formData.office_phone}
          onChange={(e) =>
            setFormData({ ...formData, office_phone: e.target.value })
          }
          placeholder="e.g., 03001234567"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Office Email
        </label>
        <input
          type="email"
          value={formData.office_email}
          onChange={(e) =>
            setFormData({ ...formData, office_email: e.target.value })
          }
          placeholder="e.g., info@dnalab.com"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Logo Preview
        </label>
        <div className="w-32 h-32 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center p-2 border-2 border-dashed border-gray-300 dark:border-gray-600">
          <img
            src={formData.logo_url}
            alt="Logo"
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Current: {formData.logo_url}
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
