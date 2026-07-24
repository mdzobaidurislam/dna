import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-4">
            <span className="text-2xl font-bold text-white">🧬</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            DNA Lab System
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
