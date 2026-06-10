export function formatCurrency(amount: number, currency: string = "USD"): string {
  const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", CAD: "C$", AUD: "A$" };
  return `${symbols[currency] || "$"}${amount.toFixed(2)}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft:    "bg-gray-100 text-gray-700",
    sent:     "bg-blue-100 text-blue-700",
    accepted: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
    expired:  "bg-yellow-100 text-yellow-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function calculateSubtotal(items: { quantity: number; unitPrice: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100);
}

export function calculateTotal(subtotal: number, tax: number, discount: number): number {
  return subtotal + tax - discount;
}
