"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FileText, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Stats = {
  totalQuotes: number;
  sentQuotes: number;
  acceptedQuotes: number;
  totalValue: number;
  acceptedValue: number;
  conversionRate: number;
};

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalQuotes: 0, sentQuotes: 0, acceptedQuotes: 0,
    totalValue: 0, acceptedValue: 0, conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (session?.user?.id) loadStats(); }, [session]);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/quotes/stats");
      if (res.ok) setStats(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center gap-2 text-gray-500 mb-2"><FileText className="w-5 h-5" /><span className="text-sm">Total Quotes</span></div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalQuotes}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center gap-2 text-blue-500 mb-2"><Clock className="w-5 h-5" /><span className="text-sm">Sent / Pending</span></div>
          <p className="text-2xl font-bold text-blue-600">{stats.sentQuotes}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center gap-2 text-green-500 mb-2"><CheckCircle className="w-5 h-5" /><span className="text-sm">Accepted Value</span></div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.acceptedValue)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center gap-2 text-indigo-500 mb-2"><TrendingUp className="w-5 h-5" /><span className="text-sm">Conversion Rate</span></div>
          <p className="text-2xl font-bold text-indigo-600">{stats.conversionRate}%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="font-medium mb-3 text-gray-700">Quick Actions</h3>
        <div className="flex gap-3">
          <a href="/dashboard/quotes/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2">
            <FileText className="w-4 h-4" /> Create Quote
          </a>
          <a href="/dashboard/clients" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition flex items-center gap-2">
            Manage Clients
          </a>
          <a href="/dashboard/quotes" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition flex items-center gap-2">
            View All Quotes
          </a>
        </div>
      </div>
    </div>
  );
}
