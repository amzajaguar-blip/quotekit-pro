"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchQuote } from "@/lib/quote-utils";
import { formatCurrency, formatDate, getStatusColor, calculateSubtotal, calculateTax, calculateTotal } from "@/lib/utils";
import { ArrowLeft, Edit, Download, FileText } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { QuoteTemplate } from "@/components/pdf/QuoteTemplate";

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { loadQuote(); }, []);

  const loadQuote = async () => {
    try { setQuote(await fetchQuote(params.id)); }
    catch { router.push("/dashboard/quotes"); }
    finally { setLoading(false); }
  };

  const handleDownloadPDF = async () => {
    if (!quote) return;
    setDownloading(true);
    try {
      const subtotal = calculateSubtotal(quote.items);
      const tax = calculateTax(subtotal, quote.taxRate);
      const total = calculateTotal(subtotal, tax, quote.discount);
      const blob = await pdf(
        <QuoteTemplate
          quoteNo={quote.quoteNo}
          title={quote.title}
          status={quote.status}
          issueDate={formatDate(quote.issueDate)}
          validUntil={quote.validUntil ? formatDate(quote.validUntil) : null}
          clientName={quote.client?.name || ""}
          clientEmail={quote.client?.email || null}
          clientAddress={quote.client?.address || null}
          clientCity={quote.client?.city || null}
          clientState={quote.client?.state || null}
          clientZip={quote.client?.zip || null}
          clientCountry={quote.client?.country || null}
          items={quote.items}
          subtotal={subtotal}
          taxRate={quote.taxRate}
          tax={tax}
          discount={quote.discount}
          total={total}
          currency={quote.currency}
          notes={quote.notes}
          terms={quote.terms}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${quote.quoteNo}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); alert("PDF generation failed"); }
    finally { setDownloading(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  if (!quote) return null;

  const subtotal = calculateSubtotal(quote.items);
  const tax = calculateTax(subtotal, quote.taxRate);
  const total = calculateTotal(subtotal, tax, quote.discount);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/quotes")} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold">{quote.quoteNo}</h2>
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push(`/dashboard/quotes/${quote.id}/edit`)} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button onClick={handleDownloadPDF} disabled={downloading} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-400">
            <Download className="w-4 h-4" /> {downloading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm border p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><p className="text-xs text-gray-500 uppercase font-medium">Client</p><p className="font-medium text-gray-900 mt-1">{quote.client?.name}</p></div>
          <div><p className="text-xs text-gray-500 uppercase font-medium">Issue Date</p><p className="font-medium text-gray-900 mt-1">{formatDate(quote.issueDate)}</p></div>
          <div><p className="text-xs text-gray-500 uppercase font-medium">Valid Until</p><p className="font-medium text-gray-900 mt-1">{quote.validUntil ? formatDate(quote.validUntil) : "—"}</p></div>
          <div><p className="text-xs text-gray-500 uppercase font-medium">Currency</p><p className="font-medium text-gray-900 mt-1">{quote.currency}</p></div>
        </div>

        {quote.title && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Title</p>
            <p className="text-gray-900">{quote.title}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Description</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Qty</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Unit Price</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quote.items.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-gray-700">{item.description}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.unitPrice, quote.currency)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice, quote.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-gray-50 border-t">
            <div className="max-w-xs ml-auto space-y-1">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>{formatCurrency(subtotal, quote.currency)}</span></div>
              {quote.taxRate > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Tax ({quote.taxRate}%)</span><span>{formatCurrency(tax, quote.currency)}</span></div>}
              {quote.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Discount</span><span className="text-red-600">-{formatCurrency(quote.discount, quote.currency)}</span></div>}
              <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span className="text-indigo-600 text-lg">{formatCurrency(total, quote.currency)}</span></div>
            </div>
          </div>
        </div>

        {(quote.notes || quote.terms) && (
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            {quote.notes && <div><p className="text-xs text-gray-500 uppercase font-medium mb-1">Notes</p><p className="text-gray-700 text-sm">{quote.notes}</p></div>}
            {quote.terms && <div><p className="text-xs text-gray-500 uppercase font-medium mb-1">Terms & Conditions</p><p className="text-gray-700 text-sm">{quote.terms}</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}
