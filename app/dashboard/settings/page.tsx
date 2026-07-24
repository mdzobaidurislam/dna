"use client";

import { useState, useEffect } from "react";
import { SettingsForm } from "@/components/forms/SettingsForm";

interface Settings {
  _id: string;
  office_name: string;
  office_address: string;
  office_phone: string;
  office_email: string;
  logo_url: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData: any) {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      } else {
        throw new Error(data.error || "Failed to save settings");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure office information and display settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Office Information
            </h2>
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <SettingsForm
                initialData={settings}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>

        {/* Info Box */}
        <div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-4">
              Information
            </h3>
            <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
              <li>✓ Office information is displayed on invoices</li>
              <li>✓ Keep details updated for accurate invoicing</li>
              <li>✓ Logo appears in PDF exports</li>
              <li>✓ Changes are saved immediately</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mt-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Current Settings
            </h3>
            {settings ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {settings.office_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {settings.office_phone || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {settings.office_email || "Not set"}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
