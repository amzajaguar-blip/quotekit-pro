import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  pg:{padding:50,fontSize:10,fontFamily:"Helvetica"},
  tbar:{flexDirection:"row",justifyContent:"space-between",borderBottomWidth:2,borderBottomColor:"#1a1a1a",paddingBottom:15,marginBottom:30},
  comp:{fontSize:18,fontFamily:"Helvetica-Bold"},
  ilbl:{fontSize:8,color:"#999",textTransform:"uppercase"},ino:{fontSize:12,fontFamily:"Helvetica-Bold"},
  ft:{flexDirection:"row",justifyContent:"space-between",marginBottom:40},sec:{width:"45%"},
  lbl:{fontSize:9,fontFamily:"Helvetica-Bold",color:"#1a1a1a",marginBottom:6,textTransform:"uppercase",borderBottomWidth:1,borderBottomColor:"#1a1a1a",paddingBottom:3},
  nm:{fontSize:11,fontFamily:"Helvetica-Bold",marginTop:6},det:{fontSize:9,color:"#666",marginTop:2},
  dr:{flexDirection:"row",justifyContent:"space-between",marginBottom:20,fontSize:9,color:"#666"},
  th:{flexDirection:"row",borderBottomWidth:2,borderBottomColor:"#1a1a1a",paddingBottom:8,marginBottom:4},
  tr:{flexDirection:"row",paddingVertical:6,borderBottomWidth:.5,borderBottomColor:"#ccc"},
  cd:{width:"50%",paddingRight:10},cq:{width:"15%",textAlign:"right"},cp:{width:"15%",textAlign:"right"},ca:{width:"20%",textAlign:"right"},
  ht:{fontSize:9,fontFamily:"Helvetica-Bold",color:"#1a1a1a"},rt:{fontSize:10},rb:{fontSize:10,fontFamily:"Helvetica-Bold"},
  tsect:{marginTop:30},
  trow:{flexDirection:"row",justifyContent:"flex-end",marginTop:4},
  tlab:{width:"30%",textAlign:"left",fontSize:10,color:"#666"},tval:{width:"20%",textAlign:"right",fontSize:10,fontFamily:"Helvetica-Bold"},
  gtrow:{flexDirection:"row",justifyContent:"flex-end",marginTop:10,borderTopWidth:2,borderTopColor:"#1a1a1a",paddingTop:10},
  glab:{width:"30%",textAlign:"left",fontSize:12,fontFamily:"Helvetica-Bold"},gval:{width:"20%",textAlign:"right",fontSize:14,fontFamily:"Helvetica-Bold",color:"#1a1a1a"},
  nsect:{marginTop:40,borderTopWidth:1,borderTopColor:"#ccc",paddingTop:15},nlbl:{fontSize:9,fontFamily:"Helvetica-Bold",textTransform:"uppercase",marginBottom:6},ntxt:{fontSize:9,color:"#666"},
  ftr:{position:"absolute",bottom:30,left:50,right:50,textAlign:"center",borderTopWidth:1,borderTopColor:"#ccc",paddingTop:10},ftxt:{fontSize:8,color:"#999"},
  logo:{width:80,height:40,borderWidth:1,borderColor:"#ccc",alignItems:"center",justifyContent:"center"},ltxt:{fontSize:8,color:"#999"},
});

type Item = { description:string; quantity:number; unitPrice:number };
type Props = { invoiceNo:string;status:string;issueDate:string;dueDate:string|null; clientName:string;clientEmail:string|null;clientAddress:string|null; clientCity:string|null;clientState:string|null;clientZip:string|null;clientCountry:string|null; items:Item[];subtotal:number;taxRate:number;tax:number;discount:number;total:number;currency:string;notes:string|null; };

export function CorporateTemplate(p: Props) {
  const sym:Record<string,string>={USD:"$",EUR:"€",GBP:"£",JPY:"¥",CAD:"C$",AUD:"A$"};const c=sym[p.currency]||"$";const f=(n:number)=>`${c}${n.toFixed(2)}`;
  return (
    <Document>
      <Page size="A4" style={s.pg}>
        <View style={s.tbar}><View><View style={s.logo}><Text style={s.ltxt}>YOUR LOGO</Text></View><Text style={[s.comp,{marginTop:8}]}>Your Company Name</Text></View><View style={{textAlign:"right"}}><Text style={s.ilbl}>INVOICE</Text><Text style={s.ino}>{p.invoiceNo}</Text></View></View>
        <View style={s.ft}><View style={s.sec}><Text style={s.lbl}>FROM</Text><Text style={s.nm}>Your Company Name</Text><Text style={s.det}>your@company.com</Text></View><View style={s.sec}><Text style={s.lbl}>BILL TO</Text><Text style={s.nm}>{p.clientName}</Text>{p.clientEmail&&<Text style={s.det}>{p.clientEmail}</Text>}{p.clientAddress&&<Text style={s.det}>{p.clientAddress}</Text>}{p.clientCity&&<Text style={s.det}>{p.clientCity}{p.clientState?`, ${p.clientState}`:""} {p.clientZip||""}</Text>}{p.clientCountry&&<Text style={s.det}>{p.clientCountry}</Text>}</View></View>
        <View style={s.dr}><Text>Issue Date: {p.issueDate}</Text>{p.dueDate&&<Text>Due Date: {p.dueDate}</Text>}<Text>Status: {p.status.toUpperCase()}</Text></View>
        <View style={s.th}><Text style={[s.ht,s.cd]}>Description</Text><Text style={[s.ht,s.cq]}>Qty</Text><Text style={[s.ht,s.cp]}>Price</Text><Text style={[s.ht,s.ca]}>Amount</Text></View>
        {p.items.map((it,i)=><View key={i} style={s.tr}><Text style={[s.rt,s.cd]}>{it.description}</Text><Text style={[s.rt,s.cq]}>{it.quantity}</Text><Text style={[s.rt,s.cp]}>{f(it.unitPrice)}</Text><Text style={[s.rb,s.ca]}>{f(it.quantity*it.unitPrice)}</Text></View>)}
        <View style={s.tsect}><View style={s.trow}><Text style={s.tlab}>Subtotal</Text><Text style={s.tval}>{f(p.subtotal)}</Text></View>{p.taxRate>0&&<View style={s.trow}><Text style={s.tlab}>Tax ({p.taxRate}%)</Text><Text style={s.tval}>{f(p.tax)}</Text></View>}{p.discount>0&&<View style={s.trow}><Text style={s.tlab}>Discount</Text><Text style={[s.tval,{color:"#dc2626"}]}>-{f(p.discount)}</Text></View>}<View style={s.gtrow}><Text style={s.glab}>TOTAL DUE</Text><Text style={s.gval}>{f(p.total)}</Text></View></View>
        {p.notes&&<View style={s.nsect}><Text style={s.nlbl}>TERMS & NOTES</Text><Text style={s.ntxt}>{p.notes}</Text></View>}
        <View style={s.ftr}><Text style={s.ftxt}>Thank you for your business</Text></View>
      </Page>
    </Document>
  );
}
