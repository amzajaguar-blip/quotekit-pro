"use client";
import { useState, useEffect } from "react";
import { fetchClients, createClient, deleteClient } from "@/lib/invoice-utils";
import { Users, Plus, Trash2, Mail, Phone, MapPin } from "lucide-react";

type Cl = { id:string; name:string; email:string|null; phone:string|null; address:string|null; city:string|null; state:string|null; zip:string|null; country:string|null; invoices:{id:string}[] };

export default function ClientManager() {
  const [clients, setClients] = useState<Cl[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(""); const [city, setCity] = useState(""); const [state, setState] = useState("");
  const [zip, setZip] = useState(""); const [country, setCountry] = useState("");

  useEffect(()=>{load();},[]);
  const load = async () => { try { setClients(await fetchClients()); } catch{} finally { setLoading(false); } };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!name.trim()) { setError("Client name required"); return; }
    try { await createClient({name,email,phone,address,city,state,zip,country}); setSuccess("Client added!"); reset(); setShow(false); load(); }
    catch (err: any) { setError(err.message||"Failed"); }
  };
  const handleDel = async (id:string) => { if(!confirm("Delete?")) return; try { await deleteClient(id); setClients(clients.filter(c=>c.id!==id)); } catch(err:any) { alert(err.message||"Failed"); } };
  const reset = () => { setName(""); setEmail(""); setPhone(""); setAddress(""); setCity(""); setState(""); setZip(""); setCountry(""); };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5"/>Clients ({clients.length})</h2><button onClick={()=>setShow(!show)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"><Plus className="w-4 h-4"/>Add Client</button></div>
      {error&&<div className="bg-red-50 text-red-700 p-3 rounded-lg">{error}</div>}
      {success&&<div className="bg-green-50 text-green-700 p-3 rounded-lg">{success}</div>}
      {show&&<div className="bg-white rounded-xl shadow-sm border p-6"><h3 className="font-medium text-gray-900 mb-4">New Client</h3><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Client name"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="client@email.com"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="text" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Country</label><input type="text" value={country} onChange={e=>setCountry(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" value={address} onChange={e=>setAddress(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" value={city} onChange={e=>setCity(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">State / ZIP</label><div className="flex gap-2"><input type="text" value={state} onChange={e=>setState(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="CA"/><input type="text" value={zip} onChange={e=>setZip(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="90210"/></div></div></div><div className="flex gap-3"><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Save Client</button><button type="button" onClick={()=>{setShow(false);reset();}} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">Cancel</button></div></form></div>}
      {clients.length===0 ? <div className="text-center py-12"><Users className="w-12 h-12 text-gray-300 mx-auto mb-4"/><h3 className="text-lg font-medium text-gray-700">No clients yet</h3><p className="text-gray-500 mt-2">Add your first client</p></div>
      : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{clients.map(c=><div key={c.id} className="bg-white rounded-xl shadow-sm border p-4"><div className="flex items-center justify-between mb-2"><h4 className="font-medium text-gray-900">{c.name}</h4><button onClick={()=>handleDel(c.id)} className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button></div><div className="space-y-1 text-sm text-gray-600">{c.email&&<div className="flex items-center gap-1"><Mail className="w-3 h-3"/>{c.email}</div>}{c.phone&&<div className="flex items-center gap-1"><Phone className="w-3 h-3"/>{c.phone}</div>}{(c.city||c.country)&&<div className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{[c.city,c.state].filter(Boolean).join(", ")} {c.country}</div>}</div><div className="mt-2 text-xs text-gray-400">{c.invoices?.length||0} invoices</div></div>)}</div>}
    </div>
  );
}
