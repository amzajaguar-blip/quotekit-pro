export async function fetchClients() {
  const res = await fetch("/api/clients");
  if (!res.ok) throw new Error("Failed to fetch clients");
  return res.json();
}

export async function fetchQuotes() {
  const res = await fetch("/api/quotes");
  if (!res.ok) throw new Error("Failed to fetch quotes");
  return res.json();
}

export async function fetchQuote(id: string) {
  const res = await fetch(`/api/quotes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch quote");
  return res.json();
}

export async function createQuote(data: any) {
  const res = await fetch("/api/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed to create quote"); }
  return res.json();
}

export async function updateQuote(id: string, data: any) {
  const res = await fetch(`/api/quotes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed to update quote"); }
  return res.json();
}

export async function deleteQuote(id: string) {
  const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete quote");
  return res.json();
}

export async function createClient(data: any) {
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed to create client"); }
  return res.json();
}

export async function deleteClient(id: string) {
  const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed to delete client"); }
  return res.json();
}

export async function generateNextQuoteNo() {
  const quotes = await fetchQuotes();
  const nums = quotes.map((q: any) => {
    const m = q.quoteNo?.match(/QT-(\d+)/);
    return m ? parseInt(m[1]) : 0;
  });
  return `QT-${String((nums.length > 0 ? Math.max(...nums) : 0) + 1).padStart(4, "0")}`;
}
