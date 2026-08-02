import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
          <Toaster richColors position="top-right" toastOptions={{ style: { zIndex: 99999999999 } }} />
        <main className="flex-1 bg-gray-50 dark:bg-slate-900 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
