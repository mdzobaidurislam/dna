"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  // Optional overrides. By default, files are uploaded to /api/upload
  // (a Next.js route that saves them under /public/uploads). Pass these
  // only if you want to upload somewhere else (e.g. S3, Cloudinary).
  onUploadLogo?: (file: File) => Promise<string>;
  onUploadSignature?: (file: File) => Promise<string>;
}

export function SettingsForm({
  initialData,
  onSubmit,
  onUploadLogo,
  onUploadSignature,
}: SettingsFormProps) {
  const [formData, setFormData] = useState({
    office_name: "",
    office_address: "",
    office_phone: "",
    office_email: "",
    whatsapp_number: "",
    logo_url: "/placeholder-logo.png",
    signature_url: "",
    doctor_name: "",
    doctor_designation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [signatureUploading, setSignatureUploading] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Default uploader: posts the file to our Next.js API route (/api/upload)
  // which saves it under public/uploads and returns a real, persistent URL.
  async function uploadToServer(file: File, type: "logo" | "signature") {
    const body = new FormData();
    body.append("file", file);
    body.append("type", type);

    const res = await fetch("/api/upload", {
      method: "POST",
      body,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data.url as string;
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setLogoUploading(true);
    try {
      const uploadedUrl = onUploadLogo
        ? await onUploadLogo(file)
        : await uploadToServer(file, "logo");
      setFormData((prev) => ({ ...prev, logo_url: uploadedUrl }));
    } catch (err: any) {
      setError(err.message || "Logo upload failed");
    } finally {
      setLogoUploading(false);
      // reset input so selecting the same file again still fires onChange
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  }

  async function handleSignatureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSignatureUploading(true);
    try {
      const uploadedUrl = onUploadSignature
        ? await onUploadSignature(file)
        : await uploadToServer(file, "signature");
      setFormData((prev) => ({ ...prev, signature_url: uploadedUrl }));
    } catch (err: any) {
      setError(err.message || "Signature upload failed");
    } finally {
      setSignatureUploading(false);
      if (signatureInputRef.current) signatureInputRef.current.value = "";
    }
  }

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
      {/* whatsapp_number  */}
          <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Whatsapp Number
        </label>
        <input
          type="tel"
          value={formData.whatsapp_number}
          onChange={(e) =>
            setFormData({ ...formData, whatsapp_number: e.target.value })
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

      {/* Doctor Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Doctor Name
        </label>
        <input
          type="text"
          value={formData.doctor_name}
          onChange={(e) =>
            setFormData({ ...formData, doctor_name: e.target.value })
          }
          placeholder="e.g., Dr. Rahim Uddin"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Doctor Designation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Designation
        </label>
        <input
          type="text"
          value={formData.doctor_designation}
          onChange={(e) =>
            setFormData({ ...formData, doctor_designation: e.target.value })
          }
          placeholder="e.g., MBBS, FCPS (Pathology)"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Logo
        </label>
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 shrink-0">
            <img
              src={formData.logo_url}
              alt="Logo"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex-1">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => logoInputRef.current?.click()}
              disabled={logoUploading}
            >
              {logoUploading ? "Uploading..." : "Upload Logo"}
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 break-all">
              Current: {formData.logo_url}
            </p>
          </div>
        </div>
      </div>

      {/* Signature Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Doctor Signature
        </label>
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 shrink-0">
            {formData.signature_url ? (
              <img
                src={formData.signature_url}
                alt="Signature"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-xs text-gray-400 text-center">
                No signature
              </span>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={signatureInputRef}
              type="file"
              accept="image/*"
              onChange={handleSignatureChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => signatureInputRef.current?.click()}
              disabled={signatureUploading}
            >
              {signatureUploading ? "Uploading..." : "Upload Signature"}
            </Button>
            {formData.signature_url && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 break-all">
                Signature saved
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={loading || logoUploading || signatureUploading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}