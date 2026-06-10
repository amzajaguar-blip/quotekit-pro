"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchInvoice } from "@/lib/invoice-utils";
import { formatCurrency, formatDate, getStatusColor, calculateSubtotal, calculateTax, calculateTotal } from "@/lib/utils";
import { FileText, Download, Edit, ArrowLeft } from "lucide-react";

type InvD = { id:string;invoiceNo:string;status:string;issueDate:string;dueDate:string|null;notes:string|null;taxRate:number;discount:number;currency:string;client:{id:string;name:string;email:string|null;address:string|null;city:string|null;state:string|null;zip:string|null;country:string|null};items:{id:string;description:string;quantity:number;unitPrice:number}[] };

export default function InvoiceDetailPage() {
  const router = useRouter();const params = useParams();const id=params.id as string;
  const [inv,setInv]=useState<InvD|null>(null);const [loading,setLoading]=useState(true);
  const [downloading,setDownloading]=useState(false);const [tpl,setTpl]=useState("minimal");

  useEffect(()=>{load();},[id]);
  const load=async()=>{try{setInv(await fetchInvoice(id));}catch{}finally{setLoading(false);}};
  const downloadPdf=async()=>{if(!inv)return;setDownloading(true);try{const r=await fetch(`/api/invoices/${id}/pdf?template=${tpl}`);if(!r.ok)throw new Error();const b=await r.blob();const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`${inv.invoiceNo}.pdf`;a.click();URL.revokeObjectURL(u);}catch{alert("PDF generation failed");}finally{setDownloading(false);}};

  if(loading)return<div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>;
  if(!inv)return<div className="text-center py-12"><p className="text-gray-500">Invoice not found</p><button onClick={()=>router.push("/dashboard/invoices")} className="mt-4 text-blue-600">Back</button></div>;

  const sub=calculateSubtotal(inv.items);const tax=calculateTax(sub,inv.taxRate);const tot=calculateTotal(sub,tax,inv.discount);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={()=>router.push("/dashboard/invoices")} className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-600"/></button>
          <FileText className="w-5 h-5 text-blue-600"/><h2 className="text-xl font-bold">{inv.invoiceNo}</h2>
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>{inv.status[0].toUpperCase()+inv.status.slice(1)}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>router.push(`/dashboard/invoices/${id}/edit`)} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"><Edit className="w-4 h-4"/>Edit</button>
          <button onClick={downloadPdf} disabled={downloading} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium disabled:bg-blue-400"><Download className="w-4 h-4"/>{downloading?"Generating...":"Download PDF"}</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-4"><h3 className="text-sm font-medium text-gray-700 mb-3">PDF Template</h3><div className="grid grid-cols-3 gap-3">{[{id:"minimal",label:"Minimal",desc:"Clean, simple"},{id:"modern",label:"Modern",desc:"Blue header, styled"},{id:"corporate",label:"Corporate",desc:"Formal, professional"}].map(t=><button key={t.id} onClick={()=>setTpl(t.id)} className={`p-3 rounded-lg border-2 text-left transition ${tpl===t.id?"border-blue-500 bg-blue-50":"border-gray-200 hover:border-gray-300"}`}><span className="font-medium text-gray-900">{t.label}</span><span className="block text-xs text-gray-500">{t.desc}</span></button>)}</div></div>
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex justify-between items-start mb-8"><div><h2 className="text-2xl font-bold text-gray-900">INVOICE</h2><p className="text-gray-600 mt-1">{inv.invoiceNo}</p></div><div className="text-right"><p className="text-gray-600">Issue: {formatDate(inv.issueDate)}</p>{inv.dueDate&&<p className="text-gray-600">Due: {formatDate(inv.dueDate)}</p>}</div></div>
        <div className="grid grid-cols-2 gap-8 mb-8"><div><h4 className="text-sm font-medium text-gray-500 mb-2 uppercase">From</h4><p className="text-gray-900 font-medium">Your Company</p></div><div><h4 className="text-sm font-medium text-gray-500 mb-2 uppercase">Bill To</h4><p className="text-gray-900 font-medium">{inv.client.name}</p>{inv.client.email&&<p className="text-gray-600 text-sm">{inv.client.email}</p>}{inv.client.address&&<p className="text-gray-600 text-sm">{inv.client.address}</p>}{inv.client.city&&<p className="text-gray-600 text-sm">{inv.client.city}, {inv.client.state||""} {inv.client.zip||""}</p>}{inv.client.country&&<p className="text-gray-600 text-sm">{inv.client.country}</p>}</div></div>
        <table className="w-full mb-6"><thead><tr className="border-b-2 border-gray-200"><th className="text-left py-3 text-sm font-medium text-gray-500 uppercase">Description</th><th className="text-right py-3 text-sm font-medium text-gray-500 uppercase">Qty</th><th className="text-right py-3 text-sm font-medium text-gray-500 uppercase">Price</th><th className="text-right py-3 text-sm font-medium text-gray-500 uppercase">Amount</th></tr></thead><tbody>{inv.items.map(it=><tr key={it.id} className="border-b border-gray-100"><td className="py-3 text-gray-900">{it.description}</td><td className="py-3 text-right text-gray-700">{it.quantity}</td><td className="py-3 text-right text-gray-700">{formatCurrency(it.unitPrice,inv.currency)}</td><td className="py-3 text-right font-medium">{formatCurrency(it.quantity*it.unitPrice,inv.currency)}</td></tr>)}</tbody></table>
        <div className="border-t-2 border-gray-200 pt-4"><div className="flex justify-between mb-2"><span className="text-gray-600">Subtotal</span><span className="font-medium">{formatCurrency(sub,inv.currency)}</span></div>{inv.taxRate>0&&<div className="flex justify-between mb-2"><span className="text-gray-600">Tax ({inv.taxRate}%)</span><span className="font-medium">{formatCurrency(tax,inv.currency)}</span></div>}{inv.discount>0&&<div className="flex justify-between mb-2"><span className="text-gray-600">Discount</span><span className="font-medium text-red-600">-{formatCurrency(inv.discount,inv.currency)}</span></div>}<div className="flex justify-between border-t pt-3 mt-3"><span className="font-bold text-gray-900">Total</span><span className="text-xl font-bold text-blue-600">{formatCurrency(tot,inv.currency)}</span></div></div>
        {inv.notes&&<div className="mt-6 pt-6 border-t"><h4 className="text-sm font-medium text-gray-500 mb-2 uppercase">Notes</h4><p className="text-gray-700 text-sm">{inv.notes}</p></div>}
      </div>
    </div>
  );
}
