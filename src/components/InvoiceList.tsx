"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchInvoices, deleteInvoice } from "@/lib/invoice-utils";
import { formatCurrency, formatDate, getStatusColor, calculateSubtotal, calculateTax, calculateTotal } from "@/lib/utils";
import { FileText, Trash2, Eye, Edit, Plus } from "lucide-react";

type InvoiceType = {
  id: string; invoiceNo: string; status: string; issueDate: string; dueDate: string | null;
  currency: string; taxRate: number; discount: number;
  client: { id: string; name: string };
  items: { description: string; quantity: number; unitPrice: number }[];
};

export default function InvoiceList() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadInvoices(); }, []);

  const loadInvoices = async () => {
    try { const data = await fetchInvoices(); setInvoices(data); }
    catch (err) { console.error("Failed to load invoices"); }
    finally { setLoading(false); }
  };

  const handleDel = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    try { await deleteInvoice(id); setInvoices(invoices.filter(inv => inv.id !== id)); }
    catch (err) { alert("Failed to delete invoice"); }
  };

  const getTotal = (inv: InvoiceType) => {
    const sub = calculateSubtotal(inv.items);
    const tax = calculateTax(sub, inv.taxRate);
    return calculateTotal(sub, tax, inv.discount);
  };

  const filtered = filter === "all" ? invoices : invoices.filter(inv => inv.status === filter);

  const counts: Record<string, number> = {};
  invoices.forEach(inv => { counts[inv.status] = (counts[inv.status] || 0) + 1; });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  if (invoices.length === 0) return (
    <div className="text-center py-12">
      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700">No invoices yet</h3>
      <p className="text-gray-500 mt-2">Create your first invoice to get started</p>
      <button onClick={() => router.push("/dashboard/invoices/new")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 mx-auto">
        <Plus className="w-4 h-4" /> Create Invoice
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Invoices ({invoices.length})</h2>
        <button onClick={() => router.push("/dashboard/invoices/new")} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
          All ({invoices.length})
        </button>
        {Object.entries(counts).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === k ? getStatusColor(k) : "bg-gray-100 text-gray-600"}`}>
            {k.charAt(0).toUpperCase() + k.slice(1)} ({v})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Invoice</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Client</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{inv.invoiceNo}</td>
                  <td className="px-4 py-3 text-gray-700">{inv.client?.name || "\u2014"}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(inv.issueDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(getTotal(inv), inv.currency)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => router.push(`/dashboard/invoices/${inv.id}`)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => router.push(`/dashboard/invoices/${inv.id}/edit`)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDel(inv.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
