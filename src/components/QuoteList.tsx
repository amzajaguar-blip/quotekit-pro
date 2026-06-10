"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchQuotes, deleteQuote } from "@/lib/quote-utils";
import { formatCurrency, formatDate, getStatusColor, calculateSubtotal, calculateTax, calculateTotal } from "@/lib/utils";
import { FileText, Trash2, Eye, Edit, Plus } from "lucide-react";

type QuoteType = {
  id: string;
  quoteNo: string;
  title: string | null;
  status: string;
  issueDate: string;
  validUntil: string | null;
  currency: string;
  taxRate: number;
  discount: number;
  client: { id: string; name: string };
  items: { description: string; quantity: number; unitPrice: number }[];
};

export default function QuoteList() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadQuotes(); }, []);

  const loadQuotes = async () => {
    try { const data = await fetchQuotes(); setQuotes(data); }
    catch (err) { console.error("Failed to load quotes"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quote?")) return;
    try { await deleteQuote(id); setQuotes(quotes.filter(q => q.id !== id)); }
    catch { alert("Failed to delete quote"); }
  };

  const getTotal = (q: QuoteType) => {
    const sub = calculateSubtotal(q.items);
    const tax = calculateTax(sub, q.taxRate);
    return calculateTotal(sub, tax, q.discount);
  };

  const filtered = filter === "all" ? quotes : quotes.filter(q => q.status === filter);
  const counts: Record<string, number> = {};
  quotes.forEach(q => { counts[q.status] = (counts[q.status] || 0) + 1; });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (quotes.length === 0) return (
    <div className="text-center py-12">
      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700">No quotes yet</h3>
      <p className="text-gray-500 mt-2">Create your first quote to get started</p>
      <button onClick={() => router.push("/dashboard/quotes/new")} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 mx-auto">
        <Plus className="w-4 h-4" /> Create Quote
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Quotes ({quotes.length})</h2>
        <button onClick={() => router.push("/dashboard/quotes/new")} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Quote
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
          All ({quotes.length})
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
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Quote</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Client</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Valid Until</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(q => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{q.quoteNo}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{q.title || "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{q.client?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{q.validUntil ? formatDate(q.validUntil) : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(q.status)}`}>
                      {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(getTotal(q), q.currency)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => router.push(`/dashboard/quotes/${q.id}`)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => router.push(`/dashboard/quotes/${q.id}/edit`)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete">
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
