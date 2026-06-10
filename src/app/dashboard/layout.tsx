"use client";
import { SessionProvider } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FileText, Plus, Users, BarChart3, LogOut } from "lucide-react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">QuoteKit Pro</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{session?.user?.email}</span>
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </header>
        <nav className="bg-white border-b px-6 py-2">
          <div className="flex gap-6">
            <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600">
              <BarChart3 className="w-4 h-4" /> Overview
            </Link>
            <Link href="/dashboard/quotes/new" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600">
              <Plus className="w-4 h-4" /> New Quote
            </Link>
            <Link href="/dashboard/quotes" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600">
              <FileText className="w-4 h-4" /> Quotes
            </Link>
            <Link href="/dashboard/clients" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600">
              <Users className="w-4 h-4" /> Clients
            </Link>
          </div>
        </nav>
        <main className="p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider><DashboardContent>{children}</DashboardContent></SessionProvider>;
}
