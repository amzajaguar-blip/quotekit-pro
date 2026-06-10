"use client";
import { useState, useEffect } from "react";
import { fetchQuote } from "@/lib/quote-utils";
import QuoteForm from "@/components/QuoteForm";

export default function EditQuotePage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuote(params.id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return <QuoteForm editId={params.id} initialData={data} />;
}
