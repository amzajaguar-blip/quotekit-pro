import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  pg:{padding:40,fontSize:10,fontFamily:"Helvetica"},
  hdr:{marginBottom:30},
  title:{fontSize:24,fontFamily:"Helvetica-Bold",color:"#1a1a1a"},
  no:{fontSize:10,color:"#666",marginTop:4},
  ft:{flexDirection:"row",justifyContent:"space-between",marginBottom:30},
  sec:{width:"48%"},
  lbl:{fontSize:8,color:"#999",marginBottom:4,textTransform:"uppercase"},
  nm:{fontSize:12,fontFamily:"Helvetica-Bold"},
  det:{fontSize:10,color:"#666",marginTop:2},
  th:{flexDirection:"row",borderBottomWidth:1,borderBottomColor:"#333",paddingBottom:6,marginBottom:6},
  tr:{flexDirection:"row",borderBottomWidth:.5,borderBottomColor:"#eee",paddingBottom:6,paddingTop:6},
  cd:{width:"50%"},cq:{width:"15%",textAlign:"right"},cp:{width:"15%",textAlign:"right"},ca:{width:"20%",textAlign:"right"},
  ht:{fontSize:8,fontFamily:"Helvetica-Bold",textTransform:"uppercase",color:"#666"},
  rt:{fontSize:10},rb:{fontSize:10,fontFamily:"Helvetica-Bold"},
  tot:{marginTop:20},
  trow:{flexDirection:"row",justifyContent:"space-between",marginTop:4},
  tlab:{fontSize:10,color:"#666"},tval:{fontSize:10,fontFamily:"Helvetica-Bold"},
  gtot:{flexDirection:"row",justifyContent:"space-between",marginTop:10,borderTopWidth:1,borderTopColor:"#333",paddingTop:10},
  glab:{fontSize:12,fontFamily:"Helvetica-Bold"},gval:{fontSize:14,fontFamily:"Helvetica-Bold",color:"#2563eb"},
  nts:{marginTop:30,fontSize:9,color:"#666"},
});

type Item = { description:string; quantity:number; unitPrice:number };
type Props = {
  invoiceNo:string;status:string;issueDate:string;dueDate:string|null;
  clientName:string;clientEmail:string|null;clientAddress:string|null;
  clientCity:string|null;clientState:string|null;clientZip:string|null;clientCountry:string|null;
  items:Item[];subtotal:number;taxRate:number;tax:number;discount:number;total:number;currency:string;notes:string|null;
};

export function MinimalTemplate(p: Props) {
  const sym:Record<string,string>={USD:"$",EUR:"€",GBP:"£",JPY:"¥",CAD:"C$",AUD:"A$"};
  const c=sym[p.currency]||"$";const f=(n:number)=>`${c}${n.toFixed(2)}`;
  return (
    <Document>
      <Page size="A4" style={s.pg}>
        <View style={s.hdr}><Text style={s.title}>INVOICE</Text><Text style={s.no}>{p.invoiceNo}</Text></View>
        <View style={s.ft}>
          <View style={s.sec}><Text style={s.lbl}>FROM</Text><Text style={s.nm}>Your Company</Text></View>
          <View style={s.sec}><Text style={s.lbl}>BILL TO</Text><Text style={s.nm}>{p.clientName}</Text>{p.clientEmail&&<Text style={s.det}>{p.clientEmail}</Text>}{p.clientAddress&&<Text style={s.det}>{p.clientAddress}</Text>}{p.clientCity&&<Text style={s.det}>{p.clientCity}{p.clientState?`, ${p.clientState}`:""} {p.clientZip||""}</Text>}{p.clientCountry&&<Text style={s.det}>{p.clientCountry}</Text>}</View>
        </View>
        <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:20}}><Text style={{fontSize:9,color:"#666"}}>Issue: {p.issueDate}</Text>{p.dueDate&&<Text style={{fontSize:9,color:"#666"}}>Due: {p.dueDate}</Text>}</View>
        <View style={s.th}><Text style={[s.ht,s.cd]}>Description</Text><Text style={[s.ht,s.cq]}>Qty</Text><Text style={[s.ht,s.cp]}>Price</Text><Text style={[s.ht,s.ca]}>Amount</Text></View>
        {p.items.map((it,i)=><View key={i} style={s.tr}><Text style={[s.rt,s.cd]}>{it.description}</Text><Text style={[s.rt,s.cq]}>{it.quantity}</Text><Text style={[s.rt,s.cp]}>{f(it.unitPrice)}</Text><Text style={[s.rb,s.ca]}>{f(it.quantity*it.unitPrice)}</Text></View>)}
        <View style={s.tot}><View style={s.trow}><Text style={s.tlab}>Subtotal</Text><Text style={s.tval}>{f(p.subtotal)}</Text></View>{p.taxRate>0&&<View style={s.trow}><Text style={s.tlab}>Tax ({p.taxRate}%)</Text><Text style={s.tval}>{f(p.tax)}</Text></View>}{p.discount>0&&<View style={s.trow}><Text style={s.tlab}>Discount</Text><Text style={[s.tval,{color:"#dc2626"}]}>-{f(p.discount)}</Text></View>}<View style={s.gtot}><Text style={s.glab}>Total</Text><Text style={s.gval}>{f(p.total)}</Text></View></View>
        {p.notes&&<Text style={s.nts}>Notes: {p.notes}</Text>}
      </Page>
    </Document>
  );
}
