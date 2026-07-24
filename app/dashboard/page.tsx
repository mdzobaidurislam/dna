"use client";

import { useEffect, useState } from "react";
import { Package, Users, Dna, FileText } from "lucide-react";

interface Stats {
  orders: number;
  customers: number;
  species: number;
  pending: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    orders: 0,
    customers: 0,
    species: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [ordersRes, customersRes, speciesRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/customers"),
          fetch("/api/species"),
        ]);

        const ordersData = await ordersRes.json();
        const customersData = await customersRes.json();
        const speciesData = await speciesRes.json();

        const pendingOrders = ordersData.data?.filter(
          (o: any) => o.status === "pending"
        ).length || 0;

        setStats({
          orders: ordersData.data?.length || 0,
          customers: customersData.data?.length || 0,
          species: speciesData.data?.length || 0,
          pending: pendingOrders,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Orders",
      value: stats.orders,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Species",
      value: stats.species,
      icon: Dna,
      color: "bg-purple-500",
    },
    {
      title: "Pending Orders",
      value: stats.pending,
      icon: FileText,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to DNA Lab Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white dark:bg-slate-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {loading ? "-" : card.value}
                  </p>
                </div>
                <div className={`${card.color} p-4 rounded-lg`}>
                  <Icon size={32} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Start Guide
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>✓ Go to Species to add new species for testing</li>
          <li>✓ Go to Customers to manage customer information</li>
          <li>✓ Go to Orders to create and manage DNA orders</li>
          <li>✓ Configure office settings in Settings page</li>
          <li>✓ Export orders as PDF or Excel from Orders page</li>
        </ul>
      </div>
    </div>
  );
}
