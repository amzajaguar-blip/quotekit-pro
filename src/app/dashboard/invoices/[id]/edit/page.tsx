"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import InvoiceForm from "@/components/InvoiceForm";
import { fetchInvoice } from "@/lib/invoice-utils";

export default function EditInvoicePage() {
  const params = useParams(); const id = params.id as string;
  const [inv, setInv] = useState<any>(null); const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { setInv(await fetchInvoice(id)); } catch { } finally { setLoading(false); } })(); }, [id]);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>;
  if (!inv) return <div className="text-center py-12 text-gray-500">Invoice not found</div>;
  return <InvoiceForm editId={id} initialData={inv} />;
}
