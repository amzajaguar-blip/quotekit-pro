import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  pg:  { padding: 0, fontSize: 10, fontFamily: "Helvetica" },
  hbg: { backgroundColor: "#4f46e5", padding: 30, paddingBottom: 20 },
  hc:  { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 28, fontFamily: "Helvetica-Bold", color: "#fff" },
  no:    { fontSize: 12, color: "#c7d2fe", marginTop: 4 },
  ttl:   { fontSize: 11, color: "#e0e7ff", marginTop: 3, fontStyle: "italic" },
  di:    { color: "#c7d2fe", fontSize: 10 },
  body:  { padding: 30 },
  ft:    { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  sec:   { width: "48%" },
  lbl:   { fontSize: 8, color: "#4f46e5", marginBottom: 4, fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
  nm:    { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
  det:   { fontSize: 10, color: "#666", marginTop: 2 },
  validBox: { backgroundColor: "#ede9fe", borderRadius: 6, padding: 8, marginBottom: 20 },
  validTxt: { fontSize: 9, color: "#4f46e5", fontFamily: "Helvetica-Bold" },
  th:    { flexDirection: "row", backgroundColor: "#f1f5f9", padding: 8, borderRadius: 4 },
  tr:    { flexDirection: "row", padding: 8, borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0" },
  cd:    { width: "50%" }, cq: { width: "15%", textAlign: "right" }, cp: { width: "15%", textAlign: "right" }, ca: { width: "20%", textAlign: "right" },
  ht:    { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#4f46e5" },
  rt:    { fontSize: 10, color: "#333" },
  rb:    { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
  tbox:  { backgroundColor: "#f8fafc", padding: 16, borderRadius: 8, marginTop: 20 },
  trow:  { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  tlab:  { fontSize: 10, color: "#666" },
  tval:  { fontSize: 10, fontFamily: "Helvetica-Bold" },
  gtot:  { flexDirection: "row", justifyContent: "space-between", marginTop: 8, borderTopWidth: 2, borderTopColor: "#4f46e5", paddingTop: 8 },
  glab:  { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
  gval:  { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#4f46e5" },
  nts:   { marginTop: 16, fontSize: 9, color: "#666" },
  termsBox: { marginTop: 12, borderTopWidth: 0.5, borderTopColor: "#e2e8f0", paddingTop: 10 },
  termsLbl: { fontSize: 8, color: "#4f46e5", fontFamily: "Helvetica-Bold", textTransform: "uppercase", marginBottom: 4 },
  termsTxt: { fontSize: 9, color: "#888" },
  ftr:   { position: "absolute", bottom: 30, left: 30, right: 30, flexDirection: "row", justifyContent: "center" },
  ftxt:  { fontSize: 8, color: "#999" },
});

type Item = { description: string; quantity: number; unitPrice: number };
type Props = {
  quoteNo: string; title: string | null; status: string;
  issueDate: string; validUntil: string | null;
  clientName: string; clientEmail: string | null; clientAddress: string | null;
  clientCity: string | null; clientState: string | null; clientZip: string | null; clientCountry: string | null;
  items: Item[]; subtotal: number; taxRate: number; tax: number; discount: number; total: number;
  currency: string; notes: string | null; terms: string | null;
};

export function QuoteTemplate(p: Props) {
  const sym: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", CAD: "C$", AUD: "A$" };
  const c = sym[p.currency] || "$";
  const f = (n: number) => `${c}${n.toFixed(2)}`;

  return (
    <Document>
      <Page size="A4" style={s.pg}>
        {/* Header */}
        <View style={s.hbg}>
          <View style={s.hc}>
            <View>
              <Text style={s.title}>QUOTE</Text>
              <Text style={s.no}>{p.quoteNo}</Text>
              {p.title && <Text style={s.ttl}>{p.title}</Text>}
            </View>
            <View>
              <Text style={s.di}>Issued: {p.issueDate}</Text>
              {p.validUntil && <Text style={s.di}>Valid Until: {p.validUntil}</Text>}
            </View>
          </View>
        </View>

        <View style={s.body}>
          {/* Validity notice */}
          {p.validUntil && (
            <View style={s.validBox}>
              <Text style={s.validTxt}>This quote is valid until {p.validUntil}. Prices may change after this date.</Text>
            </View>
          )}

          {/* From / To */}
          <View style={s.ft}>
            <View style={s.sec}>
              <Text style={s.lbl}>FROM</Text>
              <Text style={s.nm}>Your Company Name</Text>
            </View>
            <View style={s.sec}>
              <Text style={s.lbl}>PREPARED FOR</Text>
              <Text style={s.nm}>{p.clientName}</Text>
              {p.clientEmail && <Text style={s.det}>{p.clientEmail}</Text>}
              {p.clientAddress && <Text style={s.det}>{p.clientAddress}</Text>}
              {p.clientCity && <Text style={s.det}>{p.clientCity}{p.clientState ? `, ${p.clientState}` : ""} {p.clientZip || ""}</Text>}
              {p.clientCountry && <Text style={s.det}>{p.clientCountry}</Text>}
            </View>
          </View>

          {/* Items table */}
          <View style={s.th}>
            <Text style={[s.ht, s.cd]}>Description</Text>
            <Text style={[s.ht, s.cq]}>Qty</Text>
            <Text style={[s.ht, s.cp]}>Unit Price</Text>
            <Text style={[s.ht, s.ca]}>Amount</Text>
          </View>
          {p.items.map((it, i) => (
            <View key={i} style={s.tr}>
              <Text style={[s.rt, s.cd]}>{it.description}</Text>
              <Text style={[s.rt, s.cq]}>{it.quantity}</Text>
              <Text style={[s.rt, s.cp]}>{f(it.unitPrice)}</Text>
              <Text style={[s.rb, s.ca]}>{f(it.quantity * it.unitPrice)}</Text>
            </View>
          ))}

          {/* Totals */}
          <View style={s.tbox}>
            <View style={s.trow}><Text style={s.tlab}>Subtotal</Text><Text style={s.tval}>{f(p.subtotal)}</Text></View>
            {p.taxRate > 0 && <View style={s.trow}><Text style={s.tlab}>Tax ({p.taxRate}%)</Text><Text style={s.tval}>{f(p.tax)}</Text></View>}
            {p.discount > 0 && <View style={s.trow}><Text style={s.tlab}>Discount</Text><Text style={[s.tval, { color: "#dc2626" }]}>-{f(p.discount)}</Text></View>}
            <View style={s.gtot}>
              <Text style={s.glab}>Quote Total</Text>
              <Text style={s.gval}>{f(p.total)}</Text>
            </View>
          </View>

          {p.notes && <Text style={s.nts}>Notes: {p.notes}</Text>}

          {p.terms && (
            <View style={s.termsBox}>
              <Text style={s.termsLbl}>Terms & Conditions</Text>
              <Text style={s.termsTxt}>{p.terms}</Text>
            </View>
          )}
        </View>

        <View style={s.ftr}>
          <Text style={s.ftxt}>This is a quote, not an invoice. Acceptance required before work begins.</Text>
        </View>
      </Page>
    </Document>
  );
}
