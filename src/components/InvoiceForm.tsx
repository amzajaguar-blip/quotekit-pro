"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createInvoice, updateInvoice, fetchClients, generateNextInvoiceNo } from "@/lib/invoice-utils";
import { formatCurrency, calculateSubtotal, calculateTax, calculateTotal } from "@/lib/utils";
import { FileText, Plus, Trash2, Save, ArrowLeft } from "lucide-react";

type ClientType = { id: string; name: string; email: string | null };
type ItemRow = { description: string; quantity: number; unitPrice: number };

export default function InvoiceForm({ editId, initialData }: { editId?: string; initialData?: any }) {
  const router = useRouter();
  const [clients, setClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [clientId, setClientId] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [status, setStatus] = useState("draft");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState<ItemRow[]>([{ description: "", quantity: 1, unitPrice: 0 }]);

  useEffect(() => {
    loadClients();
    if (!editId) loadNextInvoiceNo();
    if (initialData) popForm(initialData);
  }, []);

  const loadClients = async () => { try { const d = await fetchClients(); setClients(d); } catch { setError("Failed to load clients"); } };
  const loadNextInvoiceNo = async () => { try { setInvoiceNo(await generateNextInvoiceNo()); } catch { setInvoiceNo("INV-0001"); } };
  const popForm = (d: any) => {
    setClientId(d.clientId||""); setInvoiceNo(d.invoiceNo||""); setStatus(d.status||"draft");
    setIssueDate(d.issueDate?new Date(d.issueDate).toISOString().split("T")[0]:new Date().toISOString().split("T")[0]);
    setDueDate(d.dueDate?new Date(d.dueDate).toISOString().split("T")[0]:""); setNotes(d.notes||"");
    setTaxRate(d.taxRate||0); setDiscount(d.discount||0); setCurrency(d.currency||"USD");
    setItems(d.items?.map((i:any)=>({description:i.description,quantity:i.quantity,unitPrice:i.unitPrice}))||[{description:"",quantity:1,unitPrice:0}]);
  };

  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (i: number) => { if (items.length<=1) return; setItems(items.filter((_,j)=>j!==i)); };
  const updateItem = (i: number, f: string, v: any) => { const u = [...items]; u[i] = {...u[i],[f]:v}; setItems(u); };

  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  const total = calculateTotal(subtotal, tax, discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess(false);
    if (!clientId) { setError("Select a client"); return; }
    if (items.some(i=>!i.description)) { setError("All items need a description"); return; }
    setLoading(true);
    try {
      const payload = { clientId, invoiceNo, status, issueDate, dueDate: dueDate||null, notes: notes||null, taxRate, discount, currency, items: items.map(i=>({description:i.description,quantity:Number(i.quantity),unitPrice:Number(i.unitPrice)})) };
      if (editId) { await updateInvoice(editId, payload); setSuccess(true); }
      else { await createInvoice(payload); router.push("/dashboard/invoices"); }
    } catch (err: any) { setError(err.message||"Failed to save"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>router.push("/dashboard/invoices")} className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-600"/></button>
        <FileText className="w-5 h-5 text-blue-600"/><h2 className="text-xl font-bold">{editId?"Edit Invoice":"New Invoice"}</h2>
      </div>
      {error&&<div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
      {success&&<div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">Invoice updated!</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-medium text-gray-900 mb-4">Invoice Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label><input type="text" value={invoiceNo} onChange={e=>setInvoiceNo(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={status} onChange={e=>setStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"><option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select value={currency} onChange={e=>setCurrency(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option><option value="JPY">JPY (¥)</option><option value="CAD">CAD (C$)</option><option value="AUD">AUD (A$)</option></select></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label><input type="date" value={issueDate} onChange={e=>setIssueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-medium text-gray-900 mb-4">Client</h3>
          {clients.length===0 ? <div className="text-gray-500 text-sm">No clients yet. <a href="/dashboard/clients" className="text-blue-600 hover:underline">Add a client first</a>.</div> : <select value={clientId} onChange={e=>setClientId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"><option value="">Select client...</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name} {c.email?`(${c.email})`:""}</option>)}</select>}
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-medium text-gray-900 mb-4">Items</h3>
          <div className="space-y-3">
            {items.map((item,index)=>(
              <div key={index} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5"><input type="text" value={item.description} onChange={e=>updateItem(index,"description",e.target.value)} placeholder="Description" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div>
                <div className="col-span-2"><input type="number" value={item.quantity} onChange={e=>updateItem(index,"quantity",parseFloat(e.target.value)||0)} placeholder="Qty" min="0.01" step="0.01" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div>
                <div className="col-span-3"><input type="number" value={item.unitPrice} onChange={e=>updateItem(index,"unitPrice",parseFloat(e.target.value)||0)} placeholder="Unit Price" min="0" step="0.01" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div>
                <div className="col-span-1 text-right font-medium py-2">{formatCurrency(item.quantity*item.unitPrice,currency)}</div>
                <div className="col-span-1"><button onClick={()=>removeItem(index)} disabled={items.length<=1} className="p-2 rounded-lg hover:bg-red-50 text-red-500 disabled:text-gray-300"><Trash2 className="w-4 h-4"/></button></div>
              </div>
            ))}
          </div>
          <button onClick={addItem} type="button" className="mt-3 flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"><Plus className="w-4 h-4"/> Add Item</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-medium text-gray-900 mb-4">Totals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label><input type="number" value={taxRate} onChange={e=>setTaxRate(parseFloat(e.target.value)||0)} min="0" max="100" step="0.1" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Discount</label><input type="number" value={discount} onChange={e=>setDiscount(parseFloat(e.target.value)||0)} min="0" step="0.01" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div>
          </div>
          <div className="mt-4 space-y-2 text-right">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{formatCurrency(subtotal,currency)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Tax ({taxRate}%):</span><span className="font-medium">{formatCurrency(tax,currency)}</span></div>
            {discount>0&&<div className="flex justify-between"><span className="text-gray-600">Discount:</span><span className="font-medium text-red-600">-{formatCurrency(discount,currency)}</span></div>}
            <div className="flex justify-between border-t pt-2"><span className="text-gray-900 font-bold">Total:</span><span className="text-xl font-bold text-blue-600">{formatCurrency(total,currency)}</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6"><h3 className="font-medium text-gray-900 mb-4">Notes</h3><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Payment instructions, terms..." rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center gap-2"><Save className="w-4 h-4"/>{loading?"Saving...":editId?"Update Invoice":"Create Invoice"}</button>
          {editId&&<button type="button" onClick={()=>router.push(`/dashboard/invoices/${editId}`)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition">Cancel</button>}
        </div>
      </form>
    </div>
  );
}
